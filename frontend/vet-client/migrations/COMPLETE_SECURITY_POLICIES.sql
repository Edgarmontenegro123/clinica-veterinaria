-- ============================================
-- POLÍTICAS DE SEGURIDAD COMPLETAS (RLS)
-- Sistema de Clínica Veterinaria
-- ============================================
-- EJECUTAR EN: Supabase Dashboard > SQL Editor
-- Fecha: 2025-12-17
-- Este archivo consolida todas las políticas de seguridad
-- ============================================

-- ============================================
-- SECCIÓN 1: LIMPIEZA Y PREPARACIÓN
-- ============================================

-- Deshabilitar RLS temporalmente
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE pet DISABLE ROW LEVEL SECURITY;
ALTER TABLE appoinment DISABLE ROW LEVEL SECURITY;

-- Eliminar funciones anteriores
DROP FUNCTION IF EXISTS is_admin();
DROP FUNCTION IF EXISTS get_user_role();

-- Eliminar todas las políticas existentes de users
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'users') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON users';
    END LOOP;
END $$;

-- Eliminar todas las políticas existentes de pet
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'pet') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON pet';
    END LOOP;
END $$;

-- Eliminar todas las políticas existentes de appoinment
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'appoinment') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON appoinment';
    END LOOP;
END $$;

-- ============================================
-- SECCIÓN 2: FUNCIÓN HELPER
-- ============================================

-- Función para obtener el rol del usuario actual
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role
    FROM users
    WHERE auth_id = auth.uid();

    RETURN COALESCE(user_role, 'user');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================
-- SECCIÓN 3: POLÍTICAS PARA TABLA users
-- ============================================

-- SELECT: Ver propio perfil
CREATE POLICY "select_own_profile" ON users
FOR SELECT
TO authenticated
USING (auth_id = auth.uid());

-- SELECT: Admins ven todos los perfiles
CREATE POLICY "select_all_profiles_admin" ON users
FOR SELECT
TO authenticated
USING (get_user_role() = 'admin');

-- INSERT: Crear perfil en signup
CREATE POLICY "insert_own_profile" ON users
FOR INSERT
TO authenticated
WITH CHECK (auth_id = auth.uid());

-- UPDATE: Actualizar propio perfil
CREATE POLICY "update_own_profile" ON users
FOR UPDATE
TO authenticated
USING (auth_id = auth.uid())
WITH CHECK (auth_id = auth.uid());

-- UPDATE: Admin actualiza cualquier perfil
CREATE POLICY "update_any_profile_admin" ON users
FOR UPDATE
TO authenticated
USING (get_user_role() = 'admin')
WITH CHECK (get_user_role() = 'admin');

-- DELETE: Solo admins pueden eliminar usuarios (opcional)
CREATE POLICY "delete_user_admin" ON users
FOR DELETE
TO authenticated
USING (get_user_role() = 'admin');

-- ============================================
-- SECCIÓN 4: POLÍTICAS PARA TABLA pet
-- ============================================

-- SELECT: Usuario normal ve solo sus mascotas activas
CREATE POLICY "select_own_pets" ON pet
FOR SELECT
TO authenticated
USING (
    user_id = auth.uid()
    AND has_owner = true
    AND is_active = true
    AND get_user_role() != 'admin'
);

-- SELECT: Admin ve todas las mascotas con dueño
CREATE POLICY "select_all_owned_pets_admin" ON pet
FOR SELECT
TO authenticated
USING (
    has_owner = true
    AND get_user_role() = 'admin'
);

-- SELECT: Todos ven mascotas en adopción
CREATE POLICY "select_adoption_pets" ON pet
FOR SELECT
TO authenticated
USING (
    has_owner = false
    AND is_active = true
);

-- INSERT: Usuario inserta su mascota
CREATE POLICY "insert_own_pet" ON pet
FOR INSERT
TO authenticated
WITH CHECK (
    user_id = auth.uid()
    AND has_owner = true
);

-- INSERT: Admin inserta mascota con dueño
CREATE POLICY "insert_owned_pet_admin" ON pet
FOR INSERT
TO authenticated
WITH CHECK (
    has_owner = true
    AND get_user_role() = 'admin'
);

-- INSERT: Admin inserta mascota en adopción
CREATE POLICY "insert_adoption_pet_admin" ON pet
FOR INSERT
TO authenticated
WITH CHECK (
    has_owner = false
    AND user_id IS NULL
    AND get_user_role() = 'admin'
);

-- UPDATE: Usuario actualiza su mascota
CREATE POLICY "update_own_pet" ON pet
FOR UPDATE
TO authenticated
USING (
    user_id = auth.uid()
    AND has_owner = true
)
WITH CHECK (
    user_id = auth.uid()
    AND has_owner = true
);

-- UPDATE: Admin actualiza cualquier mascota
CREATE POLICY "update_any_pet_admin" ON pet
FOR UPDATE
TO authenticated
USING (get_user_role() = 'admin')
WITH CHECK (get_user_role() = 'admin');

-- DELETE: Usuario elimina su mascota
CREATE POLICY "delete_own_pet" ON pet
FOR DELETE
TO authenticated
USING (
    user_id = auth.uid()
    AND has_owner = true
);

-- DELETE: Admin elimina cualquier mascota
CREATE POLICY "delete_any_pet_admin" ON pet
FOR DELETE
TO authenticated
USING (get_user_role() = 'admin');

-- ============================================
-- SECCIÓN 5: POLÍTICAS PARA TABLA appoinment
-- ============================================

-- SELECT: Usuario ve sus propios turnos
CREATE POLICY "select_own_appointments" ON appoinment
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- SELECT: Admin ve todos los turnos
CREATE POLICY "select_all_appointments_admin" ON appoinment
FOR SELECT
TO authenticated
USING (get_user_role() = 'admin');

-- INSERT: Usuario crea sus propios turnos
CREATE POLICY "insert_own_appointment" ON appoinment
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- INSERT: Admin crea cualquier turno
CREATE POLICY "insert_any_appointment_admin" ON appoinment
FOR INSERT
TO authenticated
WITH CHECK (get_user_role() = 'admin');

-- UPDATE: Usuario actualiza sus propios turnos
CREATE POLICY "update_own_appointment" ON appoinment
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- UPDATE: Admin actualiza cualquier turno
CREATE POLICY "update_any_appointment_admin" ON appoinment
FOR UPDATE
TO authenticated
USING (get_user_role() = 'admin')
WITH CHECK (get_user_role() = 'admin');

-- DELETE: Solo admin puede eliminar turnos
CREATE POLICY "delete_appointment_admin" ON appoinment
FOR DELETE
TO authenticated
USING (get_user_role() = 'admin');

-- ============================================
-- SECCIÓN 6: HABILITAR RLS
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet ENABLE ROW LEVEL SECURITY;
ALTER TABLE appoinment ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SECCIÓN 7: CONFIGURAR REALTIME
-- ============================================

-- Habilitar Realtime para appoinment
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS appoinment;

-- ============================================
-- SECCIÓN 8: VERIFICACIÓN
-- ============================================

-- Contar políticas creadas por tabla
SELECT
    tablename,
    COUNT(*) as total_politicas
FROM pg_policies
WHERE tablename IN ('users', 'pet', 'appoinment')
GROUP BY tablename
ORDER BY tablename;

-- Ver políticas de users
SELECT
    policyname,
    cmd as operacion
FROM pg_policies
WHERE tablename = 'users'
ORDER BY cmd, policyname;

-- Ver políticas de pet
SELECT
    policyname,
    cmd as operacion,
    CASE
        WHEN policyname LIKE '%admin%' THEN '👑 ADMIN'
        WHEN policyname LIKE '%own%' THEN '👤 OWNER'
        WHEN policyname LIKE '%adoption%' THEN '🏠 ADOPTION'
        ELSE '❓ OTHER'
    END as tipo
FROM pg_policies
WHERE tablename = 'pet'
ORDER BY cmd, policyname;

-- Ver políticas de appoinment
SELECT
    policyname,
    cmd as operacion
FROM pg_policies
WHERE tablename = 'appoinment'
ORDER BY cmd, policyname;

-- Verificar que RLS esté habilitado
SELECT
    tablename,
    CASE WHEN rowsecurity THEN '✅ HABILITADO' ELSE '❌ DESHABILITADO' END as estado_rls
FROM pg_tables
WHERE tablename IN ('users', 'pet', 'appoinment')
ORDER BY tablename;

-- Verificar función helper
SELECT
    routine_name,
    security_type
FROM information_schema.routines
WHERE routine_name = 'get_user_role';

-- Probar la función (debe retornar tu rol actual)
SELECT get_user_role() as mi_rol;

-- ============================================
-- SECCIÓN 9: NOTAS IMPORTANTES
-- ============================================
-- ✅ TABLAS PROTEGIDAS:
--    - users: Perfiles de usuarios
--    - pet: Mascotas (con y sin dueño)
--    - appoinment: Turnos médicos
--
-- ✅ FUNCIÓN HELPER:
--    - get_user_role(): Retorna 'admin' o 'user'
--    - SECURITY DEFINER: Se ejecuta con privilegios elevados
--
-- ✅ PERMISOS POR ROL:
--    USUARIOS NORMALES:
--      - Ven solo sus propias mascotas activas
--      - Ven todas las mascotas en adopción
--      - Gestionan sus propios turnos
--      - Actualizan su propio perfil
--
--    ADMINISTRADORES:
--      - Ven TODAS las mascotas con dueño (activas e inactivas)
--      - Ven todos los perfiles de usuarios
--      - Gestionan todos los turnos
--      - Crean mascotas en adopción
--      - Permisos completos sobre todas las tablas
--
-- ✅ REALTIME:
--    - Habilitado para la tabla appoinment
--    - Los usuarios reciben actualizaciones en tiempo real de sus turnos
--
-- ============================================
