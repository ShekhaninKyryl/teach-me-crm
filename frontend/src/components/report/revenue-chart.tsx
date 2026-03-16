import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { _ } from "@/translates";
import type { ReportsSummaryResponse } from "@shared/types/reports";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

type Props = {
  data: ReportsSummaryResponse["charts"]["revenueOverTime"];
};

export const RevenueChart = ({ data }: Props) => {
  const labels = data.map((d) => d.label.slice(5)); // MM-DD

  const chartData = {
    labels,
    datasets: [
      {
        label: _("reports.revenue"),
        data: data.map((d) => d.revenue),
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,0.15)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{_("reports.revenue_over_time")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (ctx) => `${ctx.parsed.y} ₴`,
                },
              },
            },
            scales: {
              x: { grid: { display: false }, ticks: { font: { size: 11 } } },
              y: {
                ticks: { font: { size: 11 }, callback: (v) => `${v} ₴` },
                grid: { color: "rgba(128,128,128,0.15)" },
              },
            },
          }}
        />
      </CardContent>
    </Card>
  );
};

