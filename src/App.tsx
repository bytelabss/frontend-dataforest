import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import ReforestedAreaCreate from "./pages/ReforestedAreaCreate";
import { JSX, useEffect, useState } from "react";
import { SelectedPage } from "./shared/types";
import MapPage from "./pages/MapPage";
import SignIn from "./pages/SingIn";
import Usuarios from "./pages/Users";
import ProtectedRoute from "./components/ProtectedRoute";

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
        <Route path="/cadastrardados" element={
          <ProtectedRoute>
            <ReforestedAreaCreate />
          </ProtectedRoute>
          
        } />
        <Route path="/mapa" element={
          <ProtectedRoute>
            <MapPage />
          </ProtectedRoute>        
        } />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/usuarios" element={<Usuarios />} />
      </Routes>
    </Router>
  );
}