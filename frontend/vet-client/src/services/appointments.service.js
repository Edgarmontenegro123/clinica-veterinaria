import { supabase } from './supabase.js';

/**
 * Genera los slots de horarios disponibles para un día específico
 * Horario: 10:00 a 20:00, cada 30 minutos (Lunes a Viernes)
 * Sábados: 10:00 a 12:30
 * Domingos: No se atiende
 */
export const generateTimeSlots = (date) => {
    const slots = [];
    const startHour = 10;
    const intervalMinutes = 30;

    // Obtener el día de la semana (0 = domingo, 6 = sábado)
    const dayOfWeek = new Date(date).getDay();

    // No generar slots para domingos
    if (dayOfWeek === 0) {
        return slots;
    }

    // Si es sábado (6), solo hasta las 12:30
    const endHour = dayOfWeek === 6 ? 12 : 20;
    const lastMinute = dayOfWeek === 6 ? 30 : 0; // Para sábados, incluir 12:30

    for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += intervalMinutes) {
            const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
            slots.push(time);
        }
    }

    // Agregar el último slot si es sábado (12:30)
    if (dayOfWeek === 6 && lastMinute === 30) {
        slots.push('12:30');
    }

    return slots;
};

/**
 * Obtiene los turnos ocupados para una fecha específica
 */
export const getAppointmentsByDate = async (date) => {
    try {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const { data, error } = await supabase
            .from('appoinment')
            .select('*, pet(*)')
            .gte('datetime', startOfDay.toISOString())
            .lte('datetime', endOfDay.toISOString());

        if (error) {
            console.error('Error fetching appointments:', error);
            throw error;
        }

        return data || [];
    } catch (error) {
        console.error('Error in getAppointmentsByDate:', error);
        throw error;
    }
};

/**
 * Obtiene los horarios disponibles para una fecha específica
 */
export const getAvailableTimeSlots = async (date) => {
    try {
        const allSlots = generateTimeSlots(date); // Pasar la fecha para generar slots correctos
        const appointments = await getAppointmentsByDate(date);
        const now = new Date();
        const selectedDate = new Date(date);

        // Verificar si la fecha seleccionada es hoy
        const isToday = selectedDate.getDate() === now.getDate() &&
                        selectedDate.getMonth() === now.getMonth() &&
                        selectedDate.getFullYear() === now.getFullYear();

        // Extraer las horas ocupadas
        const bookedSlots = appointments.map(apt => {
            const aptDate = new Date(apt.datetime);
            return `${String(aptDate.getHours()).padStart(2, '0')}:${String(aptDate.getMinutes()).padStart(2, '0')}`;
        });

        // Filtrar los slots disponibles
        let availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

        // Si es hoy, filtrar también los horarios que ya pasaron
        if (isToday) {
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();

            availableSlots = availableSlots.filter(slot => {
                const [slotHour, slotMinute] = slot.split(':').map(Number);

                // Comparar hora y minutos
                if (slotHour > currentHour) {
                    return true;
                } else if (slotHour === currentHour && slotMinute > currentMinute) {
                    return true;
                }
                return false;
            });
        }

        return availableSlots;
    } catch (error) {
        console.error('Error getting available time slots:', error);
        throw error;
    }
};

/**
 * Crea un nuevo turno
 */
export const createAppointment = async (appointmentData) => {
    try {
        // Obtener el usuario autenticado
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            throw new Error('Usuario no autenticado');
        }

        // Agregar el user_id explícitamente
        const dataToInsert = {
            ...appointmentData,
            user_id: user.id // Usar el auth_id del usuario autenticado
        };

        const { data, error } = await supabase
            .from('appoinment')
            .insert([dataToInsert])
            .select('*, pet(*)');

        if (error) {
            console.error('Error creating appointment:', error);
            throw error;
        }

        return data[0];
    } catch (error) {
        console.error('Error in createAppointment:', error);
        throw error;
    }
};

/**
 * Obtiene los turnos de un usuario específico o todos si es admin
 */
export const getUserAppointments = async (userId) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('Usuario no autenticado');
        }

        // Verificar si es admin
        const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('auth_id', user.id)
            .single();

        const isAdmin = userData?.role === 'admin';

        // Si es admin, obtener todos los turnos. Si no, solo los del usuario
        let query = supabase
            .from('appoinment')
            .select(`
                *,
                pet(*),
                users!appoinment_user_id_fkey(name, email, phone)
            `)
            .order('datetime', { ascending: true });

        if (!isAdmin) {
            query = query.eq('user_id', userId);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching user appointments:', error);
            throw error;
        }

        return data || [];
    } catch (error) {
        console.error('Error in getUserAppointments:', error);
        throw error;
    }
};

/**
 * Obtiene TODOS los turnos (solo para admin)
 */
export const getAllAppointments = async () => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('Usuario no autenticado');
        }

        // Verificar si es admin
        const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('auth_id', user.id)
            .single();

        if (userData?.role !== 'admin') {
            throw new Error('No tienes permisos de administrador');
        }

        const { data, error } = await supabase
            .from('appoinment')
            .select(`
                *,
                pet(*),
                users!user_id(name, email, phone)
            `)
            .order('datetime', { ascending: true });

        if (error) {
            console.error('Error fetching all appointments:', error);
            throw error;
        }

        return data || [];
    } catch (error) {
        console.error('Error in getAllAppointments:', error);
        throw error;
    }
};

/**
 * Cancela un turno (elimina)
 */
export const cancelAppointment = async (appointmentId) => {
    try {
        // Primero verificar si el turno existe
        const { data: existingAppointment, error: fetchError } = await supabase
            .from('appoinment')
            .select('*')
            .eq('id', appointmentId)
            .single();

        if (fetchError) {
            console.error('Error al buscar el turno:', fetchError);
            throw new Error('No se pudo encontrar el turno');
        }

        if (!existingAppointment) {
            throw new Error('El turno no existe');
        }

        // Eliminar el turno
        const { error } = await supabase
            .from('appoinment')
            .delete()
            .eq('id', appointmentId);

        if (error) {
            console.error('Error canceling appointment:', error);
            throw error;
        }

        return true;
    } catch (error) {
        console.error('Error in cancelAppointment:', error);
        throw error;
    }
};

/**
 * Obtiene las mascotas de un usuario
 */
export const getUserPets = async (authId) => {
    try {
        // user_id en la tabla pet referencia a users(auth_id), no users(id)
        // Por lo tanto, usamos directamente el authId
        const { data, error } = await supabase
            .from('pet')
            .select('*')
            .eq('user_id', authId)  // authId es el auth_id del usuario
            .eq('is_active', true);

        if (error) {
            console.error('Error fetching user pets:', error);
            throw error;
        }

        return data || [];
    } catch (error) {
        console.error('Error in getUserPets:', error);
        return [];
    }
};
