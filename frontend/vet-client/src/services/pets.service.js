import { supabase } from './supabase.js';
import { calculateAgesForPets } from '../utils/calculateAge.js';

export const getPets = async () => {
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

        // Si es admin, ver todas las mascotas con información del dueño
        // Si no es admin, solo ver las suyas sin JOIN
        let query;

        if (isAdmin) {
            // Admin ve todas las mascotas (activas e inactivas) con información del dueño
            // EXCEPTO las mascotas en adopción (has_owner = false)
            query = supabase
                .from('pet')
                .select(`
                    *,
                    users!user_id(name, email, phone)
                `)
                .eq('has_owner', true) // Solo mascotas con dueño
                .order('is_active', { ascending: false }); // Mostrar activas primero
        } else {
            // Usuarios normales solo ven sus mascotas activas
            query = supabase
                .from('pet')
                .select('*')
                .eq('is_active', true)
                .eq('has_owner', true) // Solo mascotas con dueño
                .eq('user_id', user.id);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error en query de getPets:', error);
            console.error('Detalles:', { message: error.message, details: error.details, hint: error.hint, code: error.code });
            throw error;
        }

        console.log(`Mascotas obtenidas (${isAdmin ? 'ADMIN' : 'USUARIO'}):`, data?.length || 0);

        // Calcular edades automáticamente
        const petsWithCalculatedAge = calculateAgesForPets(data || []);
        return petsWithCalculatedAge;
    } catch (error) {
        console.error('Error en getPets:', error);
        throw error;
    }
}



export const getPetsForAdoptions = async () => {
    try {
        const response = await supabase
            .from('pet')
            .select('*')
            .eq('has_owner', false);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createPet = async (petData) => {
  try {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuario no autenticado');
    }


    const { data, error } = await supabase
      .from('pet')
      .insert([{
        name: petData.name,
        species: petData.species,
        age: petData.age,
        birth_date: petData.birth_date || null, // Permitir null si no se proporciona
        vaccines: petData.vaccines && petData.vaccines.length > 0 ? petData.vaccines : null, // Permitir null
        history: petData.history || null, // Permitir null
        image: petData.image || null, // Permitir null
        sex: petData.sex,
        breed: petData.breed,
        is_active: true,
        has_owner: petData.has_owner !== undefined ? petData.has_owner : true,
        user_id: user.id  // Este es el auth_id
      }])
      .select();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
};


export const updatePet = async (id, petData) => {
    try {
        const { data, error } = await supabase
            .from('pet')
            .update({
                name: petData.name,
                species: petData.species,
                age: petData.age,
                birth_date: petData.birth_date || null, // Permitir null
                vaccines: petData.vaccines && petData.vaccines.length > 0 ? petData.vaccines : null, // Permitir null
                history: petData.history || null, // Permitir null
                image: petData.image || null, // Permitir null
                sex: petData.sex,
                breed: petData.breed,
                has_owner: petData.has_owner
            })
            .eq('id', id)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        throw error;
    }
};

// Marcar mascota como inactiva (is_active = false) con motivo
export const deletePet = async (id, reason = null) => {
    try {
        const updateData = { is_active: false };

        // Si se proporciona un motivo, agregarlo
        if (reason) {
            updateData.deactivation_reason = reason;
        }

        const { data, error } = await supabase
            .from('pet')
            .update(updateData)
            .eq('id', id)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        throw error;
    }
};

// Eliminar mascota permanentemente de la base de datos (solo admins)
export const deletePetPermanently = async (id) => {
    try {
        // Verificar que el usuario esté autenticado
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('Usuario no autenticado');
        }

        // Verificar que el usuario sea admin
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role')
            .eq('auth_id', user.id)
            .single();

        if (userError) throw userError;

        if (userData?.role !== 'admin') {
            throw new Error('Solo los administradores pueden eliminar mascotas permanentemente');
        }

        // Primero, eliminar todas las citas (appointments) relacionadas
        const { error: appointmentsError } = await supabase
            .from('appoinment')
            .delete()
            .eq('pet_id', id);

        if (appointmentsError) {
            console.error('Error al eliminar citas relacionadas:', appointmentsError);
            throw new Error('No se pudieron eliminar las citas relacionadas con la mascota');
        }

        // Luego, eliminar la mascota
        const { data, error } = await supabase
            .from('pet')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error al eliminar mascota:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Error en deletePetPermanently:', error);
        throw error;
    }
};

export const getPetById = async (id) => {
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

        // Si es admin, puede ver mascotas activas e inactivas con info del dueño
        // Si no es admin, solo puede ver mascotas activas
        let query;

        if (isAdmin) {
            query = supabase
                .from('pet')
                .select(`
                    *,
                    users!user_id(name, email, phone)
                `)
                .eq('id', id)
                .single();
        } else {
            query = supabase
                .from('pet')
                .select('*')
                .eq('id', id)
                .eq('is_active', true)
                .single();
        }

        const { data, error } = await query;

        if (error) throw error;
        return data;
    } catch (error) {
        throw error;
    }
};

export const createPetForAdoption = async (petData) => {
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

        // Crear mascota para adopción (sin dueño)
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
                has_owner: false, // Mascota sin dueño (para adopción)
                user_id: null // No tiene usuario asignado
            }])
            .select();

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        throw error;
    }
};
