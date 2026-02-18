import { _ } from "@/translates";
import { Blockquote } from "@radix-ui/themes";
import { Link } from "components/common/link/link";
import { useAuth } from "@/contexts/auth-context";
import { getConfig } from "@/configs";

export const BugReportPage = () => {
  const { user } = useAuth();

  const emailAddress = getConfig().bugReportEmailAddress;
  const emailSubject = `Reported bug by Tutor - ${user?.id}`;

  return (
    <div className="flex flex-col gap-4">
      <Blockquote>{_("bug_report_page.instructions")}</Blockquote>
      <Link to={`mailto:${emailAddress}?subject=${emailSubject}`} title={_("Send an email")} />
    </div>
  );
};
