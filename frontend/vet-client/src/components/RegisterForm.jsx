/* ./components/RegisterForm.jsx */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const validateEmail = (email) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
  const validatePhone = (phone) => /^[0-9]{10,15}$/.test(phone);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'El nombre completo es requerido';
    if (!formData.email) newErrors.email = 'El correo electrónico es requerido';
    else if (!validateEmail(formData.email)) newErrors.email = 'Correo electrónico inválido';
    else if (formData.email.length > 50) newErrors.email = 'El correo es demasiado largo (máximo 50 caracteres)';
    if (!formData.password) newErrors.password = 'La contraseña es requerida';
    else if (formData.password.length < 6)
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    if (!formData.phone) newErrors.phone = 'El teléfono es requerido';
    else if (!validatePhone(formData.phone))
      newErrors.phone = 'Número de teléfono inválido (10-15 dígitos)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const { user, session } = await registerUser(formData);

      // Si el usuario necesita confirmar el email
      if (user && !session) {
        if (onClose) onClose();

        Swal.fire({
          icon: 'info',
          title: '📧 Confirma tu correo',
          html: `
            <div style="text-align: center; padding: 5px; max-width: 100%;">
              <p style="margin: 12px 0; font-size: 15px; color: #374151;">
                Te enviamos un enlace de confirmación a:
              </p>
              <p style="font-weight: 600; color: #2563eb; margin: 12px 0; font-size: 14px; word-break: break-all;">
                ${formData.email}
              </p>
              <p style="margin: 12px 0; font-size: 14px; color: #6b7280;">
                Haz clic en el enlace para activar tu cuenta.
              </p>
              <p style="font-size: 13px; color: #9ca3af; margin-top: 15px; padding: 10px; background: #f9fafb; border-radius: 6px;">
                💡 Revisa tu carpeta de spam si no lo encuentras
              </p>
            </div>
          `,
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#2563eb',
          allowOutsideClick: false,
          customClass: {
            popup: 'swal-compact',
            title: 'swal-title-small'
          },
          width: '90%',
          padding: '20px'
        }).then(() => {
          navigate('/login');
        });
      } else {
        // Si el email ya está confirmado o no se requiere confirmación
        setAuth(user, session);
        if (onClose) onClose();

        Swal.fire({
          icon: 'success',
          title: '¡Cuenta creada!',
          text: 'Tu registro fue exitoso',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          navigate('/');
        });
      }

    } catch (error) {
      console.error('Registration failed:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error de registro',
        text: error.message || 'No se pudo crear la cuenta. Por favor, intenta nuevamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-box register" style={{ "--i": 0, transform: 'translateY(50px)' }}>
      <h2 className="animation" style={{ "--i": 0 }}>Regístrate</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-box animation" style={{ "--i": 1 }}>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          <label>Nombre completo</label>
          <i className="bx bxs-user"></i>
          {errors.name && <span style={{ color: '#ff4444', fontSize: '12px' }}>{errors.name}</span>}
        </div>

        <div className="input-box animation" style={{ "--i": 2 }}>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          <label>Correo electrónico</label>
          <i className="bx bxs-envelope"></i>
          {errors.email && <span style={{ color: '#ff4444', fontSize: '12px' }}>{errors.email}</span>}
        </div>

        <div className="input-box animation" style={{ "--i": 3 }}>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          <label>Contraseña</label>
          <i className="bx bxs-lock"></i>
          {errors.password && <span style={{ color: '#ff4444', fontSize: '12px' }}>{errors.password}</span>}
        </div>

        <div className="input-box animation" style={{ "--i": 4 }}>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
          <label>Teléfono</label>
          <i className="bx bxs-phone"></i>
          {errors.phone && <span style={{ color: '#ff4444', fontSize: '12px' }}>{errors.phone}</span>}
        </div>

        <div className="input-box animation" style={{ "--i": 5 }}>
          <input type="text" name="address" value={formData.address} onChange={handleChange} />
          <label>Dirección (opcional)</label>
          <i className="bx bxs-map"></i>
        </div>

        <button type="submit" className="btn animation" style={{ "--i": 6 }} disabled={isSubmitting}>
          {isSubmitting ? 'Registrando...' : 'Registrarse'}
        </button>

        {onToggleLogin && (
          <div className="logreg-link animation" style={{ "--i": 7 }}>
            <p>
              ¿Ya tienes una cuenta?{' '}
              <a
                href="#"
                className="login-link"
                onClick={(e) => {
                  e.preventDefault();
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
