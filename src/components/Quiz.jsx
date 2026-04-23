import { useEffect, useState } from "react";
import { COLORS, FONT, styles, fadeStyle } from "./SharedStyles";
import { T } from "../data/translations";
import { QUESTIONS, ANSWER_LABELS } from "../data/questions";

const ANSWERS = ["yes", "partly", "no"];

const ANSWER_COLORS = {
  yes: COLORS.green,
  partly: COLORS.orange,
  no: COLORS.textTertiary,
};

export default function Quiz({ lang, savedAnswers, onComplete, onBack }) {
  const t = T[lang];
  const labels = ANSWER_LABELS[lang];

  const [answers, setAnswers] = useState(savedAnswers || {});
  const [idx, setIdx] = useState(() => {
    const a = savedAnswers || {};
    const firstUnanswered = QUESTIONS.findIndex((q) => !a[q.id]);
    return firstUnanswered === -1 ? 0 : firstUnanswered;
  });
  const [vis, setVis] = useState(false);

  useEffect(() => {
    setVis(false);
    const id = setTimeout(() => setVis(true), 30);
    return () => clearTimeout(id);
  }, [idx]);

  const q = QUESTIONS[idx];
  const total = QUESTIONS.length;
  const current = answers[q.id];

  const select = (val) => {
    const next = { ...answers, [q.id]: val };
    setAnswers(next);
    setTimeout(() => {
      if (idx < total - 1) {
        setIdx(idx + 1);
      } else {
        onComplete(next);
      }
      window.scrollTo(0, 0);
    }, 180);
  };

  const goPrev = () => {
    if (idx > 0) {
      setIdx(idx - 1);
      window.scrollTo(0, 0);
    } else if (onBack) {
      onBack();
    }
  };

  const progressPct = (idx / total) * 100;

  return (
    <div style={{ ...styles.page, ...fadeStyle(vis) }}>
      {/* Progress label */}
      <div
        style={{
          position: "fixed",
          top: 14,
          right: 100,
          fontSize: "13px",
          color: COLORS.textMuted,
          zIndex: 100,
        }}
      >
        {idx + 1}/{total}
      </div>

      {/* Quiz progress bar (under app topbar) */}
      <div
        style={{
          position: "fixed",
          top: 3,
          left: 0,
          right: 0,
          zIndex: 149,
          height: "2px",
          background: "transparent",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progressPct}%`,
            background: COLORS.coralGradient,
            transition: "width 0.3s ease",
          }}
        />
      </div>

      <div style={{ maxWidth: 560, width: "100%" }}>
        {/* Small label */}
        <div style={{ ...styles.surtitre, textAlign: "center", marginBottom: "16px" }}>
          {t.quiz_prompt}
        </div>

        {/* Statement */}
        <div
          style={{
            ...styles.card,
            marginBottom: "28px",
            padding: "32px 24px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "clamp(20px,4.5vw,26px)",
              fontWeight: 700,
              color: COLORS.textPrimary,
              lineHeight: 1.4,
              margin: 0,
              fontFamily: FONT,
            }}
          >
            « {q[lang]} »
          </p>
        </div>

        {/* Answer buttons — side by side */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "10px",
            marginBottom: "24px",
          }}
        >
          {ANSWERS.map((val) => {
            const on = current === val;
            const c = ANSWER_COLORS[val];
            return (
              <button
                key={val}
                onClick={() => select(val)}
                style={{
                  background: on ? c : `${c}18`,
                  color: on ? "#fff" : c,
                  border: `1px solid ${on ? c : `${c}40`}`,
                  borderRadius: "16px",
                  padding: "18px 8px",
                  fontSize: "15px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: FONT,
                  transition: "all 0.15s",
                  textAlign: "center",
                  minWidth: 0,
                }}
              >
                {labels[val]}
              </button>
            );
          })}
        </div>

        {/* Hint */}
        <p
          style={{
            fontSize: "12px",
            color: COLORS.textMuted,
            textAlign: "center",
            margin: "0 0 20px",
            fontStyle: "italic",
          }}
        >
          {t.quiz_hint}
        </p>

        {/* Back */}
        <div style={{ textAlign: "center" }}>
          <button style={styles.btnGhost} onClick={goPrev}>
            {idx === 0 ? t.disc_back : t.quiz_prev}
          </button>
        </div>
      </div>
    </div>
  );
}
