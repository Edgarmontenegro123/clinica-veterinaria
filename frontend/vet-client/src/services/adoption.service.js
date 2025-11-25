import { supabase } from './supabase.js';
import { calculateAgesForPets } from '../utils/calculateAge.js';

// Obtener todas las mascotas disponibles para adopción
export const getAdoptionPets = async () => {
    try {
        const { data, error } = await supabase
            .from('pet')
            .select('*')
            .eq('has_owner', false)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        // Calcular edades automáticamente
        const petsWithCalculatedAge = calculateAgesForPets(data || []);
        return petsWithCalculatedAge;
    } catch (error) {
        throw error;
    }
};

// Adoptar una mascota (asignarla al usuario)
export const adoptPet = async (petId) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('Usuario no autenticado');
        }

        // Actualizar la mascota: asignar al usuario y marcar como con dueño
        const { data, error } = await supabase
            .from('pet')
            .update({
                user_id: user.id,
                has_owner: true
            })
            .eq('id', petId)
            .eq('has_owner', false) // Solo permitir adopción si no tiene dueño
            .select();

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            throw new Error('La mascota ya no está disponible para adopción');
        }

        return data[0];
    } catch (error) {
        throw error;
    }
};

// Crear mascota para adopción (solo admin)
export const createAdoptionPet = async (petData) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('Usuario no autenticado');
        }

        // Verificar que el usuario sea admin
        const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('auth_id', user.id)
            .single();

        if (userData?.role !== 'admin') {
            throw new Error('Solo los administradores pueden crear mascotas para adopción');
        }

        // Crear mascota para adopción
        const { data, error } = await supabase
            .from('pet')
            .insert([{
                name: petData.name,
                species: petData.species,
                age: petData.age,
                birth_date: petData.birth_date || null,
                vaccines: petData.vaccines && petData.vaccines.length > 0 ? petData.vaccines : null,
                history: petData.history || null,
                image: petData.image || null,
                sex: petData.sex,
                breed: petData.breed,
                is_active: true,
                has_owner: false,
                user_id: null
            }])
            .select();

        if (error) {
            throw error;
        }

        return data[0];
    } catch (error) {
        throw error;
    }
};

// Actualizar mascota para adopción (solo admin)
export const updateAdoptionPet = async (petId, petData) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('Usuario no autenticado');
        }

        // Verificar que el usuario sea admin
        const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('auth_id', user.id)
            .single();

        if (userData?.role !== 'admin') {
            throw new Error('Solo los administradores pueden editar mascotas para adopción');
        }

        const { data, error } = await supabase
            .from('pet')
            .update({
                name: petData.name,
                species: petData.species,
                age: petData.age,
                birth_date: petData.birth_date || null,
                vaccines: petData.vaccines && petData.vaccines.length > 0 ? petData.vaccines : null,
                history: petData.history || null,
                image: petData.image || null,
                sex: petData.sex,
                breed: petData.breed
            })
            .eq('id', petId)
            .eq('has_owner', false) // Solo permitir editar mascotas sin dueño
            .select();

        if (error) {
            throw error;
        }

        return data[0];
    } catch (error) {
        throw error;
    }
};

// Eliminar mascota de adopción (solo admin)
export const deleteAdoptionPet = async (petId) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('Usuario no autenticado');
        }

        // Verificar que el usuario sea admin
        const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('auth_id', user.id)
            .single();

        if (userData?.role !== 'admin') {
            throw new Error('Solo los administradores pueden eliminar mascotas para adopción');
        }

        const { data, error } = await supabase
            .from('pet')
            .delete()
            .eq('id', petId)
            .eq('has_owner', false); // Solo permitir eliminar mascotas sin dueño

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        throw error;
    }
};
