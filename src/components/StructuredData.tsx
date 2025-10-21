import { Helmet } from "react-helmet-async";

interface StructuredDataProps {
  type: "organization" | "service" | "course";
  data?: Record<string, any>;
}

const StructuredData = ({ type, data }: StructuredDataProps) => {
  const baseUrl = "https://marshallwilkinson.com";

  const schemas = {
    organization: {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "ALP - Altitude Logic Pressure",
      "alternateName": "Marshall Wilkinson Coaching",
      "url": baseUrl,
      "logo": `${baseUrl}/alp-logo.png`,
      "description": "Elite business coaching and consulting services. Over $2.5 billion in construction success. Expert guidance for entrepreneurs, CEOs, and sales professionals.",
      "founder": {
        "@type": "Person",
        "name": "Marshall Wilkinson",
        "jobTitle": "Business Coach & Consultant"
      },
      "areaServed": "US",
      "serviceType": ["Business Coaching", "Executive Coaching", "Sales Training", "Leadership Development"],
      "priceRange": "$$$$"
    },
    service: {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": data?.serviceType || "Business Coaching",
      "provider": {
        "@type": "ProfessionalService",
        "name": "ALP - Altitude Logic Pressure"
      },
      "description": data?.description || "Professional business coaching and consulting services",
      "areaServed": "US",
      "offers": data?.offers || {
        "@type": "Offer",
        "availability": "https://schema.org/InStock",
        "price": data?.price || "1000",
        "priceCurrency": "USD"
      }
    },
    course: {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": data?.name || "ALP University Training",
      "description": data?.description || "Comprehensive business, mindset, and sales training",
      "provider": {
        "@type": "Organization",
        "name": "ALP - Altitude Logic Pressure"
      },
      "offers": {
        "@type": "Offer",
        "price": data?.price || "197",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      }
    }
  };

  const selectedSchema = schemas[type];

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(selectedSchema)}
      </script>
    </Helmet>
  );
};

export default StructuredData;
