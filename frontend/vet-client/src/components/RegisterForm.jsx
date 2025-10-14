import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/authStore.js';
import { registerUser } from '../services/auth.service.js';

export default function RegisterForm() {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const setAuth = useAuthStore((state) => state.setAuth);

    const onSubmit = async (data) => {
        try {
            const { token, email, id, roles } = await registerUser(data);
            setAuth(token, email, id, roles);
            console.log('user created and logged in');
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <form className='flex flex-col gap-2 justify-center border-2 p-4 rounded-xl bg-gray-100 ' onSubmit={handleSubmit(onSubmit)}>
            <div className='flex  flex-col'>
                <label>Nombre completo</label>
                <input className='bg-white px-1 rounded-md' placeholder='Nombre completo' {...register('name', { required: true })} />
                {errors.name && <span>El campo es requerido</span>}
            </div>
            <div className='flex  flex-col'>
                <label>Email</label>
                <input className='bg-white px-1 rounded-md' placeholder='Email' {...register('email', { required: true })} />
                {errors.email && <span>El campo es requerido</span>}
            </div>
            <div className='flex  flex-col'>
                <label>Contraseña</label>
                <input className='bg-white px-1 rounded-md' type='password' placeholder='' {...register('password', { required: true })} />
                {errors.password && <span>El campo es requerido</span>}
            </div>
            <div className='flex  flex-col'>
                <label>Telefono</label>
                <input className='bg-white px-1 rounded-md' placeholder='01136439845' {...register('phone', { required: true })} />
                {errors.phone && <span>El campo es requerido</span>}
            </div>
            <div className='flex  flex-col'>
                <label>Dirección</label>
                <input className='bg-white px-1 rounded-md' placeholder='Av. siempreviva 742' {...register('address')} />
            </div>
            <button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors'>Crear cuenta</button>
        </form>
    );
}