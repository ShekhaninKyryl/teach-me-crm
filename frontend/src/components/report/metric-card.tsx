import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconClassName?: string;
};

export const MetricCard = ({ label, value, icon: Icon, iconClassName }: Props) => {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-6 pb-5">
        <div className={cn("p-2.5 rounded-xl bg-muted shrink-0", iconClassName)}>
          <Icon size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs truncate">{label}</p>
          <p className="text-2xl font-bold leading-tight tracking-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
};

