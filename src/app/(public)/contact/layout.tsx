import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us – Feedback & Support",
  description:
    "Get in touch with the Zoqonyx Solution Hub team. Submit tool suggestions, report bugs, or partner with us.",
  alternates: {
    canonical: "https://zoqonyx.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
