import { supabase } from './supabase.js';

/**
 * Genera los slots de horarios disponibles para un día específico
 * Horario: 10:00 a 20:00, cada 45 minutos
 */
export const generateTimeSlots = () => {
    const slots = [];
    const startHour = 10;
    const endHour = 20;
    const intervalMinutes = 45;

    for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += intervalMinutes) {
            const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
            slots.push(time);
        }
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
        const allSlots = generateTimeSlots();
        const appointments = await getAppointmentsByDate(date);

        // Extraer las horas ocupadas
        const bookedSlots = appointments.map(apt => {
            const aptDate = new Date(apt.datetime);
            return `${String(aptDate.getHours()).padStart(2, '0')}:${String(aptDate.getMinutes()).padStart(2, '0')}`;
        });

        // Filtrar los slots disponibles
        const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

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
        const { data, error } = await supabase
            .from('appoinment')
            .insert([appointmentData])
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
 * Obtiene los turnos de un usuario específico
 */
export const getUserAppointments = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('appoinment')
            .select('*, pet(*)')
            .eq('pet.user_id', userId)
            .order('datetime', { ascending: true });

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
 * Cancela un turno (elimina)
 */
export const cancelAppointment = async (appointmentId) => {
    try {
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
export const getUserPets = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('pet')
            .select('*')
            .eq('user_id', userId)
            .eq('has_owner', true);

        if (error) {
            console.error('Error fetching user pets:', error);
            throw error;
        }

        return data || [];
    } catch (error) {
        console.error('Error in getUserPets:', error);
        throw error;
    }
};
