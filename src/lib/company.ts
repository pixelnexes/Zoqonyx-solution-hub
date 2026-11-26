/** Facts about the company behind Zoqonyx, used in structured data and llms.txt. */
export const PARENT = {
  name: "Newix Tech Solutions",
  url: "https://newixtechsolutions.com/",
  portfolio: "https://newixtechsolutions.com/portfolio/",
  linkedin: "https://linkedin.com/company/newixtech",
};

export const AREAS_SERVED = ["United States", "United Kingdom", "Germany", "Europe", "Gulf region", "Asia"];

export const PARENT_LD = {
  "@type": "Organization",
  name: PARENT.name,
  url: PARENT.url,
  foundingDate: "2020",
  address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" },
  sameAs: [PARENT.linkedin, "https://twitter.com/newixtech"],
};
