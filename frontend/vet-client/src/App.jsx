import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import PetRegisterPage from "./pages/PetRegisterPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import PetsPage from "./pages/PetsPage.jsx";
import AdoptionsPage from "./pages/AdoptionsPage.jsx";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* NAVBAR */}
      <Navbar />
      <main className="flex flex-1 px-2 ">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/profile" element={<HomePage />} /> */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/petregister" element={<PetRegisterPage />} />
          <Route path="/mypets" element={<PetsPage />} />
          <Route path="/adoptions" element={<AdoptionsPage />} />
          <Route
            path="/*"
            element={
              <div className="w-screen h-screen overflow-hidden">
                <img
                  src="/2417237.jpg"
                  alt="not found"
                  className="w-full h-full  object-scale-down"
                />
              </div>
            }
          />
        </Routes>
      </main>
      {/* FOOTER */}
    </div>
  );
}
