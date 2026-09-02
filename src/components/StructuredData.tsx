import { Helmet } from "react-helmet-async";

interface StructuredDataProps {
  type: "organization" | "ecosystem" | "service" | "course";
  data?: Record<string, unknown>;
}

const StructuredData = ({ type, data }: StructuredDataProps) => {
  const baseUrl = "https://altitudelogicpressure.com";
  const organizationId = `${baseUrl}/#organization`;
  const brandId = `${baseUrl}/#brand`;
  const marshallId = "https://marshallwilkinson.com/#person";

  const marshall = {
    "@type": "Person",
    "@id": marshallId,
    name: "Marshall Wilkinson",
    jobTitle: "Founder, Operator and Strategic Advisor",
    url: "https://marshallwilkinson.com/",
    worksFor: { "@id": organizationId },
    sameAs: [
      "https://www.instagram.com/realmarshallwilkinson",
      "https://www.tiktok.com/@realmarshallwilkinson",
      "https://marshallinbio.com/",
      "https://marshallwilkinson.com/",
    ],

  };

  const organization = {
    "@type": ["Organization", "ProfessionalService"],
    "@id": organizationId,
    name: "Altitude Logic Pressure",
    alternateName: ["ALP", "Altitude Logic Pressure (ALP)"],
    url: `${baseUrl}/`,
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}/alp-logo.png`,
    },
    description: "Field-tested operating doctrine, education, software, and advisory for construction company owners and leadership teams.",
    founder: { "@id": marshallId },
    brand: { "@id": brandId },
    areaServed: "US",
  };

  const brand = {
    "@type": "Brand",
    "@id": brandId,
    name: "ALP",
    alternateName: "Altitude Logic Pressure",
    url: `${baseUrl}/`,
    logo: `${baseUrl}/alp-logo.png`,
  };

  const ecosystemEntities = [
    {
      "@type": "Service",
      "@id": "https://alpcontractorcircle.com/#service",
      name: "ALP Contractor Circle",
      alternateName: "Contractor Circle",
      url: "https://alpcontractorcircle.com/",
      description: "The flagship ALP owner environment for construction company owners working on leadership, structure, cash, risk, accountability, systems, and execution.",
      provider: { "@id": organizationId },
      brand: { "@id": brandId },
    },
    {
      "@type": "Book",
      "@id": "https://alphandbook.com/#book",
      name: "The ALP Handbook",
      alternateName: "ALP Handbook",
      url: "https://alphandbook.com",
      description: "Marshall Wilkinson's operating handbook for building stronger construction companies.",
      author: { "@id": marshallId },
      publisher: { "@id": organizationId },
    },
  ];

  const schemas = {
    organization: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${baseUrl}/#website`,
          url: `${baseUrl}/`,
          name: "ALP — Altitude Logic Pressure",
          publisher: { "@id": organizationId },
          inLanguage: "en-US",
        },
        organization,
        brand,
        marshall,
      ],
    },
    ecosystem: {
      "@context": "https://schema.org",
      "@graph": [
        organization,
        brand,
        marshall,
        {
          "@type": "WebPage",
          "@id": `${baseUrl}/ecosystem/#webpage`,
          url: `${baseUrl}/ecosystem`,
          name: "Marshall Wilkinson and ALP",
          description: "Altitude Logic Pressure, ALP Contractor Circle, the ALP Handbook, and founder Marshall Wilkinson.",
          about: [{ "@id": organizationId }, { "@id": marshallId }, ...ecosystemEntities.map((entity) => ({ "@id": entity["@id"] }))],
          isPartOf: { "@id": `${baseUrl}/#website` },
          inLanguage: "en-US",
        },
        {
          "@type": "FAQPage",
          "@id": `${baseUrl}/ecosystem/#faq`,
          mainEntity: [
            {
              "@type": "Question",
              name: "Who is Marshall Wilkinson?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Marshall Wilkinson is the founder of Altitude Logic Pressure and the operator, author, and strategic advisor behind ALP Contractor Circle and the ALP Handbook.",
              },
            },
            {
              "@type": "Question",
              name: "What is Altitude Logic Pressure?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Altitude Logic Pressure, commonly called ALP, is a construction-business doctrine and advisory firm for owners and leadership teams.",
              },
            },
            {
              "@type": "Question",
              name: "What is ALP Contractor Circle?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "ALP Contractor Circle is the flagship owner environment for construction company owners. It is built for construction company owners working on the entrepreneurial and operating side of the business, not just the mechanics of an individual project.",
              },
            },
            {
              "@type": "Question",
              name: "What is the ALP Handbook?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The ALP Handbook is Marshall Wilkinson's written operating doctrine for construction owners. It gives construction owners and leadership teams a durable reference for the real work.",
              },
            },
          ],
        },
        ...ecosystemEntities,
      ],
    },
    service: {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": data?.serviceType || "Private Advisory and Operating Intensives",
      "provider": {
        "@id": organizationId,
      },
      "description": data?.description || "Private advisory and operating intensives for construction owners, led by Marshall Wilkinson",

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
        "@id": organizationId,
      },
      "instructor": {
        "@id": marshallId,
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
