-- ============================================
-- TRIGGER PARA CREAR USUARIO EN TABLA users
-- Cuando se registra un nuevo usuario en auth.users
-- ============================================

-- Función que se ejecuta cuando se crea un nuevo usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insertar un nuevo registro en la tabla users con el auth_id
  INSERT INTO public.users (auth_id, email, role, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    'user',  -- Por defecto todos los nuevos usuarios tienen role='user'
    NOW()
  )
  ON CONFLICT (auth_id) DO NOTHING;  -- Si ya existe, no hacer nada

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar el trigger si existe (para poder recrearlo)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Crear el trigger que se ejecuta después de insertar un usuario en auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Para verificar que el trigger se creó correctamente:
-- SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- Para verificar que la función existe:
-- SELECT * FROM pg_proc WHERE proname = 'handle_new_user';

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================
-- 1. Este trigger se ejecuta automáticamente cuando un usuario se registra
-- 2. Crea un registro en la tabla 'users' con el mismo auth_id que auth.users
-- 3. El email se copia automáticamente desde auth.users
-- 4. Todos los usuarios nuevos tienen role='user' por defecto
-- 5. Los admins deben ser creados manualmente cambiando el role a 'admin'
