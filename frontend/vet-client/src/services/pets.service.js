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
        const { data, error } = await supabase
            .from('pet')
            .insert([{...petData, "is_active": true}])
            .select()
        if (error) {
            console.log(error)
        }
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}

export const deletePet = async (id) => {
    try {
        const response = await supabase
            .from('pet')
            .update({ is_active: false })
            .eq('id', id)
            .select()
        console.log(response);
    } catch (error) {
        console.log(error)
    }
}

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
