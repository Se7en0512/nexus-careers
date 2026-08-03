export default function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <circle cx="16" cy="6" r="2.6" fill="#D9A94E" />
      <circle cx="6" cy="22" r="2.6" fill="#D9A94E" />
      <circle cx="26" cy="22" r="2.6" fill="#D9A94E" />
      <circle cx="16" cy="16" r="3.4" fill="#EFCB80" />
      <line x1="16" y1="8.4" x2="16" y2="12.8" stroke="#D9A94E" strokeWidth="1.2" />
      <line x1="13.2" y1="18" x2="8" y2="21" stroke="#D9A94E" strokeWidth="1.2" />
      <line x1="18.8" y1="18" x2="24" y2="21" stroke="#D9A94E" strokeWidth="1.2" />
    </svg>
  );
}
