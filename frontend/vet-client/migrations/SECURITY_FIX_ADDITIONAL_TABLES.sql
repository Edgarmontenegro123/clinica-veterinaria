-- ============================================
-- POLÍTICAS RLS PARA TABLAS ADICIONALES
-- Para las tablas: billing, inventory, vaccines, vaccines_applied
-- ============================================
-- EJECUTAR EN: Supabase Dashboard > SQL Editor > New Query
-- Fecha: 2025-12-17
-- IMPORTANTE: Ejecuta este script DESPUÉS de SECURITY_FIX_COMPLETE_RLS.sql
-- ============================================

-- ============================================
-- TABLA: billing (Facturación - Solo Admins)
-- ============================================
ALTER TABLE billing ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Admins can view all billing" ON billing;
DROP POLICY IF EXISTS "Admins can insert billing" ON billing;
DROP POLICY IF EXISTS "Admins can update billing" ON billing;
DROP POLICY IF EXISTS "Admins can delete billing" ON billing;

-- SELECT: Solo admins pueden ver facturación
CREATE POLICY "Admins can view all billing" ON billing
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND users.role = 'admin'
  )
);

-- INSERT: Solo admins pueden crear facturas
CREATE POLICY "Admins can insert billing" ON billing
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND users.role = 'admin'
  )
);

-- UPDATE: Solo admins pueden actualizar facturas
CREATE POLICY "Admins can update billing" ON billing
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

-- DELETE: Solo admins pueden eliminar facturas
CREATE POLICY "Admins can delete billing" ON billing
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND users.role = 'admin'
  )
);

-- ============================================
-- TABLA: inventory (Inventario - Solo Admins)
-- ============================================
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Admins can view inventory" ON inventory;
DROP POLICY IF EXISTS "Admins can insert inventory" ON inventory;
DROP POLICY IF EXISTS "Admins can update inventory" ON inventory;
DROP POLICY IF EXISTS "Admins can delete inventory" ON inventory;

-- SELECT: Solo admins pueden ver inventario
CREATE POLICY "Admins can view inventory" ON inventory
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND users.role = 'admin'
  )
);

-- INSERT: Solo admins pueden agregar items al inventario
CREATE POLICY "Admins can insert inventory" ON inventory
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND users.role = 'admin'
  )
);

-- UPDATE: Solo admins pueden actualizar inventario
CREATE POLICY "Admins can update inventory" ON inventory
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

-- DELETE: Solo admins pueden eliminar items del inventario
CREATE POLICY "Admins can delete inventory" ON inventory
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND users.role = 'admin'
  )
);

-- ============================================
-- TABLA: vaccines (Catálogo de Vacunas)
-- ============================================
ALTER TABLE vaccines ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Users can view vaccines" ON vaccines;
DROP POLICY IF EXISTS "Admins can view vaccines" ON vaccines;
DROP POLICY IF EXISTS "Admins can insert vaccines" ON vaccines;
DROP POLICY IF EXISTS "Admins can update vaccines" ON vaccines;
DROP POLICY IF EXISTS "Admins can delete vaccines" ON vaccines;

-- SELECT: Usuarios autenticados pueden ver el catálogo de vacunas
CREATE POLICY "Users can view vaccines" ON vaccines
FOR SELECT
USING (auth.role() = 'authenticated');

-- INSERT: Solo admins pueden agregar vacunas al catálogo
CREATE POLICY "Admins can insert vaccines" ON vaccines
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND users.role = 'admin'
  )
);

-- UPDATE: Solo admins pueden actualizar vacunas
CREATE POLICY "Admins can update vaccines" ON vaccines
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

-- DELETE: Solo admins pueden eliminar vacunas
CREATE POLICY "Admins can delete vaccines" ON vaccines
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND users.role = 'admin'
  )
);

-- ============================================
-- TABLA: vaccines_applied (Vacunas Aplicadas)
-- ============================================
ALTER TABLE vaccines_applied ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Users can view vaccines of their pets" ON vaccines_applied;
DROP POLICY IF EXISTS "Admins can view all vaccines applied" ON vaccines_applied;
DROP POLICY IF EXISTS "Admins can insert vaccines applied" ON vaccines_applied;
DROP POLICY IF EXISTS "Admins can update vaccines applied" ON vaccines_applied;
DROP POLICY IF EXISTS "Admins can delete vaccines applied" ON vaccines_applied;

-- SELECT: Usuarios pueden ver vacunas aplicadas a sus mascotas
CREATE POLICY "Users can view vaccines of their pets" ON vaccines_applied
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM pet
    WHERE pet.id = vaccines_applied.pet_id
    AND pet.user_id = auth.uid()
  )
);

-- SELECT: Admins pueden ver todas las vacunas aplicadas
CREATE POLICY "Admins can view all vaccines applied" ON vaccines_applied
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND users.role = 'admin'
  )
);

-- INSERT: Solo admins pueden registrar vacunas aplicadas
CREATE POLICY "Admins can insert vaccines applied" ON vaccines_applied
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND users.role = 'admin'
  )
);

-- UPDATE: Solo admins pueden actualizar vacunas aplicadas
CREATE POLICY "Admins can update vaccines applied" ON vaccines_applied
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

-- DELETE: Solo admins pueden eliminar registros de vacunas aplicadas
CREATE POLICY "Admins can delete vaccines applied" ON vaccines_applied
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

-- Ver políticas de billing
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'billing'
ORDER BY policyname;

-- Ver políticas de inventory
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'inventory'
ORDER BY policyname;

-- Ver políticas de vaccines
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'vaccines'
ORDER BY policyname;

-- Ver políticas de vaccines_applied
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'vaccines_applied'
ORDER BY policyname;

-- ============================================
-- VERIFICAR TODAS LAS TABLAS CON RLS
-- ============================================
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = true
ORDER BY tablename;

-- ============================================
-- INSTRUCCIONES POST-EJECUCIÓN
-- ============================================
-- 1. Ejecuta este script en Supabase SQL Editor
-- 2. Verifica que no haya errores
-- 3. Revisa las queries de verificación
-- 4. Ve a Security Advisor y confirma que los errores desaparezcan
-- ============================================