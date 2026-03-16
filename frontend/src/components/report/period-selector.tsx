import { cn } from "@/lib/utils";
import { _ } from "@/translates";
import type { ReportsPeriodType } from "@shared/types/reports";

type Props = {
  value: ReportsPeriodType;
  onChange: (type: ReportsPeriodType) => void;
};

const PERIODS: ReportsPeriodType[] = ["week", "month"];

export const PeriodSelector = ({ value, onChange }: Props) => {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground">
        {_("reports_page.period")}:
      </span>
      <div className="flex rounded-lg border overflow-hidden">
        {PERIODS.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={cn(
              "px-5 py-1.5 text-sm font-medium transition-colors cursor-pointer",
              value === type
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            {_(type === "week" ? "reports_page.period_week" : "reports_page.period_month")}
          </button>
        ))}
      </div>
    </div>
  );
};

