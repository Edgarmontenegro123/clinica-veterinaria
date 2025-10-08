// src/components/Header.jsx
import { FaShoppingCart } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { useState } from 'react'; // Solo necesitamos useState, ya no useContext
// Importaciones comentadas eliminadas o ignoradas:
// /*import { CarritoContext } from '../context/CarritoContext'; */
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Offcanvas from 'react-bootstrap/Offcanvas';
// Importaciones comentadas eliminadas o ignoradas:
// /*import { useAuth } from '../context/AuthProvider';
// import { useLoginModal } from '../context/LoginModalProvider';*/
import { User, LogOut } from 'lucide-react';
import Swal from 'sweetalert2'; 
// /*import '../css/header.css';*/

function Header() {
  // ⚠️ SIMULACIÓN DE VARIABLES Y FUNCIONES ⚠️
  // Reemplazamos el uso de useContext por valores simulados para evitar errores.
  const carrito = []; // Simula un carrito vacío para que totalProductos sea 0
  const totalProductos = 0; // Se fija en 0 ya que 'carrito' está vacío.

  // Simulación de Autenticación
  const currentUser = null; // null: Muestra el botón de "Login"
  const isAdmin = false; // Simula un usuario que no es administrador
  const loading = false; // Simula que la carga de autenticación terminó

  // Funciones simuladas que no hacen nada
  const logout = () => { console.log("Logout simulado"); };
  const setShowLogin = () => { console.log("Mostrar Login simulado"); };
  const currentUsername = "UsuarioSimulado";

  // Funciones de Manejo del Offcanvas (Estas SÍ son necesarias)
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);

  // Las funciones de manejo de Login/Logout se mantienen, pero llaman a las simuladas
  const handleLogout = async () => {
    try {
      await logout(); // Llama a la función simulada
    } catch (error) {
      console.error("Error al cerrar sesión simulado:", error);
      Swal.fire({ icon: 'error', title: 'Error Simulado', text: 'Cierre de sesión fallido.' });
    } finally {
      handleCloseOffcanvas(); 
    }
  };

  const handleLoginClick = () => {
    setShowLogin(true); // Llama a la función simulada
    handleCloseOffcanvas(); 
  };

  // EL JSX SE MANTIENE EXACTAMENTE IGUAL
  return (
    <>
      <Navbar expand="lg" className="header-bootstrap" data-bs-theme="dark" style={{ backgroundColor: '#212529' }}> {/* Agregué estilos básicos para que se vea oscuro */}
        <Container fluid className="header-container-fluid">
          <Navbar.Brand as={NavLink} to="/" className="logo-container">
            {/* 💡 Si 'logo.png' no existe, puedes reemplazar esto por un texto temporal */}
            <span style={{fontSize: '1.5rem', fontWeight: 'bold'}}>🍔</span>
            <h1 className="nombre">Clínica Ramvet</h1>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="offcanvasNavbar" onClick={handleShowOffcanvas} />

          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="end"
            show={showOffcanvas}
            onHide={handleCloseOffcanvas}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel">Menú</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3 nav-custom">
                {/*... Tus NavLinks se mantienen ...*/}
                <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} onClick={handleCloseOffcanvas}>Inicio</NavLink>
                <NavLink to="/productos" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} onClick={handleCloseOffcanvas}>Productos</NavLink>
                <NavLink to="/reservas" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} onClick={handleCloseOffcanvas}>Reservas</NavLink>
                
                {/* El carrito ahora muestra 0 porque totalProductos es 0 */}
                <NavLink to="/carrito" className={({ isActive }) => `nav-link carrito-nav-link ${isActive ? 'active-link' : ''}`} onClick={handleCloseOffcanvas}>
                  <FaShoppingCart className="carrito-icono" />
                  <span className="carrito-text">Carrito</span>
                  {totalProductos > 0 && <span className="contador">{totalProductos}</span>}
                </NavLink>

                {/* Muestra 'Login' porque currentUser es null y loading es false */}
                {loading ? (
                  <span className="nav-link login-nav-link">Cargando...</span>
                ) : currentUser ? (
                  <>
                    {/*... Se oculta la sección de Admin ya que isAdmin es false ...*/}
                    <span onClick={handleLogout} className="nav-link login-nav-link" role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') handleLogout(); }}>
                      <LogOut size={20} style={{ marginRight: '5px' }} /> {currentUsername} (Salir)
                    </span>
                  </>
                ) : (
                  <span onClick={handleLoginClick} className="nav-link login-nav-link" role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') handleLoginClick(); }}>
                    <User size={20} style={{ marginRight: '5px' }} /> Login
                  </span>
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;