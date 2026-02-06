import { Helmet } from "react-helmet-async";

interface BlogArticleSchemaProps {
  title: string;
  description: string;
  slug: string;
  publishedAt: string | null;
  updatedAt?: string;
  featuredImage?: string | null;
}

const BlogArticleSchema = ({
  title,
  description,
  slug,
  publishedAt,
  updatedAt,
  featuredImage,
}: BlogArticleSchemaProps) => {
  const siteUrl = "https://altitudelogicpressure.com";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "url": `${siteUrl}/blog/${slug}`,
    "datePublished": publishedAt || undefined,
    "dateModified": updatedAt || publishedAt || undefined,
    "image": featuredImage || undefined,
    "author": {
      "@type": "Person",
      "name": "Marshall Wilkinson",
      "url": siteUrl,
      "jobTitle": "Business Coach, Strategic Consultant & Founder",
      "sameAs": ["https://www.marshallwilkinson.com"],
    },
    "publisher": {
      "@type": "Organization",
      "name": "ALP - Altitude Logic Pressure",
      "url": siteUrl,
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export default BlogArticleSchema;
