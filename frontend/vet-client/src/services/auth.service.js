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

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    console.log(data);
    // data.user.id
    // console.log(name, address, phone, data.user.id);
    await supabase.from('users').update([{ name: name, address: address, phone: phone }]).eq('auth_id', data.user.id);

    if (error) throw error;

    return { user: data.user, session: data.session };
  } catch (error) {
    console.error('Registration error:', error.message);
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