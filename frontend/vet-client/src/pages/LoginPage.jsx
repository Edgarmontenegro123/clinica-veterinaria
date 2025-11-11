/*./scr/pages/LoginPage.jsx*/
import { useEffect, useState } from "react";
import LoginForm from "../components/LoginForm.jsx";
import RegisterForm from "../components/RegisterForm.jsx";
import { useAuthStore } from "../store/authStore.js";
import { useNavigate } from "react-router-dom";
import '../components/css/login.css';

const LoginPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true })
    }
  }, [user, navigate]);

  const handleToggleRegister = () => {
    setIsActive(true);
  };

  const handleToggleLogin = () => {
    setIsActive(false);
  };
  
  return (
    <div className="login-page-container">
      <div className={`wrapper ${isActive ? 'active' : ''}`}>
        <LoginForm onToggleRegister={handleToggleRegister} />
        <RegisterForm onToggleLogin={handleToggleLogin} />
        
        {/* Texto informativo para login */}
        <div className="info-text login">
          <h2 className="animation" style={{"--i": 0}}>BIENVENIDO</h2>
          <p className="animation" style={{"--i": 1, transform: 'translateY(20px)'}}>
            Para acceder ingresa un nombre de usuario, tu correo electrónico y una contraseña.
          </p>
        </div>

        {/* Texto informativo para registro */}
        <div className="info-text register" style={{transform: 'translateY(-80px)'}} >
          <h2 className="animation" style={{"--i": 0}}>¡ÚNETE A NOSOTROS!</h2>
          <p className="animation" style={{"--i": 1, transform: 'translateY(20px)'}}>
            Crea tu cuenta para acceder a todos nuestros servicios veterinarios.
          </p>
        </div>
        
        <div className="bg-animate"></div>
        <div className="bg-animate2"></div>
      </div>
    </div>
  );
};

export default LoginPage;