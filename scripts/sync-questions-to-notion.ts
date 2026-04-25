// Push the current 24 question texts from lib/content.ts to the Notion page
// "02 · Questions du diagnostic". Updates only the 24 numbered_list_item
// blocks in order, leaving the surrounding documentation intact.
//
// Run: npm run sync:notion-questions

import { QUESTIONS } from "../lib/content.ts";

const NOTION_PAGE_ID = "34b6e47a-4422-81dd-851a-c11cda68a0ee";
const NOTION_TOKEN = process.env.NOTION_TOKEN;

if (!NOTION_TOKEN) {
  console.error("Missing NOTION_TOKEN env var.");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${NOTION_TOKEN}`,
  "Notion-Version": "2022-06-28",
  "Content-Type": "application/json",
};

type Block = {
  id: string;
  type: string;
  has_children: boolean;
  [key: string]: unknown;
};

async function fetchAllBlocks(parentId: string): Promise<Block[]> {
  const all: Block[] = [];
  let cursor: string | undefined;
  do {
    const url = new URL(
      `https://api.notion.com/v1/blocks/${parentId}/children`,
    );
    url.searchParams.set("page_size", "100");
    if (cursor) url.searchParams.set("start_cursor", cursor);
    const res = await fetch(url.toString(), { headers });
    if (!res.ok) {
      throw new Error(`GET blocks ${parentId} failed: ${res.status}`);
    }
    const data = (await res.json()) as {
      results: Block[];
      next_cursor: string | null;
      has_more: boolean;
    };
    all.push(...data.results);
    cursor = data.has_more ? data.next_cursor ?? undefined : undefined;
  } while (cursor);
  return all;
}

async function updateNumberedListItem(
  blockId: string,
  text: string,
): Promise<void> {
  const url = `https://api.notion.com/v1/blocks/${blockId}`;
  const body = {
    numbered_list_item: {
      rich_text: [{ type: "text", text: { content: text } }],
    },
  };
  const res = await fetch(url, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(
      `PATCH block ${blockId} failed: ${res.status} ${txt.slice(0, 300)}`,
    );
  }
}

async function main() {
  console.log("Fetching page blocks…");
  const rootBlocks = await fetchAllBlocks(NOTION_PAGE_ID);

  // Numbered items can be at the root or nested inside other blocks.
  // Traverse one level deep to be safe.
  const numberedItems: Block[] = [];
  for (const b of rootBlocks) {
    if (b.type === "numbered_list_item") {
      numberedItems.push(b);
    } else if (b.has_children) {
      const kids = await fetchAllBlocks(b.id);
      for (const k of kids) {
        if (k.type === "numbered_list_item") numberedItems.push(k);
      }
    }
  }

  console.log(`Found ${numberedItems.length} numbered_list_item blocks.`);
  if (numberedItems.length < 24) {
    console.error("Too few numbered items. Aborting.");
    process.exit(1);
  }

  // Questions come first in the page, then unrelated numbered lists (field
  // names under "Champs supplémentaires"). Only touch the first 24.
  const toUpdate = numberedItems.slice(0, 24);
  console.log(
    `Updating the first 24. Leaving ${numberedItems.length - 24} later items untouched.\n`,
  );

  for (let i = 0; i < 24; i++) {
    const q = QUESTIONS[i];
    const block = toUpdate[i];
    console.log(`Q${q.id} [${q.need}/${q.kind}]: ${q.text.slice(0, 60)}…`);
    await updateNumberedListItem(block.id, q.text);
  }

  console.log("\n✅ All 24 questions synced.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
