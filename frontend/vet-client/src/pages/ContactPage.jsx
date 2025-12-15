import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ContactPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    message: ''
  });
  const [errors, setErrors] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lista extensa de dominios de email permitidos
  const validEmailDomains = [
    // Dominios internacionales
    'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com',
    'live.com', 'msn.com', 'aol.com', 'protonmail.com', 'zoho.com',
    'mail.com', 'gmx.com', 'yandex.com', 'inbox.com', 'fastmail.com',
    // Dominios argentinos
    'gmail.com.ar', 'hotmail.com.ar', 'outlook.com.ar', 'yahoo.com.ar',
    'live.com.ar', 'arnet.com.ar', 'fibertel.com.ar', 'speedy.com.ar',
    'ciudad.com.ar', 'infovia.com.ar', 'argentina.com', 'telecentro.com.ar',
    // Dominios corporativos comunes
    'uba.ar', 'utn.edu.ar', 'edu.ar', 'gov.ar', 'gob.ar',
    // Otros dominios populares
    'me.com', 'mac.com', 'hey.com', 'pm.me', 'tutanota.com'
  ];

  // Validación en tiempo real para nombre completo
  const validateFullName = (value) => {
    // Solo permite letras, espacios, acentos y ñ
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    if (!nameRegex.test(value)) {
      return 'El nombre solo puede contener letras y espacios';
    }
    return '';
  };

  // Validación en tiempo real para teléfono
  const validatePhone = (value) => {
    // Solo permite números
    const phoneRegex = /^\d*$/;
    if (!phoneRegex.test(value)) {
      return 'El teléfono solo puede contener números';
    }
    // En Argentina, los celulares tienen 10 dígitos (código de área + número)
    if (value.length > 10) {
      return 'El teléfono no puede tener más de 10 dígitos';
    }
    return '';
  };

  // Validación en tiempo real para email
  const validateEmail = (value) => {
    if (!value) return '';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Formato de email inválido';
    }

    // Extraer el dominio del email
    const domain = value.split('@')[1];
    if (domain && !validEmailDomains.includes(domain.toLowerCase())) {
      return 'Dominio de email no reconocido. Use un proveedor de email válido';
    }

    return '';
  };

  // Validación en tiempo real para dirección
  const validateAddress = (value) => {
    // Permite letras, números, espacios, comas, puntos y guiones
    const addressRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s,.\-]*$/;
    if (!addressRegex.test(value)) {
      return 'La dirección no puede contener caracteres especiales';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let error = '';
    let newValue = value;

    // Validar según el campo
    switch (name) {
      case 'fullName':
        error = validateFullName(value);
        // No actualizar si hay error (previene escribir caracteres no válidos)
        if (error && value !== '') {
          return;
        }
        break;

      case 'phone':
        error = validatePhone(value);
        // No actualizar si hay error
        if (error && value !== '') {
          return;
        }
        break;

      case 'email':
        error = validateEmail(value);
        break;

      case 'address':
        error = validateAddress(value);
        // No actualizar si hay error
        if (error && value !== '') {
          return;
        }
        break;

      default:
        break;
    }

    // Actualizar el estado del formulario
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Actualizar errores
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar todos los campos antes de enviar
    const fullNameError = validateFullName(formData.fullName);
    const phoneError = validatePhone(formData.phone);
    const emailError = validateEmail(formData.email);
    const addressError = formData.address ? validateAddress(formData.address) : '';

    // Si hay algún error, mostrar mensaje
    if (fullNameError || phoneError || emailError || addressError) {
      Swal.fire({
        icon: 'error',
        title: 'Errores en el formulario',
        text: 'Por favor corrige los errores antes de enviar',
        confirmButtonColor: '#d33',
      });
      return;
    }

    // Validaciones básicas
    if (!formData.fullName.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'El nombre completo es requerido',
      });
      return;
    }

    if (!formData.phone.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'El teléfono es requerido',
      });
      return;
    }

    // Validar longitud mínima del teléfono
    if (formData.phone.length < 8) {
      Swal.fire({
        icon: 'error',
        title: 'Teléfono inválido',
        text: 'El teléfono debe tener al menos 8 dígitos',
        confirmButtonColor: '#d33',
      });
      return;
    }

    if (!formData.email.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'El email es requerido',
      });
      return;
    }

    if (!formData.message.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'La consulta es requerida',
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const formspreeUrl = 'https://formspree.io/f/meowgrvo';

      const response = await fetch(formspreeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.fullName,
          telefono: formData.phone,
          email: formData.email,
          direccion: formData.address,
          consulta: formData.message
        }),
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: '¡Consulta enviada!',
          text: 'Tu consulta ha sido enviada exitosamente. Nos pondremos en contacto contigo pronto.',
          confirmButtonColor: '#3B82F6',
        }).then(() => {
          navigate('/');
        });

        // Limpiar formulario
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          address: '',
          message: ''
        });
        setErrors({
          fullName: '',
          phone: '',
          email: '',
          address: ''
        });
      } else {
        throw new Error('Error al enviar el formulario');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo enviar la consulta. Por favor intenta nuevamente.',
        confirmButtonColor: '#d33',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page-container relative w-full min-h-screen flex items-center justify-center px-4 pb-8 overflow-hidden">
      {/* Imagen de fondo */}
      <img
        src="/fondo3.jpg"
        alt="Fondo mascotas"
        className="fixed top-0 left-0 w-full h-full object-cover grayscale z-[-1]"
      />

      {/* Overlay oscuro */}
      <div className="fixed top-0 left-0 w-full h-full bg-black/40 z-[-1]"></div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3" style={{ textShadow: "3px 3px 6px rgba(0,0,0,0.8)" }}>
            Contacto
          </h1>
          <p className="text-white text-lg font-semibold" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}>
            ¿Tienes alguna consulta? Escríbenos y te responderemos a la brevedad
          </p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="border-2 border-white/30 rounded-2xl shadow-2xl p-6 md:p-8"
          style={{
            background: "rgba(0, 0, 0, 0.45)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)"
          }}
        >
          <div className="space-y-5">
            {/* Nombre completo */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Nombre completo *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Ej: Juan Pérez"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all placeholder:text-gray-400 text-white bg-gray-800/50 ${
                  errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                required
              />
              {errors.fullName && (
                <p className="text-red-400 text-sm mt-1 font-medium">⚠ {errors.fullName}</p>
              )}
            </div>

            {/* Teléfono y Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-semibold mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Ej: 1123456789"
                  maxLength="10"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all placeholder:text-gray-400 text-white bg-gray-800/50 ${
                    errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  required
                />
                {errors.phone && (
                  <p className="text-red-400 text-sm mt-1 font-medium">⚠ {errors.phone}</p>
                )}
                <p className="text-gray-300 text-xs mt-1">{formData.phone.length}/10 dígitos</p>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ej: ejemplo@gmail.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all placeholder:text-gray-400 text-white bg-gray-800/50 ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  required
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1 font-medium">⚠ {errors.email}</p>
                )}
              </div>
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Dirección <span className="text-gray-300 font-normal text-sm">(opcional)</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Ej: Av. Principal 123, CABA"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all placeholder:text-gray-400 text-white bg-gray-800/50 ${
                  errors.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.address && (
                <p className="text-red-400 text-sm mt-1 font-medium">⚠ {errors.address}</p>
              )}
            </div>

            {/* Consulta */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Consulta *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                placeholder="Escribe tu consulta aquí..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all placeholder:text-gray-400 text-white bg-gray-800/50"
                required
              />
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold shadow-md hover:bg-gray-600 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || errors.fullName || errors.phone || errors.email || errors.address}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold shadow-md transition-all duration-200 ${
                  isSubmitting || errors.fullName || errors.phone || errors.email || errors.address
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl hover:scale-105 active:scale-95'
                }`}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar'}
              </button>
            </div>

            <p className="text-sm text-gray-300 text-center mt-4">
              * Campos requeridos
            </p>
          </div>
        </form>

        {/* Información adicional */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Información de contacto
            </h3>
            <div className="space-y-2 text-gray-600">
              <p>📞 <span className="font-semibold">Teléfono:</span> (011) 1234-5678</p>
              <p>📧 <span className="font-semibold">Email:</span> info@ramvet.com</p>
              <p>📍 <span className="font-semibold">Dirección:</span> Av. Cabildo 4082, CABA</p>
              <p>⏰ <span className="font-semibold">Horarios:</span> Lun-Vie 10:00-20:00, Sáb 10:00-12:30</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
