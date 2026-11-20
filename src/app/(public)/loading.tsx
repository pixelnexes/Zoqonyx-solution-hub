export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-14 w-14">
          <span className="absolute inset-0 rounded-full border-4 border-[#E7E1F6]" />
          <span className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#7C3AED]" />
          <span className="absolute inset-0 flex items-center justify-center text-lg font-extrabold text-[#4C1D95]">Z</span>
        </div>
        <span className="text-sm font-semibold text-[#5C5878]">Loading…</span>
      </div>
    </div>
  );
}
