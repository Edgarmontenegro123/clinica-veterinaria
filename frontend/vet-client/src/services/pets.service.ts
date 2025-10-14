import type { ResponsePet } from '../types/pet.dto';
import axios from './axios';

export const getPetsByOwner = async (clientId: number) => {
    try {

        const response = await axios.get<ResponsePet[]>(`/pets/client/${clientId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching pets by owner:", error);
        throw error;
    }
}


export const createPet = async (petData: FormData) => {
    try {
        const petResponse = await axios.post('/pets', petData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return petResponse.data;
    } catch (error) {
        console.error("Error creating pet:", error);
        throw error;
    }
};
