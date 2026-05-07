import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: { value: number; label: string };
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = "text-primary",
  trend,
}: StatsCardProps) {
  const TrendIcon = trend
    ? trend.value > 0
      ? TrendingUp
      : trend.value < 0
      ? TrendingDown
      : Minus
    : null;

  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
          </div>
          <div className={cn("p-2.5 rounded-xl bg-primary/10", iconColor.replace("text-", "bg-").replace("600", "100"))}>
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
        </div>
        {(description || trend) && (
          <div className="mt-3 flex items-center gap-1">
            {trend && TrendIcon && (
              <TrendIcon
                className={cn(
                  "h-3.5 w-3.5",
                  trend.value > 0 ? "text-green-500" : trend.value < 0 ? "text-red-500" : "text-muted-foreground"
                )}
              />
            )}
            <p className="text-xs text-muted-foreground">
              {trend && (
                <span
                  className={cn(
                    "font-medium",
                    trend.value > 0 ? "text-green-600" : trend.value < 0 ? "text-red-600" : "text-muted-foreground"
                  )}
                >
                  {trend.value > 0 ? "+" : ""}
                  {trend.value}%{" "}
                </span>
              )}
              {description ?? trend?.label}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
