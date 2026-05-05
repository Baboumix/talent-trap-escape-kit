import type { QuadrantZone, SourceKey } from "./types";
import type { SourceConfig } from "./sources";

/**
 * EN translations of the 4 entry points.
 * Math (computeZone, getSourceFromQuery) and SOURCE_MENU_ORDER stay in sources.ts.
 */

export const Q0C_EN = {
  text: "How much does this need to change in the next 6 months?",
  lowLabel: "Not urgent",
  highLabel: "Absolute urgency",
};

export const SOURCES_EN: Record<SourceKey, SourceConfig> = {
  talent: {
    key: "talent",
    menuName: "The Talent Test",
    menuQuestion: "Are you really using your capacities at work?",
    menuValue: "See in 1 minute if your talent flows or leaks.",
    menuTheme: {
      border: "border-coral/30 hover:border-coral/60",
      bg: "bg-coral/[0.04] hover:bg-coral/[0.08]",
      accent: "text-coral",
    },
    pillLabel: "The Talent Test",
    q0: {
      text: "How fully are you using your capacities in your job?",
      lowLabel: "Not at all",
      highLabel: "Fully",
    },
    q0b: {
      text: "If you could redesign your role tomorrow, how much would you change?",
      lowLabel: "Nothing",
      highLabel: "Everything",
    },
    insightByZone: {
      "pleine-expansion":
        "Your talent flows and the field recognizes it. Rare. Don't lose it to habit.",
      "depart-imminent":
        "Your talent shows but the field won't return it. The exit is ripe.",
      "reveil-possible":
        "The field is loyal but your talent is held back. The wake-up is within reach.",
      "urgence-absolue":
        "Talent held back AND field rigged. Double bind. The cost of waiting is very high.",
    },
  },
  keeper: {
    key: "keeper",
    menuName: "The Keeper Test",
    menuQuestion: "Would your boss fight to keep you?",
    menuValue: "Discover the real place you hold for your boss.",
    menuTheme: {
      border: "border-emerald-300 hover:border-emerald-500",
      bg: "bg-emerald-50 hover:bg-emerald-100/70",
      accent: "text-emerald-700",
    },
    pillLabel: "The Keeper Test",
    q0: {
      text: "If you quit tomorrow, how much would your boss fight to keep you?",
      lowLabel: "Not at all",
      highLabel: "Tooth and nail",
    },
    q0b: {
      text: "And you, how much would you fight to stay?",
      lowLabel: "Not at all",
      highLabel: "Tooth and nail",
    },
    insightByZone: {
      "pleine-expansion":
        "You're in the right place and recognized for the right reason. Rare. Anchor it so it lasts.",
      "depart-imminent":
        "You give more than you get back. The field is starting to lose you.",
      "reveil-possible":
        "You're loyal but your talent sleeps. A wake-up is still possible if you act.",
      "urgence-absolue":
        "Neither you nor your boss would put in the energy. Time to start over.",
    },
  },
  fraud: {
    key: "fraud",
    menuName: "The Fraud Test",
    menuQuestion: "How much do you feel like a fraud in your role?",
    menuValue: "Measure your imposter syndrome and what it hides.",
    menuTheme: {
      border: "border-violet-300 hover:border-violet-500",
      bg: "bg-violet-50 hover:bg-violet-100/70",
      accent: "text-violet-700",
    },
    pillLabel: "The Fraud Test",
    q0: {
      text: "Out of 10, how much do you feel like a fraud in your role today?",
      lowLabel: "Not at all",
      highLabel: "Every day",
    },
    q0b: {
      text: "If we filmed your last tough 1:1, how proud would you be?",
      lowLabel: "Not proud",
      highLabel: "Very proud",
    },
    insightByZone: {
      "pleine-expansion":
        "You feel like a fraud but you perform. Classic. The syndrome doesn't tell the truth.",
      "depart-imminent":
        "You're right to doubt the field, not yourself. The mismatch is external.",
      "reveil-possible":
        "The fraud feeling comes from a mental frame that no longer fits you.",
      "urgence-absolue":
        "The doubt is consistent with the situation. Not a syndrome, a signal.",
    },
  },
  ai: {
    key: "ai",
    menuName: "The Replacement Test",
    menuQuestion: "Will your job be replaced by AI within 24 months?",
    menuValue: "Estimate your AI risk against objective data.",
    menuTheme: {
      border: "border-sky-300 hover:border-sky-500",
      bg: "bg-sky-50 hover:bg-sky-100/70",
      accent: "text-sky-700",
    },
    pillLabel: "The Replacement Test",
    q0: {
      text: "Out of 10, how much will your leader job be replaced by AI in 24 months?",
      lowLabel: "No risk",
      highLabel: "Very likely",
    },
    q0b: {
      text: "If AI took 50% of your job tomorrow, how relieved would you be?",
      lowLabel: "Not at all",
      highLabel: "Very relieved",
    },
    insightByZone: {
      "pleine-expansion":
        "You sense the change coming and could be one of its architects.",
      "depart-imminent":
        "You see AI as relief. That's rarely a good sign for your current role.",
      "reveil-possible":
        "You underestimate the impact. An early wake-up beats a late one.",
      "urgence-absolue":
        "AI will accelerate a movement already underway. The window is short.",
    },
  },
};

export const ZONE_LABELS_EN: Record<QuadrantZone, string> = {
  "pleine-expansion": "Full Expansion",
  "depart-imminent": "Imminent Departure",
  "reveil-possible": "Possible Wake-up",
  "urgence-absolue": "Absolute Urgency",
};

export const ZONE_DOORS_EN: Record<QuadrantZone, string> = {
  "pleine-expansion": "Anchor",
  "depart-imminent": "Quit",
  "reveil-possible": "Deploy",
  "urgence-absolue": "Quit or Restart",
};
