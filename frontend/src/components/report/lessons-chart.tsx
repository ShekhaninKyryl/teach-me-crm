import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { _ } from "@/translates";
import type { ReportsSummaryResponse } from "@shared/types/reports";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Props = {
  data: ReportsSummaryResponse["charts"]["lessonsOverTime"];
};

export const LessonsChart = ({ data }: Props) => {
  const labels = data.map((d) => d.label.slice(5)); // MM-DD

  const chartData = {
    labels,
    datasets: [
      {
        label: _("reports.completed"),
        data: data.map((d) => d.completed),
        backgroundColor: "#22c55e",
        stack: "lessons",
        borderRadius: 0,
      },
      {
        label: _("reports.pending"),
        data: data.map((d) => d.pending),
        backgroundColor: "#f59e0b",
        stack: "lessons",
        borderRadius: 0,
      },
      {
        label: _("reports.cancelled"),
        data: data.map((d) => Math.max(0, d.total - d.completed - d.pending)),
        backgroundColor: "#ef4444",
        stack: "lessons",
        borderRadius: 4,
      },
    ],
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{_("reports.lessons_over_time")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
              legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 11 } } },
              tooltip: { mode: "index", intersect: false },
            },
            scales: {
              x: { stacked: true, grid: { display: false }, ticks: { font: { size: 11 } } },
              y: {
                stacked: true,
                ticks: { stepSize: 1, font: { size: 11 } },
                grid: { color: "rgba(128,128,128,0.15)" },
              },
            },
          }}
        />
      </CardContent>
    </Card>
  );
};

