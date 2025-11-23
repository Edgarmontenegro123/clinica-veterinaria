import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const EmailConfirmedPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Swal.fire({
      icon: 'success',
      title: '✅ ¡Cuenta activada!',
      html: `
        <div style="text-align: center; padding: 5px; max-width: 100%;">
          <p style="margin: 12px 0; font-size: 15px; color: #374151;">
            Tu cuenta ha sido activada exitosamente.
          </p>
          <p style="margin: 12px 0; font-size: 14px; color: #6b7280;">
            Ya puedes acceder a todos nuestros servicios:
          </p>
          <div style="margin: 15px 0; padding: 12px; background: #f0f9ff; border-radius: 8px; text-align: left;">
            <p style="margin: 6px 0; font-size: 13px; color: #1e40af;">🐕 Registrar tus mascotas</p>
            <p style="margin: 6px 0; font-size: 13px; color: #1e40af;">📅 Agendar turnos</p>
            <p style="margin: 6px 0; font-size: 13px; color: #1e40af;">🏥 Ver historial médico</p>
            <p style="margin: 6px 0; font-size: 13px; color: #1e40af;">🐾 Explorar adopciones</p>
          </div>
          <p style="margin-top: 15px; color: #2563eb; font-weight: 600; font-size: 15px;">
            ¡Bienvenido a la familia Ramvet! 🐾
          </p>
        </div>
      `,
      confirmButtonText: 'Iniciar sesión',
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
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="text-center bg-white p-8 rounded-xl shadow-lg">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
        <p className="mt-6 text-gray-700 text-lg font-semibold">Verificando tu email...</p>
        <p className="mt-2 text-gray-500 text-sm">Por favor espera un momento</p>
      </div>
    </div>
  );
};

export default EmailConfirmedPage;
