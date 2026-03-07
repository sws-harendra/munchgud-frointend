export default function Loader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex space-x-2">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="w-2.5 h-12 bg-gradient-to-t from-green-700  to-green-600 rounded-full animate-[pulseScale_1s_ease-in-out_infinite]"
            style={{

              animationDelay: `${i * 0.15}s`,
              transformOrigin: "center bottom",
            }}
          />
        ))}
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes pulseScale {
          0%, 100% { transform: scaleY(0.4); opacity: 0.6; }
          50% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
