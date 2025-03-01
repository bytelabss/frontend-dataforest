import { JSX } from "react";
// import { Link } from "react-router-dom";
// import { useState } from "react";
// import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import Logo from "../assets/logo_dataforest2.png";
import NavbarLinks from "./NavbarLinks";
import { SelectedPage } from "../shared/types";

type Props = {
  selectedPage: SelectedPage;
  setSelectedPage: (value: SelectedPage) => void;
}

const flexBetween = "flex justify-between items-center";

export default function Navbar({selectedPage, setSelectedPage}: Props): JSX.Element {
  return (
    <nav>
      <div className={`${flexBetween} bg-blue-500 fixed top-0 z-30 w-full py-6`}>
        <div className={`${flexBetween} mx-auto w-5/6`}>
          <div className={`${flexBetween} w-full gap-16`}>
            {/* left side */}
            <img src={Logo} alt="logo"/>
            {/* right side */}
            <div className={`${flexBetween} w-full`}>
              <div className={`${flexBetween} gap-8 text-sm`}>
                <NavbarLinks 
                  page="Home"
                  selectedPage={selectedPage}
                  setSelectedPage={setSelectedPage}
                />
                <NavbarLinks
                  page="Benefits"
                  selectedPage={selectedPage}
                  setSelectedPage={setSelectedPage}
                />
                <NavbarLinks
                  page="Classes"
                  selectedPage={selectedPage}
                  setSelectedPage={setSelectedPage}
                />
                <NavbarLinks
                  page="Contact us"
                  selectedPage={selectedPage}
                  setSelectedPage={setSelectedPage}
                />
              </div>
              <div className={`${flexBetween} gap-8`}>
                <p>Sign In</p>
                <button>Become a member</button>
              </div>
            </div>
          </div>
        </div>
        {/* <ul className="flex space-x-4 text-white">
          <li>
            <Link to="/" className="hover:underline">Home</Link>
          </li>
          <li>
            <Link to="/about" className="hover:underline">About</Link>
          </li>
        </ul> */}
      </div>
    </nav>
  );
}