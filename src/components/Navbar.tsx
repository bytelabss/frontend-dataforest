import { JSX } from "react";
import { Link } from "react-router-dom";

export default function Navbar(): JSX.Element {
  return (
    <nav className="bg-blue-500 p-4">
      <ul className="flex space-x-4 text-white">
        <li>
          <Link to="/" className="hover:underline">Home</Link>
        </li>
        <li>
          <Link to="/about" className="hover:underline">About</Link>
        </li>
      </ul>
    </nav>
  );
}