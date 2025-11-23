import { supabase } from './supabase.js';

export const login = async ({ email, password }) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { user: data.user, session: data.session };
  } catch (error) {
    console.error('Login error:', error.message);
    throw error;
  }
};

export const registerUser = async ({ email, password, name, address, phone }) => {
  try {
    // Limpiar el email de espacios en blanco
    const cleanEmail = email.trim().toLowerCase();

    console.log('Intentando registrar usuario con email:', cleanEmail);

    // Paso 1: Crear usuario en Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
    });

    if (error) {
      console.error('Error de Supabase Auth:', error);

      // Mensajes de error más descriptivos
      if (error.code === 'email_address_invalid') {
        throw new Error('El formato del correo electrónico no es válido. Por favor verifica que esté escrito correctamente.');
      } else if (error.code === 'user_already_exists') {
        throw new Error('Este correo electrónico ya está registrado. Intenta iniciar sesión.');
      } else if (error.code === 'weak_password') {
        throw new Error('La contraseña es muy débil. Debe tener al menos 6 caracteres.');
      } else {
        throw new Error(error.message || 'Error al crear la cuenta. Intenta nuevamente.');
      }
    }

    console.log('Usuario creado en Auth:', data);

    // Paso 2: Actualizar información del usuario en la tabla users (incluyendo email)
    const { error: updateError } = await supabase
      .from('users')
      .update({
        name: name.trim(),
        email: cleanEmail,  // ⭐ Importante: guardar el email limpio
        address: address?.trim() || null,
        phone: phone.trim()
      })
      .eq('auth_id', data.user.id);

    if (updateError) {
      console.error('Error actualizando datos del usuario:', updateError);
      throw new Error('El usuario fue creado pero hubo un error al guardar los datos adicionales. Por favor, contacta con soporte.');
    }

    console.log('Datos del usuario actualizados correctamente con email:', cleanEmail);

    return { user: data.user, session: data.session };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const resetPassword = async (email) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Password reset error:', error.message);
    throw error;
  }
};



// /*./services/auth.service.js*/
// import axios from './axios.js';

// export const login = async (loginUser) => {
//     try {
//         const response = await axios.post('/auth/login', loginUser);
//         return response.data;
//     } catch (error) {
//         console.error('Login error:', error);
//         throw error;
//     }
// }

// export const registerUser = async (registerUser) => {
//     try {
//         const response = await axios.post('/auth/register', registerUser);
//         return response.data;
//     } catch (error) {
//         console.error('Registration error:', error);
//         throw error;
//     }
// }