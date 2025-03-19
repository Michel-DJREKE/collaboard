
import * as React from "react";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AvatarGroupProps {
  limit?: number;
  className?: string;
  children?: React.ReactNode;
}

const AvatarGroup = React.forwardRef<
  HTMLDivElement,
  AvatarGroupProps
>(({ limit = 4, className, children, ...props }, ref) => {
  // Determine the child count
  const childrenArray = React.Children.toArray(children);
  const totalChildren = childrenArray.length;
  const visibleChildren = childrenArray.slice(0, limit);
  const overflowCount = totalChildren - limit;

  return (
    <div
      ref={ref}
      className={cn("flex flex-row-reverse justify-end", className)}
      {...props}
    >
      {overflowCount > 0 && (
        <Avatar className="-mr-3 hover:-mr-4 ring-2 ring-background hover:translate-y-[-2px] transition-all">
          <div>+{overflowCount}</div>
        </Avatar>
      )}

      {visibleChildren.map((child, i) => (
        <div
          key={i}
          className={cn(
            "-mr-3 hover:-mr-4 ring-2 ring-background hover:translate-y-[-2px] transition-all"
          )}
        >
          {child}
        </div>
      ))}
    </div>
  );
});

AvatarGroup.displayName = "AvatarGroup";

export { AvatarGroup };
