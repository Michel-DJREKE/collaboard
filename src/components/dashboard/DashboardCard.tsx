
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ChevronRight } from "lucide-react";

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: 'default' | 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  children: React.ReactNode;
  className?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
  actionIcon?: React.ReactNode;
}

export default function DashboardCard({
  title,
  subtitle,
  badge,
  badgeColor = 'default',
  children,
  className,
  showViewAll = false,
  onViewAll,
  actionIcon
}: DashboardCardProps) {
  const getBadgeVariant = () => {
    switch (badgeColor) {
      case 'blue':
        return 'bg-taski-blue/10 text-taski-blue border-taski-blue/20';
      case 'green':
        return 'bg-taski-accent-green/10 text-taski-accent-green border-taski-accent-green/20';
      case 'yellow':
        return 'bg-taski-accent-yellow/10 text-taski-accent-yellow border-taski-accent-yellow/20';
      case 'red':
        return 'bg-taski-accent-red/10 text-taski-accent-red border-taski-accent-red/20';
      case 'purple':
        return 'bg-taski-accent-purple/10 text-taski-accent-purple border-taski-accent-purple/20';
      default:
        return 'bg-secondary text-foreground';
    }
  };

  return (
    <Card className={cn("border shadow-subtle overflow-hidden transition-all duration-300", className)}>
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
            {badge && (
              <Badge variant="outline" className={cn(getBadgeVariant())}>
                {badge}
              </Badge>
            )}
          </div>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-1">
          {actionIcon || (
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-4">
        {children}
        
        {showViewAll && (
          <Button 
            variant="ghost" 
            className="w-full mt-2 justify-between text-taski-blue hover:text-taski-blue-dark hover:bg-taski-blue-light/50"
            onClick={onViewAll}
          >
            <span>Tout voir</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
