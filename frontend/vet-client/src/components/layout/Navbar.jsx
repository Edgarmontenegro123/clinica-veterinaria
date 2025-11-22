import { useAuthStore } from "../../store/authStore.js";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const { user, logout  } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? "active-link" : "";
  };

  const handleLoginClick = () => {
    navigate('/login');
    setIsOpen(false);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  // Ocultar Navbar en páginas de Login y Registro
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <header className="">
      <div className="logo">
        <img src="/logo.png" alt="Logo Veterinaria" />
        <h1>Clínica Ramvet</h1>
      </div>

      {/* Botón hamburguesa para móviles */}
      <button
        className={`navbar-toggler ${isOpen ? 'open' : ''}`}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
        <span className="navbar-toggler-icon"></span>
        <span className="navbar-toggler-icon"></span>
      </button>

      <nav className={`navbar-collapse ${isOpen ? 'show' : ''}`}>
        <ul>
          <li>
            <a href="/" className={isActive("/")} onClick={handleLinkClick}>Home</a>
          </li>

          <li>
            <a href="" onClick={handleLinkClick}>¿Quienes Somos?</a>
          </li>

          <li>
            <a href="/adoptions" className={isActive("/adoptions")} onClick={handleLinkClick}>Adopciones</a>
          </li>

          <li>
            <a href="/contact" className={isActive("/contact")} onClick={handleLinkClick}>Consultas</a>
          </li>

          <li>
            <a href="/turnos" className={isActive("/turnos")} onClick={handleLinkClick}>Turnos</a>
          </li>

          <li>
            <a href="/mypets" className={isActive("/mypets")} onClick={handleLinkClick}>Mis Mascotas</a>
          </li>
          {user ? (
            <button className="nav-auth-button nav-logout-button" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          ) : (
            <button className="nav-auth-button nav-login-button" onClick={handleLoginClick}>
              Iniciar Sesión
            </button>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
