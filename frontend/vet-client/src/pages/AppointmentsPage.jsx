import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import AppointmentCalendar from '../components/appointments/AppointmentCalendar';
import MyAppointments from '../components/appointments/MyAppointments';
import AllAppointments from '../components/appointments/AllAppointments';
import Swal from 'sweetalert2';

const AppointmentsPage = () => {
    const { user, isAdmin } = useAuthStore();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('new'); // 'new', 'my-appointments' o 'all-appointments'
    const [refreshKey, setRefreshKey] = useState(0);

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

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'my-appointments') {
            // Incrementar el key para forzar recarga del componente
            setRefreshKey(prev => prev + 1);
        }
    };

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
                    onClick={() => handleTabChange('new')}
                    className={`px-6 py-3 font-semibold transition-all duration-300 relative ${
                        activeTab === 'new'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700 hover:scale-105'
                    }`}
                    style={{
                        transform: activeTab === 'new' ? 'translateY(-2px)' : 'none'
                    }}
                >
                    Nuevo Turno
                </button>
                <button
                    onClick={() => handleTabChange('my-appointments')}
                    className={`px-6 py-3 font-semibold transition-all duration-300 relative ${
                        activeTab === 'my-appointments'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700 hover:scale-105'
                    }`}
                    style={{
                        transform: activeTab === 'my-appointments' ? 'translateY(-2px)' : 'none'
                    }}
                >
                    Mis Turnos
                </button>
                {isAdmin && (
                    <button
                        onClick={() => handleTabChange('all-appointments')}
                        className={`px-6 py-3 font-semibold transition-all duration-300 relative ${
                            activeTab === 'all-appointments'
                                ? 'text-red-600 border-b-2 border-red-600'
                                : 'text-gray-500 hover:text-gray-700 hover:scale-105'
                        }`}
                        style={{
                            transform: activeTab === 'all-appointments' ? 'translateY(-2px)' : 'none'
                        }}
                    >
                        📋 Todos los Turnos (Admin)
                    </button>
                )}
            </div>

            {/* Contenido según tab activo */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                {activeTab === 'new' ? (
                    <AppointmentCalendar key="new" />
                ) : activeTab === 'my-appointments' ? (
                    <MyAppointments key={`my-appointments-${refreshKey}`} onNavigateToNew={() => setActiveTab('new')} />
                ) : (
                    <AllAppointments key={`all-appointments-${refreshKey}`} />
                )}
            </div>
        </div>
    );
};

export default AppointmentsPage;
