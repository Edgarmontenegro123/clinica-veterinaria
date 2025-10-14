import axios from './axios.js';

export const getPets = async () => {
    try {
        const response = await axios.get(`/pets`);
        return response.data;
    } catch (error) {
        console.error('Error fetching pets by owner:', error);
        throw error;
    }
}

export const getPetsForAdoptions = async () => {
    try {
        const response = await axios.get(`/pets/adoptions`);
        return response.data;
    } catch (error) {
        console.error('Error fetching pets adoptions', error);
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

export const deletePet = async (petId) => {
    try {
        const response = await axios.delete(`/pets/${petId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting pet:', error);
        throw error;
    }
}