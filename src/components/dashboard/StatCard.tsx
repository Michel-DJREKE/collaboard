
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  progress?: number;
  colorClass?: string;
  iconBgClass?: string;
  className?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  change,
  progress,
  colorClass = "text-taski-blue",
  iconBgClass = "bg-taski-blue-light",
  className
}: StatCardProps) {
  const isPositiveChange = change && change > 0;
  
  return (
    <Card className={cn("border shadow-subtle transition-all duration-300 hover:shadow-card", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            
            {typeof change !== 'undefined' && (
              <div className="flex items-center mt-1">
                <div className={cn(
                  "flex items-center text-xs font-medium",
                  isPositiveChange ? "text-taski-accent-green" : "text-taski-accent-red"
                )}>
                  {isPositiveChange ? (
                    <ArrowUpIcon className="mr-1 h-3 w-3" />
                  ) : (
                    <ArrowDownIcon className="mr-1 h-3 w-3" />
                  )}
                  {Math.abs(change)}%
                </div>
                <span className="text-xs text-muted-foreground ml-1">vs mois dernier</span>
              </div>
            )}
          </div>
          
          <div className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center",
            iconBgClass
          )}>
            <div className={cn("h-5 w-5", colorClass)}>
              {icon}
            </div>
          </div>
        </div>
        
        {typeof progress !== 'undefined' && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Progression</span>
              <span className="text-xs font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
