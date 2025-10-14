import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore.js'
import PetRegisterForm from '../components/PetRegisterForm.jsx'

const PetRegisterPage = () => {
    const { userId } = useAuthStore()
    const navigate = useNavigate()

    useEffect(() => {
        if (!userId) {
            navigate('/', { replace: true }) 
        }
    }, [userId, navigate])

    return (
        <div className='flex justify-center'>
            Registrate tu mascota
            <PetRegisterForm />
        </div>
    )
}

export default PetRegisterPage;