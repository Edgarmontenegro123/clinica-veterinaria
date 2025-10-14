import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import RegisterForm from '../components/RegisterForm.jsx'
import { useAuthStore } from '../store/authStore.js'

const RegisterPage = () => {
    const { token, userEmail } = useAuthStore()
    const navigate = useNavigate()

    useEffect(() => {
        if (token || userEmail) {
            navigate('/', { replace: true }) 
        }
    }, [token, userEmail, navigate])

    return (
        <div className='flex justify-center'>
            Registrate con nosotros!
            <RegisterForm />
        </div>
    )
}

export default RegisterPage