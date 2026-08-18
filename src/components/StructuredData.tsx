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
      "https://marshallwilkinson.com/",
      "https://www.linkedin.com/in/marshallwilkinson",
      "https://instagram.com/realmarshallwilkinson",
      "https://marshallinbio.com/",
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
      url: "https://alphandbook.com/preview",
      description: "Marshall Wilkinson's operating handbook for building stronger construction companies.",
      author: { "@id": marshallId },
      publisher: { "@id": organizationId },
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://alpos.alpcontractorcircle.com/#software",
      name: "AOS by ALP",
      alternateName: ["ALP Operating System", "AOS"],
      url: "https://alpos.alpcontractorcircle.com/",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: "The ALP company operating system for leadership accountability, operating cadence, priorities, scorecards, and execution.",
      author: { "@id": organizationId },
      brand: { "@id": brandId },
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://overwatch.alpcontractorcircle.com/#software",
      name: "OverWatch by ALP",
      alternateName: ["ALP OverWatch", "OverWatch"],
      url: "https://overwatch.alpcontractorcircle.com/",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: "The ALP project-control platform for construction risk, commitments, work in progress, commercial control, and daily project evidence.",
      author: { "@id": organizationId },
      brand: { "@id": brandId },
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
          name: "Marshall Wilkinson and the ALP Ecosystem",
          description: "The connected ALP ecosystem: Altitude Logic Pressure, ALP Contractor Circle, the ALP Handbook, AOS by ALP, OverWatch by ALP, and founder Marshall Wilkinson.",
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
                text: "Marshall Wilkinson is the founder of Altitude Logic Pressure and the operator, author, and strategic advisor behind ALP Contractor Circle, the ALP Handbook, AOS by ALP, and OverWatch by ALP.",
              },
            },
            {
              "@type": "Question",
              name: "What is Altitude Logic Pressure?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Altitude Logic Pressure, commonly called ALP, is the parent construction-business doctrine and education brand. It develops the operating systems, training, advisory, and tools that connect the ALP ecosystem.",
              },
            },
            {
              "@type": "Question",
              name: "What is ALP Contractor Circle?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "ALP Contractor Circle is the flagship owner environment in the ALP ecosystem. It is built for construction company owners working on the entrepreneurial and operating side of the business, not just the mechanics of an individual project.",
              },
            },
            {
              "@type": "Question",
              name: "How do AOS and OverWatch work together?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "AOS by ALP works at the company level: accountability, leadership cadence, priorities, and execution. OverWatch by ALP works at the project level: risk, commitments, work in progress, commercial control, and project evidence.",
              },
            },
            {
              "@type": "Question",
              name: "What is the ALP Handbook?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The ALP Handbook is Marshall Wilkinson's written operating doctrine for construction owners. It gives the ideas behind the ALP ecosystem a durable reference owners and leadership teams can use in the real work.",
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
      "serviceType": data?.serviceType || "Business Coaching",
      "provider": {
        "@id": organizationId,
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
