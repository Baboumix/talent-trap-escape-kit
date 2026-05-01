import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Talent Test · monExpansion";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [robotoBold, robotoRegular] = await Promise.all([
    fetch(new URL("../og-fonts/Roboto-Bold.ttf", import.meta.url)).then(
      (res) => res.arrayBuffer(),
    ),
    fetch(new URL("../og-fonts/Roboto-Regular.ttf", import.meta.url)).then(
      (res) => res.arrayBuffer(),
    ),
  ]);

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
          backgroundColor: "#0A0A0A",
          backgroundImage:
            "radial-gradient(circle at 50% 38%, rgba(254,108,99,0.18), transparent 55%)",
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
            border: "1px solid rgba(254,108,99,0.35)",
            borderRadius: "999px",
            backgroundColor: "rgba(254,108,99,0.05)",
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
          <span style={{ color: "#ffffff" }}>Your talent.</span>
          <span style={{ color: "#FE6C63" }}>Activated?</span>
        </div>

        <div
          style={{
            marginTop: "48px",
            fontSize: "26px",
            color: "#cfcfcf",
            textAlign: "center",
            maxWidth: "820px",
            fontWeight: 400,
          }}
        >
          A score out of 10. And the 6 essential needs that drive it.
        </div>

        <div
          style={{
            marginTop: "60px",
            fontSize: "14px",
            letterSpacing: "0.22em",
            color: "#6b6b6b",
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
        {
          name: "Roboto",
          data: robotoRegular,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
