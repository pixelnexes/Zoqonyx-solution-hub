import type { Metadata } from "next";
import { TestimonialsSection } from "@/components/site/reviews-section";
import type { TestimonialItem } from "@/lib/content";

// Design preview for partners. Not linked, not in the sitemap, and hidden from search engines.
export const metadata: Metadata = {
  title: { absolute: "Review section preview | Zoqonyx" },
  robots: { index: false, follow: false },
};

const SAMPLES: TestimonialItem[] = [
  { id: "sample-0", name: "Michael Turner", role: "", company: "NorthPeak Digital Solutions, Austin, Texas", quote: "Zoqonyx did an excellent job developing our business website. The team understood our requirements, communicated clearly, and delivered a professional result. The entire process was smooth from start to finish.", rating: 5, serviceSlug: "" },
  { id: "sample-1", name: "Sarah Mitchell", role: "", company: "BrightPath Consulting Group, Denver, Colorado", quote: "We needed a custom platform for managing our daily operations, and Zoqonyx helped turn our idea into a working solution. Their team was responsive, professional, and easy to work with.", rating: 5, serviceSlug: "" },
  { id: "sample-2", name: "Daniel Brooks", role: "", company: "Oakline Business Services, Charlotte, North Carolina", quote: "Great experience working with Zoqonyx. They developed a mobile application that fits our business needs perfectly. I appreciated their attention to detail and consistent project updates.", rating: 5, serviceSlug: "" },
  { id: "sample-3", name: "Emily Carter", role: "", company: "Willow Creek Marketing, Portland, Oregon", quote: "Zoqonyx helped improve our website and overall online presence. The design looks modern, loads quickly, and provides a much better experience for our customers.", rating: 5, serviceSlug: "" },
  { id: "sample-4", name: "James Richardson", role: "", company: "SummitEdge Technologies, Phoenix, Arizona", quote: "We hired Zoqonyx for custom software development. They took the time to understand our workflow and delivered a solution that has made our internal processes much easier.", rating: 5, serviceSlug: "" },
  { id: "sample-5", name: "Jessica Morgan", role: "", company: "BlueStone Creative Studio, Tampa, Florida", quote: "The team was creative, knowledgeable, and professional throughout the project. They helped us develop a website that represents our brand exactly how we wanted.", rating: 5, serviceSlug: "" },
  { id: "sample-6", name: "Robert Hayes", role: "", company: "SilverOak Logistics, Columbus, Ohio", quote: "We needed a reliable system to manage business operations. Zoqonyx provided a practical solution and guided us through every stage of development. Highly appreciated.", rating: 5, serviceSlug: "" },
  { id: "sample-7", name: "Amanda Foster", role: "", company: "Meadowbrook Retail Group, Nashville, Tennessee", quote: "Zoqonyx developed an easy-to-use application for our business. The interface is clean, the performance is great, and communication throughout the project was excellent.", rating: 5, serviceSlug: "" },
  { id: "sample-8", name: "Christopher Reed", role: "", company: "RedStone Property Solutions, Dallas, Texas", quote: "From planning to launch, the experience was very positive. They understood our goals and created a professional website with the features we needed.", rating: 5, serviceSlug: "" },
  { id: "sample-9", name: "Ashley Bennett", role: "", company: "EverGreen Wellness Studio, San Diego, California", quote: "We approached Zoqonyx for website improvements and SEO support. Their team provided clear recommendations and helped us build a stronger digital presence.", rating: 5, serviceSlug: "" },
  { id: "sample-10", name: "Matthew Collins", role: "", company: "ClearView Financial Services, Atlanta, Georgia", quote: "Professional service and excellent communication. Zoqonyx built a custom business tool that simplified several tasks our team previously handled manually.", rating: 5, serviceSlug: "" },
  { id: "sample-11", name: "Nicole Peterson", role: "", company: "HarborPoint Design Co., Seattle, Washington", quote: "We are very happy with the website Zoqonyx developed for us. The design is clean, navigation is simple, and the team was open to feedback throughout the process.", rating: 5, serviceSlug: "" },
  { id: "sample-12", name: "Andrew Phillips", role: "", company: "Ridgeway Software Partners, Chicago, Illinois", quote: "We needed additional development support for an ongoing project. Zoqonyx provided skilled developers who integrated smoothly with our existing workflow.", rating: 5, serviceSlug: "" },
  { id: "sample-13", name: "Lauren Edwards", role: "", company: "Pinecrest Learning Solutions, Raleigh, North Carolina", quote: "The Zoqonyx team helped us develop a mobile-friendly learning platform. They were patient with our requirements and delivered a solution that was easy for our users.", rating: 5, serviceSlug: "" },
  { id: "sample-14", name: "Ryan Mitchell", role: "", company: "WestBridge Interactive, Orlando, Florida", quote: "We partnered with Zoqonyx for game development. Their technical knowledge and willingness to understand our concept made the collaboration a positive experience.", rating: 5, serviceSlug: "" },
  { id: "sample-15", name: "Megan Sullivan", role: "", company: "PureLeaf Home Services, Minneapolis, Minnesota", quote: "Our new website looks fantastic and is much easier for customers to navigate. Zoqonyx maintained good communication and handled our requested changes professionally.", rating: 5, serviceSlug: "" },
  { id: "sample-16", name: "Kevin Anderson", role: "", company: "Ironwood Manufacturing Group, Indianapolis, Indiana", quote: "Zoqonyx helped us develop a custom management system tailored to our business operations. The solution is practical, well-organized, and has improved our workflow.", rating: 5, serviceSlug: "" },
  { id: "sample-17", name: "Rachel Cooper", role: "", company: "HorizonPoint Digital Studio, Boston, Massachusetts", quote: "We needed AI-powered functionality for one of our digital products. Zoqonyx helped us understand the possibilities and develop a practical solution. Great communication and professional execution.", rating: 5, serviceSlug: "" },
];

export default function ReviewsPreviewPage() {
  return (
    <div className="zq-page">
      <div className="bg-amber-100 px-4 py-3 text-center text-sm font-semibold text-amber-900">
        Design preview only. Draft text for review. These are not published on the public pages. They go live only once each client has confirmed their review and permission.
      </div>
      <div className="py-10">
        <TestimonialsSection items={SAMPLES} />
      </div>
    </div>
  );
}
