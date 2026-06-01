export default function SectionTitle({ 
  subtitle, 
  title, 
  description, 
  light = false,
  align = "center" 
}) {
  const alignClass = align === "left" ? "text-left" : "text-center"

  return (
    <div className={`max-w-3xl mx-auto mb-16 ${alignClass}`}>
      {subtitle && (
        <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-neon-500 bg-neon-500/10 border border-neon-500/20 rounded-full mb-4">
          {subtitle}
        </span>
      )}
      <h2 className={`text-3xl md:text-5xl font-bold tracking-tight ${light ? "text-white" : "text-white"}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base md:text-lg ${light ? "text-dark-200" : "text-dark-200"} leading-relaxed`}>
          {description}
        </p>
      )}
    </div>
  )
}
