import { SelectedPage } from "../shared/types";
import { Link } from "react-router-dom";

type Props = {
    page: string;
    link: string;
    selectedPage: SelectedPage;
    setSelectedPage: (value: SelectedPage) => void;
}

const NavbarLinks = ({
    page,
    link,
    selectedPage,
    setSelectedPage
}: Props) => {

  const lowerCasePage = link.toLowerCase().replace(/ /g, "") as SelectedPage;

  return (
    <Link
      to={`/${link}`} // A rota será baseada no nome da página
      className={`${selectedPage === lowerCasePage ? "text-primary-500" : ""} 
      transition duration-500 hover:text-primary-300`}
      onClick={() => setSelectedPage(lowerCasePage)}
    >
      {page}
    </Link>
  )
}

export default NavbarLinks