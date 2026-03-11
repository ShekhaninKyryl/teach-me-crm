import i18n from "i18next";
import { Navigate } from "react-router-dom";
import { LandingPage } from "pages/landing-pagel/LandingPage";
import LanguageWrapper from "pages/language-wrapper";
import { FindTutor } from "pages/landing-pagel/find-tutor";
import BecomeATutor from "pages/landing-pagel/become-a-tutor";
import Workspace from "pages/workspace";
import { LoginPage } from "pages/login";
import { ForgotPasswordPage } from "pages/forgot-password";
import { ResetPasswordPage } from "pages/reset-password";
import { StudentsPage } from "pages/workspace/students";
import { CalendarPage } from "pages/workspace/calendar";
import { ReportsPage } from "pages/workspace/reports";
import { IntegrationsPage } from "pages/workspace/integrations";
import { BugReportPage } from "pages/workspace/bug-repport";
import { PaymentsPage } from "pages/workspace/payments";
import { SettingsPage } from "pages/workspace/settings";
import { AboutUsPage } from "pages/about-us";

export const routes = [
  {
    path: "/:lng",
    element: <LanguageWrapper />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "reset-password",
        element: <ResetPasswordPage />,
      },
      {
        path: "",
        element: <LandingPage />,
        children: [
          { index: true, element: <Navigate to="find-tutor" replace /> },
          { path: "find-tutor", element: <FindTutor /> },
          { path: "become-tutor", element: <BecomeATutor /> },
          {
            path: "workspace",
            element: <Workspace />,
            children: [
              { index: true, element: <Navigate to="students" replace /> },
              { path: "students", element: <StudentsPage /> },
              { path: "calendar", element: <CalendarPage /> },
              { path: "reports", element: <ReportsPage /> },
              { path: "integrations", element: <IntegrationsPage /> },
              { path: "settings", element: <SettingsPage /> },
              { path: "payments", element: <PaymentsPage /> },
              { path: "bug-report", element: <BugReportPage /> },
              { path: "*", element: <Navigate to="students" replace /> },
            ],
          },
          { path: "about", element: <AboutUsPage /> },
          { path: "*", element: <Navigate to="find-tutor" replace /> },
        ],
      },
    ],
  },
  {
    path: "/",
    element: <Navigate to={`/${i18n.language}/find-tutor`} replace />,
  },
  {
    path: "*",
    element: <Navigate to={`/${i18n.language}/find-tutor`} replace />,
  },
];
