import { LucideIcon, Clock, HardHat, TrendingUp, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface ProgramCardProps {
  title: string;
  tagline: string;
  description: string;
  schedule: string;
  scheduleIcon?: LucideIcon;
  includedInBundle?: boolean;
  link?: string;
}

const scheduleIcons: Record<string, LucideIcon> = {
  "daily": Clock,
  "tuesday": HardHat,
  "wednesday": TrendingUp,
  "recordings": Video
};

const ProgramCard = ({
  title,
  tagline,
  description,
  schedule,
  scheduleIcon,
  includedInBundle = true,
  link
}: ProgramCardProps) => {
  const Icon = scheduleIcon;
  
  const content = (
    <Card className="h-full border-border hover:border-primary/50 transition-colors group">
      <CardContent className="p-6 space-y-4">
        <div className="inline-flex items-center gap-2 bg-muted/50 border border-border rounded-full px-3 py-1 text-xs">
          {Icon && <Icon className="w-3 h-3 text-primary" />}
          <span className="text-muted-foreground">{schedule}</span>
        </div>
        
        <div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-primary font-medium text-sm mb-3">{tagline}</p>
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </div>

        {includedInBundle && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-4 h-4 rounded-full border border-muted-foreground/50 flex items-center justify-center">
                <span className="text-[8px]">✓</span>
              </div>
              <span>Included in ALP Growth Academy</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (link) {
    return (
      <Link to={link} className="block">
        {content}
      </Link>
    );
  }

  return content;
};

export default ProgramCard;
