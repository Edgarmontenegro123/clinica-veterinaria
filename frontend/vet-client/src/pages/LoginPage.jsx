import React from 'react';
import LoginForm from '../components/LoginForm.jsx';
import { useAuthStore } from '../store/authStore.js'

const LoginPage = () => {

  const { userEmail, logout } = useAuthStore()

  return (
    <div className='flex justify-center'>
      {
        userEmail ?
          <div>
            <h2>Bienvenido {userEmail}!</h2>
            <button onClick={() => logout()}>Logout</button>
          </div>
          :
          <div>
            <h2>Iniciar Sesión</h2>
            <LoginForm />
          </div>
      }
    </div>
  )
}

export default LoginPage