// Vercel Serverless Function — Brevo contact creation
// Protects the API key server-side

const BREVO_KEY = process.env.BREVO_API_KEY;

// Brevo list IDs — route by language
const LIST_IDS = {
  fr: [11],  // Etest_FR — Kit français
  en: [12],  // Etest_EN — Kit anglais
};

// Simple in-memory rate limiting (per instance)
const rateMap = new Map();
const RATE_WINDOW = 60_000; // 1 minute

function isRateLimited(email) {
  const now = Date.now();
  const last = rateMap.get(email);
  if (last && now - last < RATE_WINDOW) return true;
  rateMap.set(email, now);
  // Cleanup old entries
  if (rateMap.size > 1000) {
    for (const [k, v] of rateMap) {
      if (now - v > RATE_WINDOW * 5) rateMap.delete(k);
    }
  }
  return false;
}

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const data = req.body;

    // Honeypot check
    if (data.website) return res.status(200).json({ ok: true }); // silent fail

    // Validation
    if (!data.email || !data.email.includes("@") || !data.email.includes(".")) {
      return res.status(400).json({ error: "Invalid email" });
    }

    // Rate limit
    if (isRateLimited(data.email)) {
      return res.status(429).json({ error: "Too many requests" });
    }

    // Build Brevo attributes — Auto-Coach Kit schema (top 3 essential needs).
    const attributes = {
      PRENOM: data.firstName || "",
      LANG: data.lang || "fr",
      KIT_SOURCE: data.source || "auto-coach-kit",
      KIT_COMPLETE: true,
    };

    // Flatten top 3 needs (name + score) into separate attributes for easy segmentation.
    const top = Array.isArray(data.topNeeds) ? data.topNeeds.slice(0, 3) : [];
    if (top[0]) {
      attributes.NEED_1 = top[0].name || "";
      attributes.NEED_1_SCORE = top[0].score ?? 0;
    }
    if (top[1]) {
      attributes.NEED_2 = top[1].name || "";
      attributes.NEED_2_SCORE = top[1].score ?? 0;
    }
    if (top[2]) {
      attributes.NEED_3 = top[2].name || "";
      attributes.NEED_3_SCORE = top[2].score ?? 0;
    }

    // Create/update contact in Brevo
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": BREVO_KEY,
      },
      body: JSON.stringify({
        email: data.email,
        listIds: LIST_IDS[data.lang] || LIST_IDS.fr,
        attributes,
        updateEnabled: true,
      }),
    });

    const result = await response.json();

    // If contact exists, update attributes via PUT
    if (response.status === 400 && result.message?.includes("already exist")) {
      await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(data.email)}`, {
        method: "PUT",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "api-key": BREVO_KEY,
        },
        body: JSON.stringify({
          attributes,
          listIds: LIST_IDS[data.lang] || LIST_IDS.fr,
        }),
      });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("Subscribe error:", e);
    return res.status(500).json({ error: "Internal error" });
  }
}
