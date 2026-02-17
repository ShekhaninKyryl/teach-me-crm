import { UnderDevelopment } from "@/components/under-development";
import { _ } from "@/translates";
import { Blockquote } from "@radix-ui/themes";
import { useAuth } from "@/contexts/auth-context";
import { Link } from "components/common/link/link";
import { getConfig } from "@/configs";

export const PaymentsPage = () => {
  const { user } = useAuth();

  const emailAddress = getConfig().paymentEmailAddress;
  const emailSubject = `Payment for Tutor - ${user?.id}`;

  return (
    <div className="flex flex-col gap-4">
      <UnderDevelopment text={_("payments_page.under_developing")} />
      <Blockquote>{_("payments_page.instructions")}</Blockquote>
      <div className="w-full flex justify-center">
        <Link
          to={`mailto:${emailAddress}?subject=${emailSubject}`}
          title={_("Send an email")}
        ></Link>
      </div>
    </div>
  );
};
