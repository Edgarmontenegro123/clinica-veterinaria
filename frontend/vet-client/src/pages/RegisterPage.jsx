import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore.js'

const RegisterPage = () => {
    const { user } = useAuthStore()
    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            navigate('/', { replace: true })
        } else {
            // Redirigir a login con modo registro para mantener la animación
            navigate('/login?mode=register', { replace: true })
        }
    }, [user, navigate])

    return null
}

export default RegisterPage