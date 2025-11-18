import { useState, useEffect } from 'react';
import { getAllAppointments, cancelAppointment } from '../../services/appointments.service';
import Swal from 'sweetalert2';

const AllAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'past'

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            setLoading(true);
            const data = await getAllAppointments();
            setAppointments(data);
        } catch (error) {
            console.error('Error loading appointments:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'No se pudieron cargar los turnos',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (appointmentId) => {
        const result = await Swal.fire({
            title: '¿Cancelar turno?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No',
        });

        if (result.isConfirmed) {
            try {
                Swal.fire({
                    title: 'Cancelando turno...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                await cancelAppointment(appointmentId);
                setAppointments(prevAppointments =>
                    prevAppointments.filter(apt => apt.id !== appointmentId)
                );

                Swal.fire({
                    icon: 'success',
                    title: 'Turno cancelado',
                    text: 'El turno ha sido cancelado exitosamente',
                    timer: 2000,
                });

            } catch (error) {
                console.error('Error canceling appointment:', error);
                await loadAppointments();
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message || 'No se pudo cancelar el turno',
                });
            }
        }
    };

    const formatDateTime = (datetime) => {
        const date = new Date(datetime);
        return {
            date: date.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            time: date.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
    };

    const filteredAppointments = appointments.filter(apt => {
        const now = new Date();
        const aptDate = new Date(apt.datetime);

        if (filter === 'upcoming') return aptDate >= now;
        if (filter === 'past') return aptDate < now;
        return true;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Todos los Turnos - Panel de Administración
                </h2>
                <button
                    onClick={loadAppointments}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    🔄 Recargar
                </button>
            </div>

            {/* Filtros */}
            <div className="flex gap-3 mb-6">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        filter === 'all'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Todos ({appointments.length})
                </button>
                <button
                    onClick={() => setFilter('upcoming')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        filter === 'upcoming'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Próximos
                </button>
                <button
                    onClick={() => setFilter('past')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        filter === 'past'
                            ? 'bg-gray-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Pasados
                </button>
            </div>

            {filteredAppointments.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📅</div>
                    <p className="text-gray-500 text-lg">No hay turnos registrados</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredAppointments.map((appointment) => {
                        const { date, time } = formatDateTime(appointment.datetime);
                        const isPast = new Date(appointment.datetime) < new Date();

                        return (
                            <div
                                key={appointment.id}
                                className={`border rounded-lg p-6 transition-all hover:shadow-lg ${
                                    isPast ? 'bg-gray-50 opacity-75' : 'bg-white'
                                }`}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {/* Columna 1: Fecha y Hora */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">📅</span>
                                            <div>
                                                <p className="font-semibold text-gray-700">Fecha</p>
                                                <p className="text-sm text-gray-600 capitalize">{date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-2xl">🕐</span>
                                            <div>
                                                <p className="font-semibold text-gray-700">Hora</p>
                                                <p className="text-sm text-gray-600">{time}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Columna 2: Mascota */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">🐾</span>
                                            <div>
                                                <p className="font-semibold text-gray-700">Mascota</p>
                                                <p className="text-sm text-gray-600">{appointment.pet?.name || 'N/A'}</p>
                                                <p className="text-xs text-gray-500">
                                                    {appointment.pet?.species} - {appointment.pet?.breed}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Columna 3: Dueño */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">👤</span>
                                            <div>
                                                <p className="font-semibold text-gray-700">Dueño</p>
                                                <p className="text-sm text-gray-600">{appointment.users?.name || 'N/A'}</p>
                                                <p className="text-xs text-gray-500">{appointment.users?.email || 'N/A'}</p>
                                                <p className="text-xs text-gray-500">📞 {appointment.users?.phone || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Columna 4: Motivo y Acciones */}
                                    <div className="space-y-3">
                                        {appointment.reason && (
                                            <div>
                                                <p className="font-semibold text-gray-700 mb-1">Motivo:</p>
                                                <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                                                    {appointment.reason}
                                                </p>
                                            </div>
                                        )}

                                        {!isPast && (
                                            <button
                                                onClick={() => handleCancel(appointment.id)}
                                                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                                            >
                                                Cancelar Turno
                                            </button>
                                        )}

                                        {isPast && (
                                            <div className="text-center">
                                                <span className="inline-block px-3 py-1 bg-gray-300 text-gray-700 rounded-full text-sm font-medium">
                                                    ✓ Completado
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AllAppointments;
