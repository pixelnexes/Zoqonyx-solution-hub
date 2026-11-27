// Very small in-memory limiter, per server process.
const hits = new Map<string, number[]>();

export function tooMany(req: Request, bucket: string, max = 5, windowMs = 10 * 60 * 1000): boolean {
  const ip = (req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > max;
}
