import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Talent Test · monExpansion",
  description:
    "4 quick tests. 1 minute each. No email. See where you stand. (Tests run in French for now.)",
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
