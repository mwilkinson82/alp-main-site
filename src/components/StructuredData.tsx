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
      "name": "Marshall Wilkinson - ALP (Altitude Logic Pressure)",
      "alternateName": ["Marshall Wilkinson Coaching", "ALP", "Altitude Logic Pressure"],
      "url": baseUrl,
      "logo": `${baseUrl}/alp-logo.png`,
      "description": "Marshall Wilkinson is an elite business coach and strategic consultant. Over $2.5 billion in proven results. Expert guidance for entrepreneurs, CEOs, and sales professionals through ALP (Altitude Logic Pressure).",
      "founder": {
        "@type": "Person",
        "name": "Marshall Wilkinson",
        "jobTitle": "Business Coach, Strategic Consultant & Founder",
        "url": baseUrl,
        "sameAs": [
          "https://www.marshallwilkinson.com"
        ]
      },
      "areaServed": "US",
      "serviceType": ["Business Coaching", "Executive Coaching", "Sales Training", "Leadership Development", "Strategic Consulting"],
      "priceRange": "$$$$"
    },
    service: {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": data?.serviceType || "Business Coaching",
      "provider": {
        "@type": "Person",
        "name": "Marshall Wilkinson",
        "brand": {
          "@type": "Brand",
          "name": "ALP - Altitude Logic Pressure"
        }
      },
      "description": data?.description || "Professional business coaching and consulting services by Marshall Wilkinson",
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
      "name": data?.name || "Marshall Wilkinson's ALP University",
      "description": data?.description || "Comprehensive business, mindset, and sales training by Marshall Wilkinson",
      "provider": {
        "@type": "Person",
        "name": "Marshall Wilkinson",
        "brand": {
          "@type": "Brand",
          "name": "ALP - Altitude Logic Pressure"
        }
      },
      "instructor": {
        "@type": "Person",
        "name": "Marshall Wilkinson"
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
