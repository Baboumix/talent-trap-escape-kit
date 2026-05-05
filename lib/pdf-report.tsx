/* eslint-disable react/no-unescaped-entities */
import * as React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import {
  ANSWER_OPTIONS,
  MODIFIERS,
  NEED_LABELS,
  NEED_ORDER,
  NEED_QUESTIONS,
  QUESTIONS,
  STATUS_LABELS,
  VERDICTS,
} from "./content";
import type {
  AnswerValue,
  DiagnosticInput,
  DiagnosticResult,
  Need,
} from "./types";

// ---------------------------------------------------------------------------
// Brand palette (cohérent avec le site / l'OG image)
// ---------------------------------------------------------------------------
const BRAND = {
  coral: "#FE6C63",
  coralLight: "#FF8A54",
  ink: "#1A1A1A",
  textPrimary: "#1A1A1A",
  textSecondary: "#525252",
  textMuted: "#737373",
  bgPage: "#FAF7F3",
  bgCard: "#FFFFFF",
  bgSoft: "#FFF5F3",
  bgDominant: "#FFE9E5",
  border: "#E5E5E5",
  borderAccent: "#FFD3CE",
  emerald: "#047857",
  emeraldBg: "#ECFDF5",
  amber: "#B45309",
  amberBg: "#FFFBEB",
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: BRAND.bgPage,
    padding: 48,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: BRAND.textPrimary,
    lineHeight: 1.5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: BRAND.border,
    borderBottomStyle: "solid",
  },
  brandWord: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: BRAND.coral,
  },
  headerMeta: {
    fontSize: 9,
    color: BRAND.textMuted,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  // Cover hero
  coverHero: {
    marginTop: 24,
    marginBottom: 28,
  },
  coverEyebrow: {
    fontSize: 9,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: BRAND.coral,
    marginBottom: 14,
    fontFamily: "Helvetica-Bold",
  },
  coverTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 34,
    lineHeight: 1.15,
    color: BRAND.ink,
    marginBottom: 6,
  },
  coverSubtitle: {
    fontSize: 13,
    color: BRAND.textSecondary,
  },

  // Score block
  scoreBlock: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: BRAND.bgSoft,
    borderColor: BRAND.borderAccent,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 12,
    padding: 24,
    marginBottom: 28,
  },
  scoreNumber: {
    fontFamily: "Helvetica-Bold",
    fontSize: 72,
    color: BRAND.coral,
    lineHeight: 1,
  },
  scoreSlash: {
    fontSize: 22,
    color: BRAND.textMuted,
    marginLeft: 4,
    marginBottom: 8,
  },
  scoreMeta: {
    flex: 1,
    paddingLeft: 24,
  },
  scoreLabel: {
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: BRAND.textMuted,
    marginBottom: 6,
  },
  scoreVerdict: {
    fontFamily: "Helvetica-Bold",
    fontSize: 18,
    color: BRAND.ink,
    marginBottom: 6,
  },
  scorePunch: {
    fontSize: 11,
    color: BRAND.textSecondary,
    fontStyle: "italic",
  },

  // Sections
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 16,
    color: BRAND.ink,
    marginBottom: 4,
  },
  sectionEyebrow: {
    fontSize: 9,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: BRAND.coral,
    marginBottom: 6,
    fontFamily: "Helvetica-Bold",
  },
  sectionIntro: {
    fontSize: 11,
    color: BRAND.textSecondary,
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 11,
    color: BRAND.textPrimary,
    marginBottom: 8,
    lineHeight: 1.55,
  },

  // Need cards
  needsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  needCard: {
    width: "48.5%",
    borderColor: BRAND.border,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: BRAND.bgCard,
    padding: 12,
    marginBottom: 8,
  },
  needCardDominant: {
    borderColor: BRAND.coral,
    backgroundColor: BRAND.bgDominant,
    borderWidth: 1.5,
  },
  needCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  needName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    color: BRAND.ink,
  },
  dominantBadge: {
    fontSize: 7,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: BRAND.coral,
    fontFamily: "Helvetica-Bold",
    backgroundColor: "#FFFFFF",
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 8,
  },
  needScores: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 4,
  },
  needScorePart: {
    fontSize: 9,
    color: BRAND.textMuted,
  },
  needScoreNum: {
    fontFamily: "Helvetica-Bold",
    color: BRAND.ink,
  },
  needStatusBadge: {
    fontSize: 8,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 6,
    paddingRight: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
  },

  // Modifier (angle mort) blocks
  modifierBlock: {
    borderColor: BRAND.borderAccent,
    backgroundColor: BRAND.bgSoft,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  modifierTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    color: BRAND.ink,
    marginBottom: 6,
  },

  // Action blocks
  actionBlock: {
    borderColor: BRAND.border,
    backgroundColor: BRAND.bgCard,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  actionEyebrow: {
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: BRAND.coral,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
  },

  // Annex (Q&A)
  qaRow: {
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: BRAND.border,
    borderBottomStyle: "solid",
  },
  qaQuestion: {
    fontSize: 10,
    color: BRAND.textPrimary,
    marginBottom: 3,
  },
  qaAnswer: {
    fontSize: 10,
    color: BRAND.coral,
    fontFamily: "Helvetica-Bold",
  },

  // Closing CTA
  closingBlock: {
    backgroundColor: BRAND.bgSoft,
    borderColor: BRAND.borderAccent,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 12,
    padding: 18,
    marginTop: 14,
  },
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatDate(d: Date, lang: "fr" | "en"): string {
  if (lang === "en") {
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return d.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function statusStyle(status: string): { bg: string; color: string } {
  if (status === "satisfait") {
    return { bg: BRAND.emeraldBg, color: BRAND.emerald };
  }
  if (status === "verrouille") {
    return { bg: BRAND.bgDominant, color: BRAND.coral };
  }
  return { bg: BRAND.amberBg, color: BRAND.amber };
}

const inlineStyles = StyleSheet.create({
  bodyBase: { color: BRAND.textPrimary },
  bodyItalic: { color: BRAND.textPrimary, fontStyle: "italic" },
});

function renderTextWithItalics(text: string): React.ReactNode {
  // Split by *italic* markers (markdown-style emphasis used elsewhere)
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <Text key={i} style={inlineStyles.bodyItalic}>
          {part.slice(1, -1)}
        </Text>
      );
    }
    return (
      <Text key={i} style={inlineStyles.bodyBase}>
        {part}
      </Text>
    );
  });
}

// ---------------------------------------------------------------------------
// Document
// ---------------------------------------------------------------------------
function ReportDocument({
  input,
  result,
}: {
  input: DiagnosticInput;
  result: DiagnosticResult;
}) {
  const verdict = VERDICTS[result.verdict];
  const dominantSet = new Set<Need>(result.dominantNeeds);
  const date = formatDate(new Date(), input.lang);
  const isEn = input.lang === "en";

  const t = isEn
    ? {
        eyebrow: "Talent diagnostic",
        coverTitle: `Hi ${input.prenom}, here's your full diagnostic.`,
        coverSubtitle: `Based on your 24 answers · ${input.metier}`,
        scoreLabel: "Talent activated",
        verdictLabel: "Your verdict",
        needsEyebrow: "Section 1",
        needsTitle: "Your 6 essential needs",
        needsIntro:
          "Each need shows two scores: how strong you feel it (Importance), and how much it's currently met in your work (Met).",
        importanceLabel: "Importance",
        metLabel: "Met",
        dominantBadge: "Dominant",
        modifiersEyebrow: "Section 2",
        modifiersTitle: "Your blind spots",
        modifiersIntro:
          "These are the patterns your answers revealed. Read them slowly: a blind spot is something your usual lens hides from you.",
        noModifiers:
          "No major blind spot detected from your answers. That's rare. Keep going.",
        actionsEyebrow: "Section 3",
        actionsTitle: "Your 3 concrete actions",
        actionsIntro:
          "Three concrete moves to make. The horizon is split by intent: take this week, this month, this quarter.",
        actionWeek: "This week",
        actionMonth: "This month",
        actionQuarter: "This quarter",
        annexEyebrow: "Annex",
        annexTitle: "Your 24 answers",
        annexIntro:
          "For your records. The exact wording of every question and the answer you gave.",
        closingTitle: "What now?",
        closingBody:
          "If something here resonates, the next step is a 30-minute discovery call. No pitch, just an honest read.",
        closingLink: "monexpansion.com",
      }
    : {
        eyebrow: "Diagnostic du talent",
        coverTitle: `Salut ${input.prenom}, voici ton diagnostic complet.`,
        coverSubtitle: `À partir de tes 24 réponses · ${input.metier}`,
        scoreLabel: "Talent activé",
        verdictLabel: "Ton verdict",
        needsEyebrow: "Section 1",
        needsTitle: "Tes 6 besoins essentiels",
        needsIntro:
          "Chaque besoin a deux scores : à quel point tu le ressens fort (Importance), et à quel point il est comblé dans ton travail aujourd'hui (Comblé).",
        importanceLabel: "Importance",
        metLabel: "Comblé",
        dominantBadge: "Ton besoin",
        modifiersEyebrow: "Section 2",
        modifiersTitle: "Tes angles morts",
        modifiersIntro:
          "Ce sont les patterns que tes réponses ont révélés. Lis-les doucement : un angle mort, par définition, c'est ce que ta lentille habituelle te cache.",
        noModifiers:
          "Aucun angle mort majeur détecté à partir de tes réponses. C'est rare. Continue comme ça.",
        actionsEyebrow: "Section 3",
        actionsTitle: "Tes 3 actions concrètes",
        actionsIntro:
          "Trois mouvements à poser. L'horizon est découpé par intention : à faire cette semaine, ce mois, ce trimestre.",
        actionWeek: "Cette semaine",
        actionMonth: "Ce mois",
        actionQuarter: "Ce trimestre",
        annexEyebrow: "Annexe",
        annexTitle: "Tes 24 réponses",
        annexIntro:
          "Pour mémoire. Le libellé exact de chaque question et la réponse que tu as donnée.",
        closingTitle: "Et maintenant ?",
        closingBody:
          "Si quelque chose ici résonne, l'étape suivante est un appel découverte de 30 minutes. Sans pitch, juste une lecture honnête.",
        closingLink: "monexpansion.com",
      };

  // Pad actions30Days to exactly 3 entries
  const actions = [
    verdict.actions30Days[0] ?? "",
    verdict.actions30Days[1] ?? "",
    verdict.actions30Days[2] ?? "",
  ];

  return (
    <Document
      title={isEn ? "Talent diagnostic" : "Diagnostic du talent"}
      author="monExpansion"
      subject={verdict.notionName}
    >
      {/* PAGE 1 — COVER & VERDICT */}
      <Page size="A4" style={styles.page}>
        <Header eyebrow={t.eyebrow} date={date} />

        <View style={styles.coverHero}>
          <Text style={styles.coverEyebrow}>{t.eyebrow}</Text>
          <Text style={styles.coverTitle}>{t.coverTitle}</Text>
          <Text style={styles.coverSubtitle}>{t.coverSubtitle}</Text>
        </View>

        <View style={styles.scoreBlock}>
          <Text style={styles.scoreNumber}>{result.talentScore}</Text>
          <Text style={styles.scoreSlash}>/10</Text>
          <View style={styles.scoreMeta}>
            <Text style={styles.scoreLabel}>{t.scoreLabel}</Text>
            <Text style={styles.scoreVerdict}>{verdict.notionName}</Text>
            <Text style={styles.scorePunch}>{verdict.phrasePunch}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t.verdictLabel}</Text>
        <View style={{ marginTop: 6 }}>
          {verdict.descriptionLongue
            .split("\n")
            .filter((line) => line.trim().length > 0)
            .map((line, i) => (
              <Text key={i} style={styles.paragraph}>
                {renderTextWithItalics(line)}
              </Text>
            ))}
        </View>

      </Page>

      {/* PAGE 2 — 6 BESOINS */}
      <Page size="A4" style={styles.page}>
        <Header eyebrow={t.eyebrow} date={date} />

        <Text style={styles.sectionEyebrow}>{t.needsEyebrow}</Text>
        <Text style={styles.sectionTitle}>{t.needsTitle}</Text>
        <Text style={styles.sectionIntro}>{t.needsIntro}</Text>

        <View style={styles.needsGrid}>
          {NEED_ORDER.map((need) => {
            const score = result.needScores[need];
            const isDominant = dominantSet.has(need);
            const sty = statusStyle(score.status);
            return (
              <View
                key={need}
                style={[
                  styles.needCard,
                  ...(isDominant ? [styles.needCardDominant] : []),
                ]}
              >
                <View style={styles.needCardHeader}>
                  <Text style={styles.needName}>{NEED_LABELS[need]}</Text>
                  {isDominant && (
                    <Text style={styles.dominantBadge}>{t.dominantBadge}</Text>
                  )}
                </View>
                <View style={styles.needScores}>
                  <Text style={styles.needScorePart}>
                    {t.importanceLabel}{" "}
                    <Text style={styles.needScoreNum}>
                      {score.intensity}/4
                    </Text>
                  </Text>
                  <Text style={styles.needScorePart}>
                    {t.metLabel}{" "}
                    <Text style={styles.needScoreNum}>
                      {score.satisfaction}/4
                    </Text>
                  </Text>
                </View>
                <Text
                  style={[
                    styles.needStatusBadge,
                    { backgroundColor: sty.bg, color: sty.color },
                  ]}
                >
                  {STATUS_LABELS[score.status]}
                </Text>
              </View>
            );
          })}
        </View>

      </Page>

      {/* PAGE 3 — ANGLES MORTS + 3 ACTIONS */}
      <Page size="A4" style={styles.page}>
        <Header eyebrow={t.eyebrow} date={date} />

        <Text style={styles.sectionEyebrow}>{t.modifiersEyebrow}</Text>
        <Text style={styles.sectionTitle}>{t.modifiersTitle}</Text>
        <Text style={styles.sectionIntro}>{t.modifiersIntro}</Text>

        {result.modifiers.length === 0 ? (
          <Text style={styles.paragraph}>{t.noModifiers}</Text>
        ) : (
          result.modifiers.map((key) => {
            const m = MODIFIERS[key];
            if (!m) return null;
            return (
              <View key={key} style={styles.modifierBlock}>
                <Text style={styles.modifierTitle}>{m.displayName}</Text>
                <Text style={styles.paragraph}>{m.paragraph}</Text>
              </View>
            );
          })
        )}

        <View style={{ marginTop: 18 }}>
          <Text style={styles.sectionEyebrow}>{t.actionsEyebrow}</Text>
          <Text style={styles.sectionTitle}>{t.actionsTitle}</Text>
          <Text style={styles.sectionIntro}>{t.actionsIntro}</Text>

          <View style={styles.actionBlock}>
            <Text style={styles.actionEyebrow}>{t.actionWeek}</Text>
            <Text style={styles.paragraph}>{actions[0]}</Text>
          </View>
          <View style={styles.actionBlock}>
            <Text style={styles.actionEyebrow}>{t.actionMonth}</Text>
            <Text style={styles.paragraph}>{actions[1]}</Text>
          </View>
          <View style={styles.actionBlock}>
            <Text style={styles.actionEyebrow}>{t.actionQuarter}</Text>
            <Text style={styles.paragraph}>{actions[2]}</Text>
          </View>
        </View>

      </Page>

      {/* PAGE 4 — ANNEXE 24 RÉPONSES */}
      <Page size="A4" style={styles.page}>
        <Header eyebrow={t.eyebrow} date={date} />

        <Text style={styles.sectionEyebrow}>{t.annexEyebrow}</Text>
        <Text style={styles.sectionTitle}>{t.annexTitle}</Text>
        <Text style={styles.sectionIntro}>{t.annexIntro}</Text>

        {QUESTIONS.map((q) => {
          const v = (input.answers[q.id] ?? 0) as AnswerValue;
          const opt = ANSWER_OPTIONS.find((o) => o.value === v);
          return (
            <View key={q.id} style={styles.qaRow} wrap={false}>
              <Text style={styles.qaQuestion}>
                <Text style={{ color: BRAND.textMuted }}>Q{q.id} · </Text>
                <Text style={{ color: BRAND.textMuted }}>
                  {NEED_QUESTIONS[q.need]} · {NEED_LABELS[q.need]}
                </Text>
              </Text>
              <Text style={styles.qaQuestion}>{q.text}</Text>
              <Text style={styles.qaAnswer}>
                › {opt?.label ?? `${v}`}
              </Text>
            </View>
          );
        })}

        <View style={styles.closingBlock} wrap={false}>
          <Text style={styles.modifierTitle}>{t.closingTitle}</Text>
          <Text style={styles.paragraph}>{t.closingBody}</Text>
          <Text
            style={{
              color: BRAND.coral,
              fontFamily: "Helvetica-Bold",
              fontSize: 10,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            {t.closingLink}
          </Text>
        </View>

      </Page>
    </Document>
  );
}

function Header({ eyebrow, date }: { eyebrow: string; date: string }) {
  return (
    <View style={styles.header} fixed>
      <Text style={styles.brandWord}>monExpansion</Text>
      <Text style={styles.headerMeta}>
        {eyebrow} · {date}
      </Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export async function generateReportPdfBuffer(
  input: DiagnosticInput,
  result: DiagnosticResult,
): Promise<Buffer> {
  return await renderToBuffer(<ReportDocument input={input} result={result} />);
}
