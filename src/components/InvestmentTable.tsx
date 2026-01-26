import { Card, CardContent } from "@/components/ui/card";

interface PricingRow {
  program: string;
  monthly: string;
  sixMonth: string;
  annual: string;
  isBundle?: boolean;
  originalSixMonth?: string;
  originalAnnual?: string;
}

const pricingData: PricingRow[] = [
  {
    program: "Power Hour",
    monthly: "$1,000",
    sixMonth: "$5,000",
    annual: "$9,000"
  },
  {
    program: "Contractor School",
    monthly: "$500",
    sixMonth: "$2,500",
    annual: "$4,500"
  },
  {
    program: "Sales & Marketing School",
    monthly: "$500",
    sixMonth: "$2,500",
    annual: "$4,500"
  },
  {
    program: "ALP University",
    monthly: "$197",
    sixMonth: "—",
    annual: "—"
  },
  {
    program: "Growth Academy",
    monthly: "$2,000",
    sixMonth: "$8,000",
    annual: "$14,000",
    isBundle: true,
    originalSixMonth: "$10,000",
    originalAnnual: "$18,000"
  },
  {
    program: "Full Access",
    monthly: "$2,500",
    sixMonth: "$10,000",
    annual: "$15,000",
    isBundle: true,
    originalSixMonth: "$12,500",
    originalAnnual: "$20,000"
  }
];

const InvestmentTable = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Investment Overview</h2>
            <p className="text-muted-foreground">
              Holiday pricing on 6-month and annual plans ends December 31.
            </p>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-medium text-muted-foreground">Program</th>
                      <th className="text-center p-4 font-medium text-muted-foreground">Monthly</th>
                      <th className="text-center p-4 font-medium text-muted-foreground">6-Month</th>
                      <th className="text-center p-4 font-medium text-muted-foreground">Annual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pricingData.map((row, index) => (
                      <tr 
                        key={index} 
                        className={`border-b border-border last:border-0 ${
                          row.isBundle ? 'bg-muted/30' : ''
                        }`}
                      >
                        <td className="p-4 font-medium">{row.program}</td>
                        <td className="p-4 text-center">{row.monthly}</td>
                        <td className="p-4 text-center">
                          {row.originalSixMonth && (
                            <span className="text-muted-foreground line-through text-sm mr-2">
                              {row.originalSixMonth}
                            </span>
                          )}
                          <span className={row.isBundle ? "text-primary font-semibold" : ""}>
                            {row.sixMonth}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {row.originalAnnual && (
                            <span className="text-muted-foreground line-through text-sm mr-2">
                              {row.originalAnnual}
                            </span>
                          )}
                          <span className={row.isBundle ? "text-primary font-semibold" : ""}>
                            {row.annual}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default InvestmentTable;
