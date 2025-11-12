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

    // Obtener id_client de la tabla users basado en auth_id
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    if (userError) throw userError;

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
        id_client: userData.id
      }])
      .select();

    if (error) {
      console.log(error);
      throw error;
    }

    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
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
