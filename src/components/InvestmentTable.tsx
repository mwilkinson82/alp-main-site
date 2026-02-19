import { Card, CardContent } from "@/components/ui/card";

interface PricingRow {
  program: string;
  monthly: string;
  sixMonth: string;
  annual: string;
  isHighlight?: boolean;
}

const pricingData: PricingRow[] = [
  {
    program: "Power Hour",
    monthly: "$1,000",
    sixMonth: "$5,000",
    annual: "—"
  },
  {
    program: "Contractor School",
    monthly: "$500",
    sixMonth: "$2,500",
    annual: "—"
  },
  {
    program: "Sales & Marketing School",
    monthly: "$500",
    sixMonth: "$2,500",
    annual: "—"
  },
  {
    program: "ALP University",
    monthly: "$197/mo",
    sixMonth: "—",
    annual: "—"
  },
  {
    program: "ALP Full Access",
    monthly: "—",
    sixMonth: "$10,000",
    annual: "$15,000",
    isHighlight: true,
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
              All programs are available individually. Full Access combines everything — live rooms, archive, and private advisory.
            </p>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
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
                          row.isHighlight ? 'bg-primary/5' : ''
                        }`}
                      >
                        <td className={`p-4 font-medium ${row.isHighlight ? 'text-primary font-bold' : ''}`}>
                          {row.program}
                        </td>
                        <td className="p-4 text-center">{row.monthly}</td>
                        <td className={`p-4 text-center ${row.isHighlight ? 'text-primary font-semibold' : ''}`}>
                          {row.sixMonth}
                        </td>
                        <td className={`p-4 text-center ${row.isHighlight ? 'text-primary font-semibold' : ''}`}>
                          {row.annual}
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
