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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    if (!formData.email.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'El email es requerido',
      });
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Email inválido',
        text: 'Por favor ingresa un email válido',
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

      // Aquí irá la integración con Formspree
      const formspreeUrl = 'https://formspree.io/f/meowgrvo'; // Reemplazar con el URL de Formspree

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
      } else {
        throw new Error('Error al enviar el formulario');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
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
    <div className="relative w-full min-h-screen flex items-center justify-center px-4 py-8 overflow-hidden">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400 text-white bg-gray-800/50"
                required
              />
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400 text-white bg-gray-800/50"
                  required
                />
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
                  placeholder="Ej: ejemplo@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400 text-white bg-gray-800/50"
                  required
                />
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400 text-white bg-gray-800/50"
              />
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
                disabled={isSubmitting}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold shadow-md transition-all duration-200 ${
                  isSubmitting
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
