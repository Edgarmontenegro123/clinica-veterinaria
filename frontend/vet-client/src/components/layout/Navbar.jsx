import { useAuthStore } from "../../store/authStore.js";

const Navbar = () => {
  const { user, logout  } = useAuthStore();

  return (
    <header className="">
      <a href="/" className="logo">
        <img src="/logo.png" alt="Logo Veterinaria" />
        <h1>Clínica Ramvet</h1>
      </a>

      <nav>
        <ul>
          <li>
            <a href="">¿Quienes Somos?</a>
          </li>

          <li>
            <a href="/adoptions">Adopciones</a>
          </li>

          <li>
            <a href="">Consultas</a>
          </li>

          <li>
            <a href="">Turnos</a>
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
