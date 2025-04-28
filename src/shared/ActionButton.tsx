import { Link } from "react-router-dom";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { SelectedPage } from "./types";

type Props = {
  children: React.ReactNode;
  setSelectedPage: (value: SelectedPage) => void;
  value: SelectedPage;
  href: string;
};

const ActionButton = ({ children, setSelectedPage, value, href }: Props) => {
  const baseClasses = "rounded-md bg-secondary-500 px-10 py-2 hover:bg-primary-500 hover:text-white";

  return href.startsWith("/") ? (
    <Link
      to={href}
      className={baseClasses}
      onClick={() => setSelectedPage(value)}
    >
      {children}
    </Link>
  ) : (
    <AnchorLink
      href={href}
      className={baseClasses}
      onClick={() => setSelectedPage(value)}
    >
      {children}
    </AnchorLink>
  );
};

export default ActionButton;
