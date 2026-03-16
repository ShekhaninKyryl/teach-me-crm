import { useCallback, useEffect, useState } from "react";
import { Separator } from "@radix-ui/themes";
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

export const ReportsSection = () => {
  const { user } = useAuth();
  const [data, setData] = useState<ReportsSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [periodType, setPeriodType] = useState<ReportsPeriodType>("week");

  const fetchReport = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const result = await reportsApi.getTutorReportsSummary(user.id, { periodType });
      setData(result);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  }, [user, periodType]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  if (!user || (loading && !data)) return <Loading size={20} />;

  return (
    <div className="flex flex-col gap-6">
      <PeriodSelector value={periodType} onChange={setPeriodType} />

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
