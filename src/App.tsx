import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import ReforestedAreaCreate from "./pages/ReforestedAreaCreate";
import { JSX, useEffect, useState } from "react";
import { SelectedPage } from "./shared/types";

export default function App(): JSX.Element {

  const [selectedPage, setSelectedPage] = useState<SelectedPage>(SelectedPage.Dashboard);

  const [isTopOfPage, setIsTopOfPage] = useState<boolean>(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsTopOfPage(true);
        setSelectedPage(SelectedPage.Dashboard);
      } else {
        setIsTopOfPage(false);
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Router>
      <Navbar
        isTopOfPage={isTopOfPage}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/cadastrardados" element={<ReforestedAreaCreate />} />
      </Routes>
    </Router>
  );
}