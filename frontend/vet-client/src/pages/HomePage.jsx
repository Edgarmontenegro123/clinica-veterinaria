import { useEffect, useState } from 'react'
import { getPetsByOwner } from '../services/pets.service.js'
import { useAuthStore } from '../store/authStore.js'

const HomePage = () => {
    const { userId } = useAuthStore()
    const [pets, setPets] = useState([])

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const petsDB = await getPetsByOwner(userId || 0)
                setPets(petsDB)
            } catch (error) {
                console.error('Failed to fetch pets', error);
            }
        }
        fetchPets()
    }, []);

    if (!userId) {
        return <div className='flex flex-col justify-center items-center'>
            <h2>Pagina de inicio</h2>
            <p>Por favor, <a href='/login'>inicia sesión</a> para ver tus mascotas.</p>
            <div className='flex gap-5 justify-center'>
                <a href='/login'>Iniciar sesión</a>
                <a href='/Register'>Registrarse</a>
            </div>
        </div>
    }

    return (
        <div>
            <h2>Pagina de inicio</h2>
            {
                pets.length > 0 ? (
                    <ul>
                        {pets.map((pet) => <li key={pet.id}>{pet.name}</li>)}
                    </ul>
                ) : (
                    <p>No existen mascotas</p>
                )
            }
            <a href='/petregister'>Agregar Mascota</a>
        </div>
    )
}

export default HomePage