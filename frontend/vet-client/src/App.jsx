import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import PetRegisterPage from "./pages/PetRegisterPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import PetsPage from "./pages/PetsPage.jsx";
import AdoptionPage from "./pages/AdoptionPage.jsx";
import AdoptionPetFormPage from "./pages/AdoptionPetFormPage.jsx";
import AppointmentsPage from "./pages/AppointmentsPage.jsx";
import AdminPetManagement from "./pages/AdminPetManagement.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import EmailConfirmedPage from "./pages/EmailConfirmedPage.jsx";
import AboutUsPage from "./pages/AboutUsPage.jsx";
import OspanPage from "./pages/OspanPage.jsx";
import { useAuthStore } from "./store/authStore.js";

export default function App() {
  const { checkSession } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // Verificar sesión al cargar la aplicación
    checkSession();
  }, [checkSession]);

  // Ocultar footer en páginas de login, registro, mis mascotas, registrar mascotas, adopciones y gestión admin
  const hideFooter = location.pathname.toLowerCase() === '/login' ||
                     location.pathname.toLowerCase() === '/register' ||
                     location.pathname.toLowerCase() === '/mypets' ||
                     location.pathname.toLowerCase() === '/petregister' ||
                     location.pathname.toLowerCase() === '/adoptions' ||
                     location.pathname.toLowerCase().startsWith('/admin/pets/') ||
                     location.pathname.toLowerCase().startsWith('/admin/adoption/');

  // Remover padding-top en páginas de registro de mascotas, mis mascotas y adopciones
  const removePadding = location.pathname.toLowerCase() === '/petregister' ||
                        location.pathname.toLowerCase() === '/mypets' ||
                        location.pathname.toLowerCase() === '/adoptions' ||
                        location.pathname.toLowerCase().startsWith('/admin/adoption/');

  return (
    <div className="flex flex-col min-h-screen">
      {/* NAVBAR */}
      <Navbar />
      <main className={`flex flex-col flex-1 px-2 ${removePadding ? '' : 'pt-[6rem]'}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/profile" element={<HomePage />} /> */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/petregister" element={<PetRegisterPage />} />
          <Route path="/mypets" element={<PetsPage />} />
          <Route path="/adoptions" element={<AdoptionPage />} />
          <Route path="/admin/adoption/new" element={<AdoptionPetFormPage />} />
          <Route path="/admin/adoption/:id/edit" element={<AdoptionPetFormPage />} />
          <Route path="/turnos" element={<AppointmentsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/ospan" element={<OspanPage />} />
          <Route path="/admin/pets/:id" element={<AdminPetManagement />} />
          <Route path="/auth/confirm" element={<EmailConfirmedPage />} />
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
      {!hideFooter && <Footer />}
    </div>
  );
}
