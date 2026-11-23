import { TECH_ICONS } from "@/lib/tech-icons";

const id = (name: string) => "tl-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

/** Draws every technology icon once per page; TechLogo then references it with <use>, which keeps the HTML small. */
export function TechSprite() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <defs>
        {Object.entries(TECH_ICONS).map(([name, icon]) => (
          <symbol key={name} id={id(name)} viewBox="0 0 24 24">
            <path d={icon.path} fillRule="evenodd" clipRule="evenodd" />
          </symbol>
        ))}
      </defs>
    </svg>
  );
}

export function TechLogo({ name, mono = false }: { name: string; mono?: boolean }) {
  const icon = TECH_ICONS[name];
  if (!icon) return <span>{name}</span>;
  const dark = parseInt(icon.hex, 16) < 0x202020;
  return (
    <>
      <svg width="22" height="22" aria-hidden="true" fill={mono ? "#fff" : dark ? "#15171C" : `#${icon.hex}`}>
        <use href={`#${id(name)}`} />
      </svg>
      <span>{name}</span>
    </>
  );
}
