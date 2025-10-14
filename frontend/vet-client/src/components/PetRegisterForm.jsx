import { useForm } from 'react-hook-form';
import { createPet } from '../services/pets.service.js';

export default function PetRegisterForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('species', data.species);
            formData.append('age', data.age.toString());
            formData.append('sex', data.sex);
            formData.append('breed', data.breed);

            if (data.image && data.image.length > 0) {
                formData.append('file', data.image[0]); 
            }

            const response = await createPet(formData); 
            console.log('Pet registered successfully: ', response);
        } catch (error) {
            console.error('Pet registration failed', error);
        }
    };

    return (
        <form className='flex flex-col gap-2 justify-center border-2 p-4 rounded-xl bg-gray-100 '
              onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col'>
                <label>Nombre</label>
                <input
                    className='bg-white px-1 rounded-md'
                    placeholder='Nombre'
                    {...register('name', { required: true })} />
                {errors.name && <span>El campo es requerido</span>}
            </div>

            <div className='flex flex-col'>
                <label>Especie</label>
                <input
                    className='bg-white px-1 rounded-md'
                    placeholder='Gato'
                    {...register('species', { required: true })} />
                {errors.species && <span>El campo es requerido</span>}
            </div>

            <div className='flex flex-col'>
                <label>Años</label>
                <input
                    className='bg-white px-1 rounded-md'
                    placeholder='3'
                    type='number'
                    {...register('age', { required: true, valueAsNumber: true })} />
                {errors.age && <span>El campo es requerido</span>}
            </div>

            <div className='flex flex-col'>
                <label>Sexo</label>
                <input
                    className='bg-white px-1 rounded-md'
                    placeholder='Masculino'
                    {...register('sex', { required: true })} />
                {errors.sex && <span>El campo es requerido</span>}
            </div>

            <div className='flex flex-col'>
                <label>Raza</label>
                <input
                    className='bg-white px-1 rounded-md'
                    placeholder='Callejero'
                    {...register('breed', { required: true })} />
                {errors.breed && <span>El campo es requerido</span>}
            </div>

            <div className='flex flex-col'>
                <label>Imagen</label>
                <input
                    type='file'
                    className='bg-white px-1 rounded-md'
                    {...register('image', { required: true })} />
                {errors.image && <span>El campo es requerido</span>}
            </div>

            <button
                type='submit'
                className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors'>
                Crear mascota
            </button>
        </form>
    );
}
