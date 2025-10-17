/*./components/RegisterForm.jsx*/
import { useState } from 'react';
import Swal from 'sweetalert2';
import { useAuthStore } from '../store/authStore.js';
import { registerUser } from '../services/auth.service.js';

export default function RegisterForm({ onToggleLogin, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const setAuth = useAuthStore((state) => state.setAuth);

  const validateEmail = (email) => {
    const re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^[0-9]{10,15}$/;
    return re.test(phone);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'El nombre completo es requerido';
    }

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

    if (!formData.phone) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Número de teléfono inválido (10-15 dígitos)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { token, email, id, roles } = await registerUser(formData);
      setAuth(token, email, id, roles);
      
      console.log('User created and logged in');

      if (onClose) {
        onClose();
      }

      Swal.fire({
        icon: 'success',
        title: '¡Cuenta creada!',
        text: 'Tu registro fue exitoso',
        timer: 2000,
        showConfirmButton: false
      });

    } catch (error) {
      console.error('Registration failed:', error);
      
      Swal.fire({
        icon: 'error',
        title: 'Error de registro',
        text: error.response?.data?.message || 'No se pudo crear la cuenta. Por favor, intenta nuevamente.',
      });
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-box register ">
      <h2 className="animation" style={{"--i": 0, transform: 'translateX(60px)'}}>Regístrate</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-box animation" style={{"--i": 1}}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label>Nombre completo</label>
          <i className="bx bxs-user"></i>
          {errors.name && (
            <span style={{color: '#ff4444', fontSize: '12px', position: 'absolute', bottom: '-18px', left: '0'}}>
              {errors.name}
            </span>
          )}
        </div>

        <div className="input-box animation" style={{"--i": 2}}>
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
            <span style={{color: '#ff4444', fontSize: '12px', position: 'absolute', bottom: '-18px', left: '0'}}>
              {errors.email}
            </span>
          )}
        </div>

        <div className="input-box animation" style={{"--i": 3}}>
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
            <span style={{color: '#ff4444', fontSize: '12px', position: 'absolute', bottom: '-18px', left: '0'}}>
              {errors.password}
            </span>
          )}
        </div>

        <div className="input-box animation" style={{"--i": 4}}>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <label>Teléfono</label>
          <i className="bx bxs-phone"></i>
          {errors.phone && (
            <span style={{color: '#ff4444', fontSize: '12px', position: 'absolute', bottom: '-18px', left: '0'}}>
              {errors.phone}
            </span>
          )}
        </div>

        <div className="input-box animation" style={{"--i": 5}}>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          <label>Dirección (opcional)</label>
          <i className="bx bxs-map"></i>
        </div>

        <button type="submit" className="btn animation" style={{"--i": 6}} disabled={isSubmitting}>
          {isSubmitting ? 'Registrando...' : 'Registrarse'}
        </button>

        {onToggleLogin && (
          <div className="logreg-link animation" style={{"--i": 7, position: 'relative', zIndex: 10}}>
            <p>
              ¿Ya tienes una cuenta?{' '}
              <a 
                href="#" 
                className="login-link" 
                style={{cursor: 'pointer', position: 'relative', zIndex: 101}}
                onClick={(e) => { 
                  e.preventDefault(); 
                  console.log('Click en Inicia sesión');
                  onToggleLogin(); 
                }}
              >
                Inicia sesión
              </a>
            </p>
          </div>
        )}
      </form>
    </div>
  );
}