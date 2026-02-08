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
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">Your Weekly Schedule</h2>
            <p className="text-muted-foreground text-sm md:text-lg px-2">
              7 live sessions per week • 20+ sessions per month • All times EST
            </p>
          </div>

          {/* Mobile: Horizontal scroll layout */}
          <div className="md:hidden">
            <p className="text-xs text-muted-foreground text-center mb-2 flex items-center justify-center gap-1">
              <span>←</span> Swipe to see full schedule <span>→</span>
            </p>
            <div className="overflow-x-auto pb-4 -mx-4 px-4">
              <div className="flex gap-3 min-w-max">
                {days.map((dayData, index) => (
                  <div key={index} className="space-y-2 w-[140px] flex-shrink-0">
                    <div className="bg-primary/20 text-primary font-semibold text-center py-2 rounded-lg text-sm">
                      {dayData.day}
                    </div>
                    {dayData.sessions.map((session, sessionIndex) => {
                      const Icon = session.icon;
                      return (
                        <Card key={sessionIndex} className="bg-muted/50 border-border">
                          <CardContent className="p-3 text-center">
                            <Icon className="w-5 h-5 text-primary mx-auto mb-1.5" />
                            <p className="font-medium text-xs">{session.name}</p>
                            <p className="text-[10px] text-muted-foreground">{session.time}</p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop: Grid layout */}
          <div className="hidden md:grid md:grid-cols-5 gap-4">
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

          <p className="text-center text-muted-foreground text-sm md:text-base mt-6 md:mt-8">
            All sessions include full recordings if you can't attend live
          </p>
        </div>
      </div>
    </section>
  );
};

export default WeeklySchedule;
