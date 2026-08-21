import { ImageResponse } from "next/og";

export const alt = "OnPoint Clothing — Multiple Award-Winning Fashion House";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0a",
          padding: "80px 96px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 8,
            color: "rgba(242,240,238,0.7)",
          }}
        >
          ONPOINT CLOTHING
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              width: 120,
              height: 3,
              backgroundColor: "#6d0f1f",
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 64,
              lineHeight: 1.2,
              color: "#f2f0ee",
            }}
          >
            Multiple Award-Winning.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 4,
            color: "rgba(242,240,238,0.5)",
          }}
        >
          <div style={{ display: "flex" }}>© 2026 ONPOINT CLOTHING</div>
          <div style={{ display: "flex" }}>SHOP THE COLLECTION</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
