import { useState, useEffect } from 'react';
import { getAvailableTimeSlots, createAppointment, getUserPets } from '../../services/appointments.service';
import { useAuthStore } from '../../store/authStore';
import Swal from 'sweetalert2';

const AppointmentCalendar = () => {
    const { user } = useAuthStore();
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [userPets, setUserPets] = useState([]);
    const [selectedPet, setSelectedPet] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Cargar mascotas del usuario
    useEffect(() => {
        if (user) {
            loadUserPets();
        }
    }, [user]);

    // Cargar horarios disponibles cuando se selecciona una fecha
    useEffect(() => {
        if (selectedDate) {
            loadAvailableSlots();
        }
    }, [selectedDate]);

    const loadUserPets = async () => {
        try {
            const pets = await getUserPets(user.id);
            setUserPets(pets);
        } catch (error) {
            console.error('Error loading pets:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar tus mascotas',
            });
        }
    };

    const loadAvailableSlots = async () => {
        try {
            setLoading(true);
            const slots = await getAvailableTimeSlots(selectedDate);
            setAvailableSlots(slots);
        } catch (error) {
            console.error('Error loading slots:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar los horarios disponibles',
            });
        } finally {
            setLoading(false);
        }
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek, year, month };
    };

    const handleDateClick = (day) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // No permitir seleccionar fechas pasadas
        if (date < today) {
            Swal.fire({
                icon: 'warning',
                title: 'Fecha no válida',
                text: 'No puedes seleccionar fechas pasadas',
            });
            return;
        }

        setSelectedDate(date);
        setSelectedTime(null);
    };

    const handleTimeClick = (time) => {
        setSelectedTime(time);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedPet) {
            Swal.fire({
                icon: 'warning',
                title: 'Mascota requerida',
                text: 'Debes seleccionar una mascota',
            });
            return;
        }

        if (!selectedDate || !selectedTime) {
            Swal.fire({
                icon: 'warning',
                title: 'Fecha y hora requeridas',
                text: 'Debes seleccionar una fecha y hora',
            });
            return;
        }

        if (!reason.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Motivo requerido',
                text: 'Debes especificar el motivo de la consulta',
            });
            return;
        }

        try {
            setLoading(true);

            // Combinar fecha y hora
            const [hours, minutes] = selectedTime.split(':');
            const appointmentDateTime = new Date(selectedDate);
            appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

            const appointmentData = {
                pet_id: parseInt(selectedPet),
                datetime: appointmentDateTime.toISOString(),
                reason: reason.trim(),
            };

            await createAppointment(appointmentData);

            Swal.fire({
                icon: 'success',
                title: '¡Turno reservado!',
                text: 'Tu turno ha sido reservado exitosamente',
                confirmButtonColor: '#3B82F6',
            });

            // Limpiar formulario
            setSelectedPet('');
            setReason('');
            setSelectedTime(null);
            setSelectedDate(null);
            setAvailableSlots([]);

        } catch (error) {
            console.error('Error creating appointment:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo reservar el turno. Intenta nuevamente.',
            });
        } finally {
            setLoading(false);
        }
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
        setSelectedDate(null);
        setSelectedTime(null);
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
        setSelectedDate(null);
        setSelectedTime(null);
    };

    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calendario */}
            <div>
                <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Selecciona una fecha</h2>

                    {/* Navegación del mes */}
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={prevMonth}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                            ← Anterior
                        </button>
                        <h3 className="text-xl font-semibold">
                            {monthNames[month]} {year}
                        </h3>
                        <button
                            onClick={nextMonth}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                            Siguiente →
                        </button>
                    </div>

                    {/* Días de la semana */}
                    <div className="grid grid-cols-7 gap-2 mb-2">
                        {dayNames.map(day => (
                            <div key={day} className="text-center font-semibold text-gray-600 text-sm">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Días del mes */}
                    <div className="grid grid-cols-7 gap-2">
                        {/* Espacios vacíos antes del primer día */}
                        {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                            <div key={`empty-${index}`} />
                        ))}

                        {/* Días del mes */}
                        {Array.from({ length: daysInMonth }).map((_, index) => {
                            const day = index + 1;
                            const date = new Date(year, month, day);
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const isPast = date < today;
                            const isSelected = selectedDate &&
                                selectedDate.getDate() === day &&
                                selectedDate.getMonth() === month &&
                                selectedDate.getFullYear() === year;

                            return (
                                <button
                                    key={day}
                                    onClick={() => handleDateClick(day)}
                                    disabled={isPast}
                                    className={`
                                        aspect-square rounded-lg font-semibold transition-all
                                        ${isPast
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : isSelected
                                                ? 'bg-blue-600 text-white shadow-lg scale-105'
                                                : 'bg-gray-50 text-gray-700 hover:bg-blue-100 hover:scale-105'
                                        }
                                    `}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Horarios disponibles */}
                {selectedDate && (
                    <div className="mt-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">
                            Horarios disponibles para {selectedDate.toLocaleDateString('es-AR')}
                        </h3>

                        {loading ? (
                            <div className="text-center py-8">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <p className="mt-2 text-gray-600">Cargando horarios...</p>
                            </div>
                        ) : availableSlots.length > 0 ? (
                            <div className="grid grid-cols-3 gap-3">
                                {availableSlots.map(slot => (
                                    <button
                                        key={slot}
                                        onClick={() => handleTimeClick(slot)}
                                        className={`
                                            py-3 px-4 rounded-lg font-semibold transition-all
                                            ${selectedTime === slot
                                                ? 'bg-green-600 text-white shadow-lg scale-105'
                                                : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:scale-105'
                                            }
                                        `}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-yellow-50 rounded-lg">
                                <p className="text-yellow-600 font-semibold">No hay horarios disponibles para esta fecha</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Formulario de reserva */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Datos del turno</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Selección de mascota */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Mascota *
                        </label>
                        <select
                            value={selectedPet}
                            onChange={(e) => setSelectedPet(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="">Selecciona una mascota</option>
                            {userPets.map(pet => (
                                <option key={pet.id} value={pet.id}>
                                    {pet.name} - {pet.species} ({pet.breed})
                                </option>
                            ))}
                        </select>
                        {userPets.length === 0 && (
                            <p className="mt-2 text-sm text-red-600">
                                No tienes mascotas registradas. <a href="/petregister" className="underline">Registra una mascota</a>
                            </p>
                        )}
                    </div>

                    {/* Fecha seleccionada */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Fecha seleccionada
                        </label>
                        <input
                            type="text"
                            value={selectedDate ? selectedDate.toLocaleDateString('es-AR') : 'No seleccionada'}
                            readOnly
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                        />
                    </div>

                    {/* Hora seleccionada */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Hora seleccionada
                        </label>
                        <input
                            type="text"
                            value={selectedTime || 'No seleccionada'}
                            readOnly
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                        />
                    </div>

                    {/* Motivo */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Motivo de la consulta *
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows="4"
                            placeholder="Describe el motivo de la consulta..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            required
                        />
                    </div>

                    {/* Botón de envío */}
                    <button
                        type="submit"
                        disabled={loading || !selectedDate || !selectedTime || !selectedPet}
                        className={`
                            w-full py-4 rounded-lg font-bold text-white transition-all
                            ${loading || !selectedDate || !selectedTime || !selectedPet
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                            }
                        `}
                    >
                        {loading ? 'Reservando...' : 'Reservar Turno'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AppointmentCalendar;
