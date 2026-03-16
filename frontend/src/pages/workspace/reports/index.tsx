import { UnderDevelopment } from "components/under-development";
import reportsApi from "@/api/reports";
import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";

export const ReportsPage = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    reportsApi
      .getTutorReportsSummary(user.id, {
        periodType: "month",
      })
      .then((data) => {
        console.log(data);
      });
  }, []);

  return <UnderDevelopment />;
};
