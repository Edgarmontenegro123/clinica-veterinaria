-- ============================================
-- CORRECCIÓN DE POLÍTICAS RLS PARA ACCESO A MASCOTAS
-- Soluciona el problema donde usuarios no pueden ver sus mascotas
-- ============================================
-- EJECUTAR EN: Supabase Dashboard > SQL Editor > New Query
-- Fecha: 2025-12-17
-- ============================================

-- ============================================
-- TABLA: users - ELIMINAR Y RECREAR POLÍTICAS
-- ============================================

DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Allow user creation during signup" ON users;

-- SELECT: Usuarios pueden ver su propio perfil
CREATE POLICY "Users can view their own profile" ON users
FOR SELECT
USING (auth.uid() = auth_id);

-- SELECT: Admins pueden ver todos los usuarios (IMPORTANTE para JOIN en pets)
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
-- TABLA: pet - ELIMINAR POLÍTICAS ANTIGUAS
-- ============================================

DROP POLICY IF EXISTS "Users can view their own pets" ON pet;
DROP POLICY IF EXISTS "Users can insert their own pets" ON pet;
DROP POLICY IF EXISTS "Users can update their own pets" ON pet;
DROP POLICY IF EXISTS "Users can delete their own pets" ON pet;
DROP POLICY IF EXISTS "Admins can view all pets" ON pet;
DROP POLICY IF EXISTS "Admins can view all owned pets" ON pet;
DROP POLICY IF EXISTS "Admins can insert pets" ON pet;
DROP POLICY IF EXISTS "Admins can insert adoption pets" ON pet;
DROP POLICY IF EXISTS "Admins can insert owned pets" ON pet;
DROP POLICY IF EXISTS "Admins can update all pets" ON pet;
DROP POLICY IF EXISTS "admin_can_delete_pets" ON pet;
DROP POLICY IF EXISTS "Anyone can view adoption pets" ON pet;

-- ============================================
-- TABLA: pet - NUEVAS POLÍTICAS CORREGIDAS
-- ============================================

-- SELECT: Usuarios pueden ver sus propias mascotas (user_id es el auth_id de Supabase)
CREATE POLICY "Users can view their own pets" ON pet
FOR SELECT
USING (
  auth.uid() = user_id
  AND has_owner = true
  AND is_active = true
);

-- SELECT: Admins pueden ver todas las mascotas CON dueño (activas e inactivas)
CREATE POLICY "Admins can view all owned pets" ON pet
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND users.role = 'admin'
  )
  AND has_owner = true
);

-- SELECT: Cualquier usuario autenticado puede ver mascotas en adopción
CREATE POLICY "Anyone can view adoption pets" ON pet
FOR SELECT
USING (
  auth.role() = 'authenticated'
  AND has_owner = false
  AND is_active = true
);

-- INSERT: Usuarios pueden agregar sus propias mascotas
CREATE POLICY "Users can insert their own pets" ON pet
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND has_owner = true
);

-- INSERT: Admins pueden agregar mascotas en adopción (sin dueño)
CREATE POLICY "Admins can insert adoption pets" ON pet
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND users.role = 'admin'
  )
  AND has_owner = false
  AND user_id IS NULL
);

-- INSERT: Admins pueden agregar mascotas con dueño
CREATE POLICY "Admins can insert owned pets" ON pet
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND users.role = 'admin'
  )
  AND has_owner = true
);

-- UPDATE: Usuarios pueden actualizar sus propias mascotas
CREATE POLICY "Users can update their own pets" ON pet
FOR UPDATE
USING (
  auth.uid() = user_id
  AND has_owner = true
)
WITH CHECK (
  auth.uid() = user_id
  AND has_owner = true
);

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

-- DELETE: Usuarios pueden desactivar (soft delete) sus propias mascotas
CREATE POLICY "Users can delete their own pets" ON pet
FOR DELETE
USING (
  auth.uid() = user_id
  AND has_owner = true
);

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
-- VERIFICACIÓN DE POLÍTICAS
-- ============================================

-- Ver todas las políticas de la tabla users
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'users'
ORDER BY cmd, policyname;

-- Ver todas las políticas de la tabla pet
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'pet'
ORDER BY cmd, policyname;

-- ============================================
-- PRUEBAS DE ACCESO (OPCIONAL)
-- ============================================

-- Verifica que RLS esté habilitado
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'pet';

-- Cuenta mascotas por tipo
SELECT
  has_owner,
  is_active,
  COUNT(*) as total
FROM pet
GROUP BY has_owner, is_active
ORDER BY has_owner, is_active;

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================
-- 1. user_id en la tabla pet es el auth.uid() de Supabase Auth
-- 2. Las mascotas con has_owner = false son para adopción
-- 3. Las mascotas con has_owner = true tienen un dueño específico
-- 4. Solo los usuarios autenticados pueden ver mascotas en adopción
-- 5. Los usuarios solo pueden ver sus propias mascotas activas
-- 6. Los admins pueden ver todas las mascotas con dueño (activas e inactivas)
-- 7. La política de users permite que admins vean todos los perfiles (necesario para el JOIN)
-- ============================================

-- ============================================
-- PRUEBA DESPUÉS DE EJECUTAR
-- ============================================
-- Para probar como admin:
-- 1. Inicia sesión como admin
-- 2. Ve a "Mis Mascotas"
-- 3. Deberías ver TODAS las mascotas con dueño
-- 4. Ve a "Adopciones"
-- 5. Deberías ver todas las mascotas sin dueño
-- ============================================
