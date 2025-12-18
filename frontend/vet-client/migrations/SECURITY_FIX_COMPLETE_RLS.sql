-- ============================================
-- CORRECCIÓN COMPLETA DE SEGURIDAD RLS
-- Para resolver los 4 errores del Security Advisor
-- ============================================
-- EJECUTAR EN: Supabase Dashboard > SQL Editor > New Query
-- Fecha: 2025-12-17
-- ============================================

-- ============================================
-- TABLA: users
-- ============================================
-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Allow user creation during signup" ON users;

-- SELECT: Usuarios pueden ver su propio perfil
CREATE POLICY "Users can view their own profile" ON users
FOR SELECT
USING (auth.uid() = auth_id);

-- SELECT: Admins pueden ver todos los usuarios
CREATE POLICY "Admins can view all users" ON users
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.auth_id = auth.uid()
    AND u.role = 'admin'
  )
);

-- UPDATE: Usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update their own profile" ON users
FOR UPDATE
USING (auth.uid() = auth_id)
WITH CHECK (auth.uid() = auth_id);

-- UPDATE: Admins pueden actualizar cualquier usuario
CREATE POLICY "Admins can update all users" ON users
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.auth_id = auth.uid()
    AND u.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.auth_id = auth.uid()
    AND u.role = 'admin'
  )
);

-- INSERT: Permitir creación de usuarios durante signup
CREATE POLICY "Allow user creation during signup" ON users
FOR INSERT
WITH CHECK (auth.uid() = auth_id);

-- ============================================
-- TABLA: pet
-- ============================================
-- Habilitar RLS
ALTER TABLE pet ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Users can view their own pets" ON pet;
DROP POLICY IF EXISTS "Users can insert their own pets" ON pet;
DROP POLICY IF EXISTS "Users can update their own pets" ON pet;
DROP POLICY IF EXISTS "Users can delete their own pets" ON pet;
DROP POLICY IF EXISTS "Admins can view all pets" ON pet;
DROP POLICY IF EXISTS "Admins can insert pets" ON pet;
DROP POLICY IF EXISTS "Admins can update all pets" ON pet;
DROP POLICY IF EXISTS "admin_can_delete_pets" ON pet;

-- SELECT: Usuarios pueden ver sus propias mascotas
CREATE POLICY "Users can view their own pets" ON pet
FOR SELECT
USING (auth.uid() = user_id);

-- SELECT: Admins pueden ver todas las mascotas
CREATE POLICY "Admins can view all pets" ON pet
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND users.role = 'admin'
  )
);

-- INSERT: Usuarios pueden agregar sus propias mascotas
CREATE POLICY "Users can insert their own pets" ON pet
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- INSERT: Admins pueden agregar cualquier mascota
CREATE POLICY "Admins can insert pets" ON pet
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND users.role = 'admin'
  )
);

-- UPDATE: Usuarios pueden actualizar sus propias mascotas
CREATE POLICY "Users can update their own pets" ON pet
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- UPDATE: Admins pueden actualizar cualquier mascota
CREATE POLICY "Admins can update all pets" ON pet
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND users.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND users.role = 'admin'
  )
);

-- DELETE: Usuarios pueden desactivar sus propias mascotas
CREATE POLICY "Users can delete their own pets" ON pet
FOR DELETE
USING (auth.uid() = user_id);

-- DELETE: Admins pueden eliminar cualquier mascota
CREATE POLICY "admin_can_delete_pets" ON pet
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND users.role = 'admin'
  )
);

-- ============================================
-- TABLA: appoinment (ya configurada, verificar)
-- ============================================
-- Solo verificamos que esté habilitado RLS
ALTER TABLE appoinment ENABLE ROW LEVEL SECURITY;

-- ============================================
-- VERIFICACIÓN DE POLÍTICAS
-- ============================================
-- Para verificar que todas las políticas se crearon correctamente:

-- Ver políticas de users
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;

-- Ver políticas de pet
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'pet'
ORDER BY policyname;

-- Ver políticas de appoinment
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'appoinment'
ORDER BY policyname;

-- ============================================
-- VERIFICAR TABLAS CON RLS HABILITADO
-- ============================================
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = true
ORDER BY tablename;

-- ============================================
-- INSTRUCCIONES POST-EJECUCIÓN
-- ============================================
-- 1. Ejecuta este script completo en Supabase SQL Editor
-- 2. Verifica que no haya errores en la ejecución
-- 3. Ejecuta las queries de verificación al final
-- 4. Ve a Security Advisor y verifica que los errores desaparezcan
-- 5. Si persisten errores, compártelos para una solución específica
-- ============================================