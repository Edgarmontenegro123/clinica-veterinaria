import axios from './axios.js';
import { supabase } from './supabase.js';
import { calculateAgesForPets } from '../utils/calculateAge.js';

// export const getPets = async () => {
//     try {
//         const response = await axios.get(`/pets`);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching pets by owner:', error);
//         throw error;
//     }
// }

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
            query = supabase
                .from('pet')
                .select(`
                    *,
                    users!user_id(name, email, phone)
                `)
                .order('is_active', { ascending: false }); // Mostrar activas primero
        } else {
            // Usuarios normales solo ven sus mascotas activas
            query = supabase
                .from('pet')
                .select('*')
                .eq('is_active', true)
                .eq('user_id', user.id);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching pets:', error);
            throw error;
        }

        // Calcular edades automáticamente
        const petsWithCalculatedAge = calculateAgesForPets(data || []);
        return petsWithCalculatedAge;
    } catch (error) {
        console.error('Error fetching pets by owner:', error);
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
        console.error('Error fetching pets by owner:', error);
        throw error;
    }
}

// export const getPetsForAdoptions = async () => {
//     try {
//         const response = await axios.get(`/pets/adoptions`);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching pets adoptions', error);
//         throw error;
//     }
// }

// export const createPet = async (petData) => {
//     try {
//         const petResponse = await axios.post('/pets', petData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//         });
//         return petResponse.data;
//     } catch (error) {
//         console.error('Error creating pet:', error);
//         throw error;
//     }
// };

export const createPet = async (petData) => {
  try {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    console.log('Auth user:', user);
    console.log('Inserting pet with user_id (auth_id):', user.id);

    // user_id en la tabla pet referencia a users(auth_id), no users(id)
    // Por lo tanto, usamos directamente user.id del usuario autenticado
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
      console.log('Insert error:', error);
      throw error;
    }

    console.log('Pet created successfully:', data);
    return data;
  } catch (error) {
    console.error('createPet error:', error);
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
        console.error('Error updating pet:', error);
        throw error;
    }
};

// Marcar mascota como fallecida (is_active = false)
export const deletePet = async (id) => {
    try {
        const { data, error } = await supabase
            .from('pet')
            .update({ is_active: false })
            .eq('id', id)
            .select();

        if (error) throw error;
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error deleting pet:', error);
        throw error;
    }
};

// Eliminar mascota permanentemente de la base de datos
export const deletePetPermanently = async (id) => {
    try {
        const { data, error } = await supabase
            .from('pet')
            .delete()
            .eq('id', id);

        if (error) throw error;
        console.log('Pet permanently deleted:', data);
        return data;
    } catch (error) {
        console.error('Error permanently deleting pet:', error);
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
        console.error('Error fetching pet:', error);
        throw error;
    }
};

// export const deletePet = async (petId) => {
//     try {
//         const response = await axios.delete(`/pets/${petId}`);
//         return response.data;
//     } catch (error) {
//         console.error('Error deleting pet:', error);
//         throw error;
//     }
// }

export const createPetForAdoption = async (petData) => {
    try {
        const petResponse = await axios.post('/pets/adoptions', petData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return petResponse.data;
    } catch (error) {
        console.error('Error creating pet:', error);
        throw error;
    }
};
