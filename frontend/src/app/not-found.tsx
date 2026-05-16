"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AnimatedCat404 } from "./animated-icons";

export default function NotFound() {
  const router = useRouter();

  return (
    <div style={styles.page as React.CSSProperties}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@300;400;600&family=Syne+Mono&display=swap');
        @keyframes float-404 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      {/* Dot grid overlay */}
      <div style={styles.dotGrid} aria-hidden="true" />

      {/* Ambient glow */}
      <div style={styles.glow} aria-hidden="true" />

      {/* Ghost "404" text */}
      <span style={styles.ghostText as React.CSSProperties} aria-hidden="true">404</span>

      {/* Animation wrapper */}
      <div style={styles.animationWrap as React.CSSProperties}>
        <AnimatedCat404 className="w-[360px] h-[360px] max-w-[85vw] max-h-[85vw]" />
      </div>

      {/* Content */}
      <div style={styles.content as React.CSSProperties}>
        <span style={styles.tag}>Error 404</span>
        <h1 style={styles.heading as React.CSSProperties}>Page not found</h1>
        <p style={styles.body}>
          Looks like the cat knocked this page right off the internet. It's gone.
        </p>
        <div style={styles.actions}>
          <button 
            style={{ ...styles.btn, ...styles.btnPrimary } as React.CSSProperties} 
            onClick={() => router.push("/")}
            onMouseOver={(e) => (e.currentTarget.style.background = "#e65a45")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#FF6B52")}
          >
            ← Go home
          </button>
          <button 
            style={{ ...styles.btn, ...styles.btnGhost } as React.CSSProperties} 
            onClick={() => router.back()}
            onMouseOver={(e) => {
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = "#7A7E94";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
            }}
          >
            Go back
          </button>
        </div>
      </div>

      <div style={styles.footerCode as React.CSSProperties}>HTTP 404 · PAGE_NOT_FOUND</div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    position: "relative",
    minHeight: "100vh",
    background: "#0C0F1A",
    color: "#E8E2D5",
    fontFamily: "'Bricolage Grotesque', 'Segoe UI', sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "2rem",
    overflow: "hidden",
  },
  dotGrid: {
    position: "absolute",
    inset: 0,
    backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.045) 1px, transparent 1px)",
    backgroundSize: "32px 32px",
    pointerEvents: "none",
  },
  glow: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    height: 500,
    background: "radial-gradient(circle, rgba(255,107,82,0.10) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  ghostText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -52%)",
    fontFamily: "'Syne Mono', monospace",
    fontSize: "clamp(120px, 22vw, 280px)",
    fontWeight: 400,
    letterSpacing: "-0.04em",
    color: "transparent",
    WebkitTextStroke: "1px rgba(255,255,255,0.05)",
    userSelect: "none",
    pointerEvents: "none",
    whiteSpace: "nowrap",
    zIndex: 0,
  },
  animationWrap: {
    position: "relative",
    zIndex: 2,
    animation: "float-404 4s ease-in-out infinite",
  },
  content: {
    position: "relative",
    zIndex: 2,
    marginTop: "-1.5rem",
  },
  tag: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(255,107,82,0.18)",
    border: "1px solid rgba(255,107,82,0.30)",
    borderRadius: 999,
    padding: "4px 14px",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#FF6B52",
    marginBottom: "1rem",
  },
  heading: {
    fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
    fontWeight: 600,
    lineHeight: 1.2,
    marginBottom: "0.75rem",
    letterSpacing: "-0.02em",
  },
  body: {
    fontSize: "1rem",
    color: "#7A7E94",
    maxWidth: 340,
    margin: "0 auto 2rem",
    lineHeight: 1.7,
  },
  actions: {
    display: "flex",
    gap: 12,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  btn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "11px 24px",
    borderRadius: 10,
    fontFamily: "inherit",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
    border: "none",
    transition: "all 0.18s ease",
  },
  btnPrimary: {
    background: "#FF6B52",
    color: "#fff",
  },
  btnGhost: {
    background: "transparent",
    color: "#7A7E94",
    border: "1px solid rgba(255,255,255,0.07)",
  },
  footerCode: {
    position: "absolute",
    bottom: "1.5rem",
    left: "50%",
    transform: "translateX(-50%)",
    fontFamily: "monospace",
    fontSize: 11,
    color: "rgba(255,255,255,0.14)",
    letterSpacing: "0.12em",
    zIndex: 2,
    whiteSpace: "nowrap",
  },
};
