import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import AppointmentCalendar from '../components/appointments/AppointmentCalendar';
import MyAppointments from '../components/appointments/MyAppointments';
import Swal from 'sweetalert2';

const AppointmentsPage = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('new'); // 'new' o 'my-appointments'

    useEffect(() => {
        if (!user) {
            Swal.fire({
                icon: 'warning',
                title: 'Acceso Denegado',
                text: 'Debes iniciar sesión para reservar turnos',
                confirmButtonColor: '#3B82F6',
            }).then(() => {
                navigate('/login');
            });
        }
    }, [user, navigate]);

    if (!user) {
        return null;
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Sistema de Turnos</h1>
                <p className="text-gray-600">Gestiona tus turnos veterinarios de manera fácil y rápida</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('new')}
                    className={`px-6 py-3 font-semibold transition-all ${
                        activeTab === 'new'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Nuevo Turno
                </button>
                <button
                    onClick={() => setActiveTab('my-appointments')}
                    className={`px-6 py-3 font-semibold transition-all ${
                        activeTab === 'my-appointments'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Mis Turnos
                </button>
            </div>

            {/* Contenido según tab activo */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                {activeTab === 'new' ? (
                    <AppointmentCalendar />
                ) : (
                    <MyAppointments />
                )}
            </div>
        </div>
    );
};

export default AppointmentsPage;
