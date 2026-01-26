import { Clock, HardHat, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const WeeklySchedule = () => {
  const days = [
    {
      day: "Monday",
      sessions: [
        { name: "Power Hour", time: "8am", icon: Clock }
      ]
    },
    {
      day: "Tuesday",
      sessions: [
        { name: "Power Hour", time: "8am", icon: Clock },
        { name: "Contractor School", time: "7pm", icon: HardHat }
      ]
    },
    {
      day: "Wednesday",
      sessions: [
        { name: "Power Hour", time: "8am", icon: Clock },
        { name: "Sales & Marketing", time: "7pm", icon: TrendingUp }
      ]
    },
    {
      day: "Thursday",
      sessions: [
        { name: "Power Hour", time: "8am", icon: Clock }
      ]
    },
    {
      day: "Friday",
      sessions: [
        { name: "Power Hour", time: "8am", icon: Clock }
      ]
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Weekly Schedule</h2>
            <p className="text-muted-foreground text-lg">
              7 live sessions per week • 20+ sessions per month • All times EST
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {days.map((dayData, index) => (
              <div key={index} className="space-y-3">
                <div className="bg-primary/20 text-primary font-semibold text-center py-2 rounded-lg">
                  {dayData.day}
                </div>
                {dayData.sessions.map((session, sessionIndex) => {
                  const Icon = session.icon;
                  return (
                    <Card key={sessionIndex} className="bg-muted/50 border-border">
                      <CardContent className="p-4 text-center">
                        <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                        <p className="font-medium text-sm">{session.name}</p>
                        <p className="text-xs text-muted-foreground">{session.time}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ))}
          </div>

          <p className="text-center text-muted-foreground mt-8">
            All sessions include full recordings if you can't attend live
          </p>
        </div>
      </div>
    </section>
  );
};

export default WeeklySchedule;
