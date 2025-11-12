import axios from './axios.js';
import { supabase } from './supabase.js'

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
        const response = await supabase
            .from('pet')
            .select('*')
            .eq('is_active', true);
        return response.data;
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
        birth_date: petData.birth_date || new Date().toISOString().split('T')[0],
        vaccines: petData.vaccines || [],
        history: petData.history || '',
        image: petData.image || '',
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
                birth_date: petData.birth_date,
                vaccines: petData.vaccines || [],
                history: petData.history || '',
                image: petData.image || '',
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

export const getPetById = async (id) => {
    try {
        const { data, error } = await supabase
            .from('pet')
            .select('*')
            .eq('id', id)
            .eq('is_active', true)
            .single();

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
