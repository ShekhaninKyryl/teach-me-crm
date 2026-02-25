import { _ } from "@/translates";
import { Link } from "components/common/link/link";
import { useTranslation } from "react-i18next";

export const NoTutors = () => {
  const { i18n } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center h-full w-full col-span-4">
      <p className="text-lg text-center">{_("No tutors found matching the criteria.")}</p>
      <p className="text-sm text-muted-foreground text-center">
        {_("Try adjusting your filters or search terms to find more tutors.")}
      </p>
      <p className="text-muted-foreground flex items-center gap-1 mt-2">
        {_("or you can")}
        <Link to={`/${i18n.language}/become-tutor`} title={_("Become a tutor")} />
      </p>
    </div>
  );
};
