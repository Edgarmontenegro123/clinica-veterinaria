-- ============================================
-- SOLUCIÓN ALTERNATIVA PARA POLÍTICAS RLS
-- Usa un enfoque más simple y directo
-- ============================================
-- EJECUTAR EN: Supabase Dashboard > SQL Editor > New Query
-- Fecha: 2025-12-17
-- ============================================

-- ============================================
-- PASO 1: DESHABILITAR RLS TEMPORALMENTE
-- ============================================
ALTER TABLE pet DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- ============================================
-- PASO 2: ELIMINAR TODAS LAS POLÍTICAS
-- ============================================

-- Políticas de users
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Allow user creation during signup" ON users;

-- Políticas de pet
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
-- PASO 3: CREAR FUNCIÓN HELPER PARA VERIFICAR SI ES ADMIN
-- ============================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE auth_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PASO 4: POLÍTICAS PARA USERS
-- ============================================

-- SELECT: Usuarios pueden ver su propio perfil
CREATE POLICY "users_select_own" ON users
FOR SELECT
USING (auth.uid() = auth_id);

-- SELECT: Admins pueden ver todos los usuarios
CREATE POLICY "users_select_admin" ON users
FOR SELECT
USING (is_admin());

-- UPDATE: Usuarios pueden actualizar su propio perfil
CREATE POLICY "users_update_own" ON users
FOR UPDATE
USING (auth.uid() = auth_id)
WITH CHECK (auth.uid() = auth_id);

-- UPDATE: Admins pueden actualizar cualquier usuario
CREATE POLICY "users_update_admin" ON users
FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

-- INSERT: Permitir creación durante signup
CREATE POLICY "users_insert_signup" ON users
FOR INSERT
WITH CHECK (auth.uid() = auth_id);

-- ============================================
-- PASO 5: POLÍTICAS PARA PET
-- ============================================

-- SELECT: Usuarios ven sus propias mascotas activas
CREATE POLICY "pet_select_own" ON pet
FOR SELECT
USING (
  auth.uid() = user_id
  AND has_owner = true
  AND is_active = true
);

-- SELECT: Admins ven todas las mascotas con dueño
CREATE POLICY "pet_select_admin_owned" ON pet
FOR SELECT
USING (
  is_admin() AND has_owner = true
);

-- SELECT: Todos ven mascotas en adopción
CREATE POLICY "pet_select_adoption" ON pet
FOR SELECT
USING (
  has_owner = false
  AND is_active = true
);

-- INSERT: Usuarios pueden agregar sus mascotas
CREATE POLICY "pet_insert_own" ON pet
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND has_owner = true
);

-- INSERT: Admins pueden agregar mascotas en adopción
CREATE POLICY "pet_insert_admin_adoption" ON pet
FOR INSERT
WITH CHECK (
  is_admin()
  AND has_owner = false
  AND user_id IS NULL
);

-- INSERT: Admins pueden agregar mascotas con dueño
CREATE POLICY "pet_insert_admin_owned" ON pet
FOR INSERT
WITH CHECK (
  is_admin()
  AND has_owner = true
);

-- UPDATE: Usuarios actualizan sus mascotas
CREATE POLICY "pet_update_own" ON pet
FOR UPDATE
USING (
  auth.uid() = user_id
  AND has_owner = true
)
WITH CHECK (
  auth.uid() = user_id
  AND has_owner = true
);

-- UPDATE: Admins actualizan cualquier mascota
CREATE POLICY "pet_update_admin" ON pet
FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

-- DELETE: Usuarios pueden desactivar sus mascotas
CREATE POLICY "pet_delete_own" ON pet
FOR DELETE
USING (
  auth.uid() = user_id
  AND has_owner = true
);

-- DELETE: Admins pueden eliminar cualquier mascota
CREATE POLICY "pet_delete_admin" ON pet
FOR DELETE
USING (is_admin());

-- ============================================
-- PASO 6: HABILITAR RLS
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet ENABLE ROW LEVEL SECURITY;

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Ver políticas de users
SELECT
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename = 'users'
ORDER BY cmd, policyname;

-- Ver políticas de pet
SELECT
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename = 'pet'
ORDER BY cmd, policyname;

-- Verificar función
SELECT is_admin() as soy_admin;

-- Ver estado RLS
SELECT
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename IN ('users', 'pet');

-- ============================================
-- NOTAS:
-- ============================================
-- Este script usa una función SECURITY DEFINER que permite
-- verificar el rol de admin de manera más confiable.
-- Las políticas son más simples y directas.
-- ============================================
