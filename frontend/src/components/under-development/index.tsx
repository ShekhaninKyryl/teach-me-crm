import { Flex, Blockquote } from "@radix-ui/themes";
import type { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { _ } from "@/translates";

type Props = {
  text?: string;
  icon?: React.ReactNode;
};

export const UnderDevelopment: FC<Props> = ({ icon, text }) => (
  <Flex gap="2" align="start">
    <Blockquote color="amber" className="flex gap-2">
      <div>{icon || <FontAwesomeIcon icon="triangle-exclamation" />}</div>
      <div>{text || _("This page is under development.")}</div>
    </Blockquote>
  </Flex>
);
