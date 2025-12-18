-- ============================================
-- POLÍTICAS RLS PARA TABLA DE AUDITORÍA
-- Para la tabla: appoinment_audit
-- ============================================
-- EJECUTAR EN: Supabase Dashboard > SQL Editor > New Query
-- Fecha: 2025-12-17
-- IMPORTANTE: Ejecuta este script DESPUÉS de los otros dos scripts
-- ============================================

-- ============================================
-- TABLA: appoinment_audit (Auditoría de Turnos)
-- ============================================
ALTER TABLE appoinment_audit ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Admins can view all audit logs" ON appoinment_audit;
DROP POLICY IF EXISTS "Admins can insert audit logs" ON appoinment_audit;
DROP POLICY IF EXISTS "Users can view their own audit logs" ON appoinment_audit;

-- SELECT: Admins pueden ver todos los registros de auditoría
CREATE POLICY "Admins can view all audit logs" ON appoinment_audit
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND users.role = 'admin'
  )
);

-- SELECT: Usuarios pueden ver auditorías de sus propios turnos
CREATE POLICY "Users can view their own audit logs" ON appoinment_audit
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM appoinment
    WHERE appoinment.id = appoinment_audit.appoinment_id
    AND appoinment.user_id = auth.uid()
  )
);

-- INSERT: Solo el sistema puede insertar registros de auditoría
-- Esta política permite INSERT solo a usuarios autenticados (generalmente triggers)
CREATE POLICY "System can insert audit logs" ON appoinment_audit
FOR INSERT
WITH CHECK (true);

-- NOTA: No se permiten UPDATE ni DELETE en tablas de auditoría
-- Los registros de auditoría deben ser inmutables

-- ============================================
-- VERIFICACIÓN DE POLÍTICAS
-- ============================================

-- Ver políticas de appoinment_audit
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'appoinment_audit'
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
-- 4. Ve a Security Advisor y confirma que TODOS los errores desaparezcan
-- ============================================