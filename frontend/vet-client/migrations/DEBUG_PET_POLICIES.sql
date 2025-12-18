-- ============================================
-- SCRIPT DE DIAGNÓSTICO PARA POLÍTICAS RLS
-- ============================================
-- EJECUTAR EN: Supabase Dashboard > SQL Editor
-- Este script te ayudará a diagnosticar el problema
-- ============================================

-- 1. Ver la estructura de la tabla pet
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'pet'
ORDER BY ordinal_position;

-- 2. Ver una muestra de datos de la tabla pet
SELECT
    id,
    name,
    user_id,
    has_owner,
    is_active
FROM pet
LIMIT 5;

-- 3. Ver si RLS está habilitado
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename IN ('pet', 'users');

-- 4. Ver TODAS las políticas actuales de pet
SELECT
    schemaname,
    tablename,
    policyname,
    cmd,
    permissive,
    roles,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'pet'
ORDER BY cmd, policyname;

-- 5. Ver TODAS las políticas actuales de users
SELECT
    schemaname,
    tablename,
    policyname,
    cmd,
    permissive,
    roles
FROM pg_policies
WHERE tablename = 'users'
ORDER BY cmd, policyname;

-- 6. Ver cuántas mascotas hay por tipo
SELECT
    has_owner,
    is_active,
    COUNT(*) as total
FROM pet
GROUP BY has_owner, is_active;

-- 7. Ver usuarios admin
SELECT
    id,
    name,
    email,
    role,
    auth_id
FROM users
WHERE role = 'admin';

-- ============================================
-- INSTRUCCIONES:
-- ============================================
-- 1. Ejecuta este script completo
-- 2. Copia TODOS los resultados
-- 3. Comparte los resultados conmigo
-- ============================================
