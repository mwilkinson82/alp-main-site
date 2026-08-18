import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  imageAlt?: string;
  canonical?: string;
  noIndex?: boolean;
  type?: "website" | "article" | "profile";
}

const SEO = ({
  title,
  description,
  keywords,
  ogImage,
  imageAlt = "Altitude Logic Pressure by Marshall Wilkinson",
  canonical,
  noIndex = false,
  type = "website",
}: SEOProps) => {
  const siteUrl = "https://altitudelogicpressure.com";
  const defaultImage = `${siteUrl}/og.png`;
  const fullTitle = title.includes("Marshall Wilkinson") ? title : `${title} | Marshall Wilkinson`;
  const canonicalUrl = canonical?.startsWith("http") ? canonical : `${siteUrl}${canonical || ""}`;
  const robots = noIndex
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content="Marshall Wilkinson" />
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="ALP — Altitude Logic Pressure" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage || defaultImage} />
      <meta property="og:image:alt" content={imageAlt} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage || defaultImage} />
      <meta property="twitter:image:alt" content={imageAlt} />
    </Helmet>
  );
};

export default SEO;
