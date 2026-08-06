interface TestimonialCardProps {
  name: string;
  role: string;
  company?: string;
  quote: string;
  rating?: number;
  initials: string;
  delay?: string;
}

export default function TestimonialCard({
  name,
  role,
  company,
  quote,
  rating = 5,
  initials,
  delay = "",
}: TestimonialCardProps) {
  return (
    <div className={`card-shine bg-navy-900 border border-navy-700 p-7 flex flex-col hover-lift anim-fade-up ${delay}`}>
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            viewBox="0 0 24 24"
            fill={i < rating ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
            className={`w-4 h-4 ${i < rating ? "star" : "star-empty"}`}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>

      {/* Quote */}
      <blockquote className="font-serif italic text-[15px] text-ink-200 leading-relaxed flex-1 mb-6">
        &ldquo;{quote}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="border-t border-navy-700 pt-4 flex items-center gap-3">
        {/* Avatar placeholder */}
        <div className="w-10 h-10 rounded-full bg-navy-700 border border-navy-600 flex items-center justify-center font-mono text-xs text-gold-400 font-semibold flex-shrink-0">
          {initials}
        </div>
        <div>
          <p className="font-semibold text-[14px] text-ink-50">{name}</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-500">
            {role}{company ? ` · ${company}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
