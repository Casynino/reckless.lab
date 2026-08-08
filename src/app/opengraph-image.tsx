import { ImageResponse } from "next/og";
import { LOGO_MARK_DATA_URL } from "@/lib/brand/logo-data";

// Social share card (WhatsApp, iMessage, X, etc.). WhatsApp needs a real raster
// og:image — this 1200×630 card features the official Reckless R-serpent mark on
// a paper tile over the dark editorial ink.
export const alt = "Reckless Laboratory — It’s not for you.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0b",
          color: "#ece8e1",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Brand-red glows */}
        <div style={{ position: "absolute", top: -180, left: -160, width: 720, height: 720, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(224,52,42,0.30), rgba(224,52,42,0))" }} />
        <div style={{ position: "absolute", bottom: -220, right: -160, width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(224,52,42,0.18), rgba(224,52,42,0))" }} />

        {/* Official logo on a paper tile */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 300,
            height: 300,
            borderRadius: 44,
            background: "#f6f4ef",
            boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_MARK_DATA_URL} height={210} alt="Reckless" />
        </div>

        <div style={{ marginTop: 44, fontSize: 46, fontWeight: 700, letterSpacing: 16, textTransform: "uppercase" }}>
          Reckless Laboratory
        </div>
        <div style={{ marginTop: 16, fontSize: 25, letterSpacing: 8, textTransform: "uppercase", color: "#8a857c" }}>
          It’s not for you
        </div>
      </div>
    ),
    { ...size },
  );
}
