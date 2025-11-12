import { useAuthStore } from "../../store/authStore.js";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const { user, logout  } = useAuthStore();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "active-link" : "";
  };

  return (
    <header className="">
      <div className="logo">
        <img src="/logo.png" alt="Logo Veterinaria" />
        <h1>Clínica Ramvet</h1>
      </div>

      <nav>
        <ul>
          <li>
            <a href="/" className={isActive("/")}>Home</a>
          </li>

          <li>
            <a href="">¿Quienes Somos?</a>
          </li>

          <li>
            <a href="/adoptions" className={isActive("/adoptions")}>Adopciones</a>
          </li>

          <li>
            <a href="">Consultas</a>
          </li>

          <li>
            <a href="/turnos" className={isActive("/turnos")}>Turnos</a>
          </li>

          <li>
            <a href="/mypets" className={isActive("/mypets")}>Mis Mascotas</a>
          </li>
          {user ? (
            <button onClick={logout}>Cerrar Sesión</button>
          ) : (
            <a href="/login">Iniciar Sesión</a>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
