/* ./components/LoginForm.jsx */
import { useState } from 'react';
import Swal from 'sweetalert2';
import { useAuthStore } from '../store/authStore.js';
import { login } from '../services/auth.service.js';

export default function LoginForm({ onToggleRegister, onClose }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setAuth = useAuthStore((state) => state.setAuth);

  const validateEmail = (email) => {
    const re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // login() ahora devuelve { user, session }
      const { user, session } = await login(formData);
      if (!user) throw new Error('No se encontró el usuario');

      // Guardamos la sesión en Zustand
      setAuth({ user, session });

      console.log('Usuario autenticado:', user.email);

      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: `Has iniciado sesión como ${user.email}`,
        timer: 2000,
        showConfirmButton: false
      });

      if (onClose) onClose();

    } catch (error) {
      console.error('Login failed:', error);

      Swal.fire({
        icon: 'error',
        title: 'Error de inicio de sesión',
        text: error.message || 'Credenciales incorrectas. Por favor, intenta nuevamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-box login">
      <h2
        className="animation"
        style={{
          "--i": 0,
          fontSize: "26px",
          transform: "translateX(-40px)"
        }}
      >
        Inicio de Sesión
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="input-box animation" style={{ "--i": 1 }}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label>Correo electrónico</label>
          <i className="bx bxs-envelope"></i>
          {errors.email && (
            <span
              style={{
                color: "#ff4444",
                fontSize: "12px",
                position: "absolute",
                bottom: "-18px",
                left: "0"
              }}
            >
              {errors.email}
            </span>
          )}
        </div>

        <div className="input-box animation" style={{ "--i": 2 }}>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <label>Contraseña</label>
          <i className="bx bxs-lock"></i>
          {errors.password && (
            <span
              style={{
                color: "#ff4444",
                fontSize: "12px",
                position: "absolute",
                bottom: "-18px",
                left: "0"
              }}
            >
              {errors.password}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="btn animation"
          style={{ "--i": 3 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
        </button>

        {onToggleRegister && (
          <div
            className="logreg-link animation"
            style={{ "--i": 4, position: "relative", zIndex: 10 }}
          >
            <p>
              ¿No tienes una cuenta?{" "}
              <a
                href="#"
                className="register-link"
                style={{
                  cursor: "pointer",
                  position: "relative",
                  zIndex: 100
                }}
                onClick={(e) => {
                  e.preventDefault();
                  onToggleRegister();
                }}
              >
                Regístrate
              </a>
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
