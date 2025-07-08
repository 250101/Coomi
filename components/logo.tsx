interface LogoProps {
  className?: string
  size?: "small" | "medium" | "large"
}

export default function Logo({ className = "", size = "medium" }: LogoProps) {
  // Define font sizes based on the size prop
  const fontSizes = {
    small: "text-2xl",
    medium: "text-3xl",
    large: "text-6xl",
  }

  return (
    <div className={`inline-block ${className}`}>
      <div className="relative inline-block">
        <h2 className={`font-oswald tracking-wider ${fontSizes[size]}`}>
          CO<span className="text-primary">O</span>MI
        </h2>
        <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary"></div>
      </div>
    </div>
  )
}

