import {
  BookOpen,
  CheckCircle,
  Clock,
  XCircle,
  Banknote,
  TrendingUp,
  Users,
  Timer,
} from "lucide-react";
import { _ } from "@/translates";
import { MetricCard } from "./metric-card";
import type { ReportsSummaryResponse } from "@shared/types/reports";

type Props = {
  metrics: ReportsSummaryResponse["metrics"];
};

export const MetricsGrid = ({ metrics }: Props) => {
  const cards = [
    {
      label: _("reports.total_lessons"),
      value: metrics.totalLessons,
      icon: BookOpen,
      iconClassName: "text-blue-500",
    },
    {
      label: _("reports.completed"),
      value: metrics.completedLessons,
      icon: CheckCircle,
      iconClassName: "text-green-500",
    },
    {
      label: _("reports.pending"),
      value: metrics.pendingLessons,
      icon: Clock,
      iconClassName: "text-amber-500",
    },
    {
      label: _("reports.cancelled"),
      value: metrics.cancelledLessons,
      icon: XCircle,
      iconClassName: "text-red-500",
    },
    {
      label: _("reports.total_revenue"),
      value: `${metrics.totalRevenue} ₴`,
      icon: Banknote,
      iconClassName: "text-emerald-500",
    },
    {
      label: _("reports.avg_price"),
      value: `${metrics.averageLessonPrice} ₴`,
      icon: TrendingUp,
      iconClassName: "text-indigo-500",
    },
    {
      label: _("reports.total_students"),
      value: metrics.totalStudents,
      icon: Users,
      iconClassName: "text-violet-500",
    },
    {
      label: _("reports.total_hours"),
      value: `${metrics.totalHours} ${_("hr")}`,
      icon: Timer,
      iconClassName: "text-orange-500",
    },
  ] as const;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((card) => (
        <MetricCard key={card.label} {...card} />
      ))}
    </div>
  );
};

