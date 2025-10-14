import  { useEffect } from "react";
import LoginForm from "../components/LoginForm.jsx";
import { useAuthStore } from "../store/authStore.js";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { userEmail } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (userEmail) {
      navigate('/', { replace: true }) 
    }
  }, [userEmail, navigate]);

  return (
    <div className="flex justify-center">
        <div>
          <h2>Iniciar Sesión</h2>
          <LoginForm />
        </div>
    </div>
  );
};

export default LoginPage;
