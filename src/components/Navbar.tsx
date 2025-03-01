import { JSX } from "react";
import { Link } from "react-router-dom";
// import { useState } from "react";
// import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
// import Logo from "@/assets/logo_dataforest.png";
// import Logo2 from "@/assets/Logo.png";

const flexBetween = "flex justify-between items-center";

export default function Navbar(): JSX.Element {
  return (
    <nav>
      <div className={`${flexBetween} bg-blue-500 fixed top-0 z-30 w-full py-6`}>
        <div className={`${flexBetween} mx-auto w-5/6`}>
          <div className={`${flexBetween} w-full gap-16`}>
            <img src="../assets/logo_dataforest.png" alt="logo"/>
          </div>
        </div>
        <ul className="flex space-x-4 text-white">
          <li>
            <Link to="/" className="hover:underline">Home</Link>
          </li>
          <li>
            <Link to="/about" className="hover:underline">About</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}