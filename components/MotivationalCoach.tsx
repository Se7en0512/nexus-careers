export default function MotivationalCoach({ message }: { message: string }) {
  return (
    <div className="border border-navy-700 bg-navy-900 rounded-[3px] p-5">
      <div className="flex items-center gap-2.5 mb-2">
        <span className="text-[18px]">💬</span>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400">
          From Your Coach
        </span>
      </div>
      <p className="text-[15px] text-ink-50 italic leading-relaxed">
        &ldquo;{message}&rdquo;
      </p>
    </div>
  );
}
