import { TECH_ICONS } from "@/lib/tech-icons";

export function TechLogo({ name, mono = false }: { name: string; mono?: boolean }) {
  const icon = TECH_ICONS[name];
  if (!icon) return <span>{name}</span>;
  const dark = parseInt(icon.hex, 16) < 0x202020;
  return (
    <>
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill={mono ? "#fff" : dark ? "#1B1340" : `#${icon.hex}`}>
        <path d={icon.path} />
      </svg>
      <span>{name}</span>
    </>
  );
}
