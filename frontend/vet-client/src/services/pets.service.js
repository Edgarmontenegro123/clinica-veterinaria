import axios from './axios.js';

export const getPetsByOwner = async (clientId) => {
    try {
        const response = await axios.get(`/pets/client/${clientId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching pets by owner:', error);
        throw error;
    }
}

export const createPet = async (petData) => {
    try {
        const petResponse = await axios.post('/pets', petData, {
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
