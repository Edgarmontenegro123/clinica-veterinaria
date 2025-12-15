import { useAuthStore } from "../../store/authStore.js";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const { user, logout  } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const [underlineOpacity, setUnderlineOpacity] = useState(1);
  const navRef = useRef(null);

  const isActive = (path) => {
    return location.pathname === path ? "active-link" : "";
  };

  // Actualizar posición de la barra cuando cambia la ruta
  useEffect(() => {
    if (navRef.current) {
      const activeLink = navRef.current.querySelector('.active-link');
      if (activeLink) {
        updateUnderline(activeLink);
        setUnderlineOpacity(1);
      }
    }
  }, [location.pathname]);

  // Forzar cierre del menú en orientación horizontal
  useEffect(() => {
    const handleOrientationChange = () => {
      if (window.innerHeight < 500 && window.matchMedia("(orientation: landscape)").matches) {
        setIsOpen(false);
      }
    };

    // Verificar al montar el componente
    handleOrientationChange();

    // Escuchar cambios de orientación y tamaño
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  const updateUnderline = (element) => {
    if (element && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const linkRect = element.getBoundingClientRect();
      setUnderlineStyle({
        left: linkRect.left - navRect.left,
        width: linkRect.width
      });
    }
  };

  const handleMouseEnter = (e) => {
    // Desvanecer la barra en su posición actual
    setUnderlineOpacity(0);

    // Después de que se desvanezca, moverla al nuevo link y mostrarla
    setTimeout(() => {
      updateUnderline(e.target);
      setTimeout(() => setUnderlineOpacity(1), 50);
    }, 300); // Esperar a que termine la transición de opacidad
  };

  const handleMouseLeave = () => {
    // Desvanecer la barra en su posición actual
    setUnderlineOpacity(0);

    // Después de que se desvanezca, moverla de vuelta al link activo y mostrarla
    setTimeout(() => {
      if (navRef.current) {
        const activeLink = navRef.current.querySelector('.active-link');
        if (activeLink) {
          updateUnderline(activeLink);
          setTimeout(() => setUnderlineOpacity(1), 50);
        }
      }
    }, 300); // Esperar a que termine la transición de opacidad
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
      <a href="/" className="logo cursor-pointer" onClick={handleLinkClick}>
        <img src="/logo.png" alt="Logo Veterinaria" />
        <h1>Clínica Ramvet</h1>
      </a>

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
        <ul ref={navRef} style={{ position: 'relative' }}>
          <li>
            <a
              href="/"
              className={isActive("/")}
              onClick={handleLinkClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Home
            </a>
          </li>

          <li>
            <a
              href="/mypets"
              className={isActive("/mypets")}
              onClick={handleLinkClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Mis Mascotas
            </a>
          </li>

          <li>
            <a
              href="/adoptions"
              className={isActive("/adoptions")}
              onClick={handleLinkClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Adopciones
            </a>
          </li>

          <li>
            <a
              href="/turnos"
              className={isActive("/turnos")}
              onClick={handleLinkClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Turnos
            </a>
          </li>

          <li>
            <a
              href="/contact"
              className={isActive("/contact")}
              onClick={handleLinkClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Consultas
            </a>
          </li>

          <li>
            <a
              href="/ospan"
              className={isActive("/ospan")}
              onClick={handleLinkClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              OSPAN
            </a>
          </li>

          <li>
            <a
              href="/about"
              className={isActive("/about")}
              onClick={handleLinkClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              ¿Quiénes Somos?
            </a>
          </li>

          {/* Barra de subrayado animada */}
          <span
            className="nav-underline"
            style={{
              position: 'absolute',
              bottom: '6px',
              left: `${underlineStyle.left}px`,
              width: `${underlineStyle.width}px`,
              height: '4px',
              backgroundColor: 'black',
              opacity: underlineOpacity,
              transition: 'opacity 0.3s ease',
              pointerEvents: 'none'
            }}
          />

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
