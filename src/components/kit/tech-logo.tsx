import * as si from "simple-icons";

// Maps the technology names shown on the site to their simple-icons export.
const KEY: Record<string, string> = {
  React: "siReact",
  "Next.js": "siNextdotjs",
  TypeScript: "siTypescript",
  "Tailwind CSS": "siTailwindcss",
  Kotlin: "siKotlin",
  Swift: "siSwift",
  Flutter: "siFlutter",
  "React Native": "siReact",
  "Node.js": "siNodedotjs",
  Laravel: "siLaravel",
  Python: "siPython",
  PostgreSQL: "siPostgresql",
  MySQL: "siMysql",
  Unity: "siUnity",
  "Unreal Engine": "siUnrealengine",
  Godot: "siGodotengine",
  Solidity: "siSolidity",
  Docker: "siDocker",
  Cloudflare: "siCloudflare",
  "Google Cloud": "siGooglecloud",
  AWS: "siAmazonwebservices",
  "CI/CD": "siGithubactions",
  spaCy: "siSpacy",
};

type Icon = { path: string; hex: string; title: string };

export function TechLogo({ name }: { name: string }) {
  const icon = (si as unknown as Record<string, Icon | undefined>)[KEY[name] ?? ""];
  if (!icon) return <span>{name}</span>;
  const dark = parseInt(icon.hex, 16) < 0x202020;
  return (
    <>
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill={dark ? "#0B1F3A" : `#${icon.hex}`}>
        <path d={icon.path} />
      </svg>
      <span>{name}</span>
    </>
  );
}
