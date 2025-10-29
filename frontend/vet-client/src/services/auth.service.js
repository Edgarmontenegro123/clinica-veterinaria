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

export const registerUser = async ({ email, password }) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    return { user: data.user, session: data.session };
  } catch (error) {
    console.error('Registration error:', error.message);
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