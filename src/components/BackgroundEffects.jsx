import { useLocation } from "react-router-dom"

export default function BackgroundEffects() {
  const location = useLocation()
  const isHome = location.pathname === "/"

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div
        className="absolute"
        style={{
          top: isHome ? "15%" : "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(80vw, 600px)",
          height: "min(80vw, 600px)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div
        className="absolute opacity-[0.02] pointer-events-none select-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(60vw, 400px)",
          height: "min(60vw, 400px)",
          borderRadius: "50%",
          overflow: "hidden",
        }}
      >
        <img
          src="/logo.jpg"
          alt=""
          className="w-full h-full object-contain"
          style={{ filter: "blur(2px)" }}
        />
      </div>

      {isHome && (
        <div
          className="absolute"
          style={{
            bottom: "10%",
            right: "-10%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      )}
    </div>
  )
}
