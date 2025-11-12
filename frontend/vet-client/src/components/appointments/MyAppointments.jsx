import { useState, useEffect } from 'react';
import { getUserAppointments, cancelAppointment } from '../../services/appointments.service';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../services/supabase';
import Swal from 'sweetalert2';

const MyAppointments = () => {
    const { user } = useAuthStore();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            setLoading(true);
            // Obtener turnos del usuario a través de sus mascotas
            const { data: userAppointments, error } = await supabase
                .from('appoinment')
                .select(`
                    *,
                    pet:pet_id (
                        id,
                        name,
                        species,
                        breed,
                        user_id
                    )
                `)
                .order('datetime', { ascending: true });

            if (error) throw error;

            // Filtrar solo los turnos de mascotas del usuario actual
            const filteredAppointments = userAppointments.filter(
                apt => apt.pet && apt.pet.user_id === user.id
            );

            setAppointments(filteredAppointments);
        } catch (error) {
            console.error('Error loading appointments:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar tus turnos',
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
                // Mostrar loading
                Swal.fire({
                    title: 'Cancelando turno...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                // Cancelar el turno
                await cancelAppointment(appointmentId);

                // Actualizar el estado local inmediatamente (optimistic update)
                setAppointments(prevAppointments =>
                    prevAppointments.filter(apt => apt.id !== appointmentId)
                );

                // Mostrar mensaje de éxito
                Swal.fire({
                    icon: 'success',
                    title: 'Turno cancelado',
                    text: 'El turno ha sido cancelado exitosamente',
                    timer: 2000,
                });

            } catch (error) {
                console.error('Error canceling appointment:', error);
                // Si hay error, recargar para asegurar consistencia
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
            date: date.toLocaleDateString('es-AR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            time: date.toLocaleTimeString('es-AR', {
                hour: '2-digit',
                minute: '2-digit'
            }),
        };
    };

    const isUpcoming = (datetime) => {
        return new Date(datetime) > new Date();
    };

    // Separar turnos próximos y pasados
    const upcomingAppointments = appointments.filter(apt => isUpcoming(apt.datetime));
    const pastAppointments = appointments.filter(apt => !isUpcoming(apt.datetime));

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Cargando tus turnos...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Turnos próximos */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Próximos Turnos</h2>

                {upcomingAppointments.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 text-lg">No tienes turnos próximos</p>
                        <p className="text-gray-500 mt-2">Reserva un turno desde la pestaña "Nuevo Turno"</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {upcomingAppointments.map(appointment => {
                            const { date, time } = formatDateTime(appointment.datetime);
                            return (
                                <div
                                    key={appointment.id}
                                    className="bg-white border-2 border-blue-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                                                    Próximo
                                                </span>
                                                <span className="text-gray-600 font-semibold">
                                                    {time}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-bold text-gray-800 mb-2 capitalize">
                                                {date}
                                            </h3>

                                            {appointment.pet && (
                                                <div className="mb-3">
                                                    <p className="text-gray-700">
                                                        <span className="font-semibold">Mascota:</span> {appointment.pet.name}
                                                    </p>
                                                    <p className="text-gray-600 text-sm">
                                                        {appointment.pet.species} - {appointment.pet.breed}
                                                    </p>
                                                </div>
                                            )}

                                            {appointment.reason && (
                                                <div className="mt-3 p-3 bg-gray-50 rounded">
                                                    <p className="text-gray-700">
                                                        <span className="font-semibold">Motivo:</span> {appointment.reason}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => handleCancel(appointment.id)}
                                            className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Turnos pasados */}
            {pastAppointments.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Historial de Turnos</h2>

                    <div className="grid gap-4">
                        {pastAppointments.map(appointment => {
                            const { date, time } = formatDateTime(appointment.datetime);
                            return (
                                <div
                                    key={appointment.id}
                                    className="bg-gray-50 border border-gray-200 rounded-lg p-6 opacity-75"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="bg-gray-300 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
                                            Completado
                                        </span>
                                        <span className="text-gray-600 font-semibold">
                                            {time}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-700 mb-2 capitalize">
                                        {date}
                                    </h3>

                                    {appointment.pet && (
                                        <div className="mb-3">
                                            <p className="text-gray-700">
                                                <span className="font-semibold">Mascota:</span> {appointment.pet.name}
                                            </p>
                                            <p className="text-gray-600 text-sm">
                                                {appointment.pet.species} - {appointment.pet.breed}
                                            </p>
                                        </div>
                                    )}

                                    {appointment.reason && (
                                        <div className="mt-3 p-3 bg-white rounded">
                                            <p className="text-gray-700 text-sm">
                                                <span className="font-semibold">Motivo:</span> {appointment.reason}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyAppointments;
