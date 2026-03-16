import { useEffect, useMemo, useState } from "react";
import { Blockquote, Separator } from "@radix-ui/themes";
import reportsApi from "@/api/reports";
import { useAuth } from "@/contexts/auth-context";
import { Loading } from "components/common/loading";
import { _ } from "@/translates";
import type { ReportsPeriodType, ReportsSummaryResponse } from "@shared/types/reports";
import { PeriodSelector } from "./period-selector";
import { MetricsGrid } from "./metrics-grid";
import { LessonsChart } from "./lessons-chart";
import { RevenueChart } from "./revenue-chart";
import { TopStudents } from "./top-students";

const toIsoDate = (value: Date) => value.toISOString().slice(0, 10);

const getRange = (periodType: ReportsPeriodType, anchorDate: Date) => {
  const base = new Date(anchorDate);

  if (periodType === "month") {
    const from = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), 1));
    const to = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + 1, 0));
    return { from, to };
  }

  const day = base.getUTCDay();
  const diffToMonday = (day + 6) % 7;
  const from = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate()));
  from.setUTCDate(from.getUTCDate() - diffToMonday);
  const to = new Date(from);
  to.setUTCDate(from.getUTCDate() + 6);

  return { from, to };
};

const formatRangeLabel = (from: Date, to: Date) => `${toIsoDate(from)} - ${toIsoDate(to)}`;

export const ReportsSection = () => {
  const { user } = useAuth();
  const [data, setData] = useState<ReportsSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [periodType, setPeriodType] = useState<ReportsPeriodType>("week");
  const [anchorDate, setAnchorDate] = useState(() => new Date());

  const { from, to } = useMemo(() => getRange(periodType, anchorDate), [periodType, anchorDate]);
  const fromIso = useMemo(() => toIsoDate(from), [from]);
  const toIso = useMemo(() => toIsoDate(to), [to]);
  const rangeLabel = formatRangeLabel(from, to);

  const shiftPeriod = (direction: -1 | 1) => {
    setAnchorDate((prev) => {
      if (periodType === "month") {
        return new Date(Date.UTC(prev.getUTCFullYear(), prev.getUTCMonth() + direction, 1));
      }
      const next = new Date(prev);
      next.setUTCDate(next.getUTCDate() + direction * 7);
      return next;
    });
  };

  const goToToday = () => {
    setAnchorDate(new Date());
  };

  useEffect(() => {
    if (!user) return;

    const fetchReport = async () => {
      setLoading(true);
      setData(null);
      try {
        const result = await reportsApi.getTutorReportsSummary(user.id, {
          periodType,
          from: fromIso,
          to: toIso,
        });
        setData(result);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchReport();
  }, [user?.id, periodType, fromIso, toIso]);

  if (!user) return <Loading size={20} />;

  return (
    <div className="flex flex-col gap-6">
      <Blockquote className="text-justify">{_("reports_page.instruction")}</Blockquote>

      <PeriodSelector
        value={periodType}
        onChange={setPeriodType}
        rangeLabel={rangeLabel}
        onPrev={() => shiftPeriod(-1)}
        onToday={goToToday}
        onNext={() => shiftPeriod(1)}
      />

      {loading ? (
        <Loading size={16} />
      ) : data ? (
        <>
          <MetricsGrid metrics={data.metrics} />
          <Separator className="w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <LessonsChart data={data.charts.lessonsOverTime} />
            <RevenueChart data={data.charts.revenueOverTime} />
          </div>
          <Separator className="w-full" />
          <TopStudents students={data.charts.topStudents} />
        </>
      ) : (
        <p className="text-muted-foreground text-sm">{_("reports_page.no_data")}</p>
      )}
    </div>
  );
};
