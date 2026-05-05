import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Talent Test · monExpansion";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const robotoBold = await fetch(
    new URL("../og-fonts/Roboto-Bold.ttf", import.meta.url),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FAF7F3",
          backgroundImage:
            "radial-gradient(circle at 50% 38%, rgba(254,108,99,0.22), transparent 60%)",
          padding: "60px",
          fontFamily: "Roboto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 18px",
            fontSize: "16px",
            letterSpacing: "0.22em",
            color: "#FE6C63",
            border: "1px solid rgba(254,108,99,0.4)",
            borderRadius: "999px",
            backgroundColor: "rgba(254,108,99,0.08)",
            marginBottom: "44px",
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "999px",
              backgroundColor: "#FE6C63",
            }}
          />
          ACTIVATE YOUR EXPANSION
        </div>

        <div
          style={{
            fontSize: "180px",
            fontWeight: 700,
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span style={{ color: "#1A1A1A" }}>Your talent.</span>
          <span style={{ color: "#FE6C63" }}>Activated?</span>
        </div>

        <div
          style={{
            marginTop: "48px",
            fontSize: "26px",
            color: "#5A5A5A",
            textAlign: "center",
            maxWidth: "820px",
            fontWeight: 700,
          }}
        >
          A score out of 10. And the 6 essential needs that drive it.
        </div>

        <div
          style={{
            marginTop: "60px",
            fontSize: "14px",
            letterSpacing: "0.22em",
            color: "#9A9A9A",
            fontWeight: 700,
          }}
        >
          MONEXPANSION · KIT.MONEXPANSION.COM
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Roboto",
          data: robotoBold,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
