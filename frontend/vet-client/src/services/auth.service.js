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
    throw error;
  }
};

export const registerUser = async ({ email, password, name, address, phone }) => {
  try {

    const cleanEmail = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
    });

    if (error) {
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
    const { error: updateError } = await supabase
      .from('users')
      .update({
        name: name.trim(),
        email: cleanEmail, 
        address: address?.trim() || null,
        phone: phone.trim()
      })
      .eq('auth_id', data.user.id);

    if (updateError) {
      throw new Error('El usuario fue creado pero hubo un error al guardar los datos adicionales. Por favor, contacta con soporte.');
    }

    return { user: data.user, session: data.session };
  } catch (error) {
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
    throw error;
  }
};