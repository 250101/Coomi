export default function Loading() {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        {/* Logo skeleton */}
        <div className="flex flex-col items-start gap-1 animate-pulse">
          <div className="h-12 w-48 bg-muted rounded" />
          <div className="h-0.5 w-full bg-border rounded" />
          <div className="h-8 w-48 bg-muted/40 rounded" />
        </div>

        {/* Barra de carga */}
        <div className="w-48 h-px bg-border overflow-hidden rounded">
          <div
            className="h-full bg-primary rounded"
            style={{ animation: "loading-bar 1.4s ease-in-out infinite" }}
          />
        </div>
      </div>

      <style>{`
        @keyframes loading-bar {
          0%   { width: 0%;  margin-left: 0%; }
          50%  { width: 60%; margin-left: 20%; }
          100% { width: 0%;  margin-left: 100%; }
        }
      `}</style>
    </div>
  )
}
