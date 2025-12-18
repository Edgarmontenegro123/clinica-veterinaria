-- ============================================
-- SOLUCIÓN SIMPLE Y DIRECTA PARA RLS
-- Sin recursión, políticas claras
-- ============================================
-- EJECUTAR EN: Supabase Dashboard > SQL Editor
-- Fecha: 2025-12-17
-- ============================================

-- ============================================
-- LIMPIAR TODO
-- ============================================

-- Deshabilitar RLS temporalmente
ALTER TABLE pet DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Eliminar función si existe
DROP FUNCTION IF EXISTS is_admin();

-- Eliminar todas las políticas de users
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'users') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON users';
    END LOOP;
END $$;

-- Eliminar todas las políticas de pet
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'pet') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON pet';
    END LOOP;
END $$;

-- ============================================
-- CREAR FUNCIÓN PARA OBTENER ROL DEL USUARIO
-- ============================================
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
-- POLÍTICAS PARA TABLA users
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

-- ============================================
-- POLÍTICAS PARA TABLA pet
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
-- HABILITAR RLS
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet ENABLE ROW LEVEL SECURITY;

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Contar políticas creadas
SELECT
    'users' as tabla,
    COUNT(*) as total_politicas
FROM pg_policies
WHERE tablename = 'users'
UNION ALL
SELECT
    'pet' as tabla,
    COUNT(*) as total_politicas
FROM pg_policies
WHERE tablename = 'pet';

-- Ver todas las políticas de pet
SELECT
    policyname,
    cmd,
    CASE
        WHEN policyname LIKE '%admin%' THEN 'ADMIN'
        WHEN policyname LIKE '%own%' THEN 'OWNER'
        WHEN policyname LIKE '%adoption%' THEN 'ADOPTION'
        ELSE 'OTHER'
    END as tipo
FROM pg_policies
WHERE tablename = 'pet'
ORDER BY cmd, tipo, policyname;

-- Verificar RLS habilitado
SELECT
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename IN ('users', 'pet')
ORDER BY tablename;

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================
-- 1. Esta versión usa get_user_role() SECURITY DEFINER
-- 2. La función se ejecuta con privilegios elevados
-- 3. Las políticas son mutuamente excluyentes para SELECT
-- 4. Los admins tienen una política separada que no verifica user_id
-- ============================================
