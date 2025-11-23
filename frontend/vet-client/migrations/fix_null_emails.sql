-- ============================================
-- SCRIPT PARA CORREGIR EMAILS NULL
-- Actualiza los emails en la tabla users desde auth.users
-- ============================================

-- Verificar cuántos usuarios tienen email NULL
SELECT
    COUNT(*) as usuarios_sin_email,
    'Usuarios con email NULL en la tabla users' as descripcion
FROM users
WHERE email IS NULL;

-- ============================================

-- Actualizar emails NULL con los datos de auth.users
UPDATE users u
SET email = au.email
FROM auth.users au
WHERE u.auth_id = au.id
  AND u.email IS NULL;

-- ============================================

-- Verificar el resultado
SELECT
    u.id,
    u.auth_id,
    u.name,
    u.email as email_en_users,
    au.email as email_en_auth,
    u.phone,
    u.role,
    u.created_at
FROM users u
LEFT JOIN auth.users au ON u.auth_id = au.id
ORDER BY u.created_at DESC
LIMIT 10;

-- ============================================
-- REPORTE FINAL
-- ============================================
SELECT
    COUNT(*) as total_usuarios,
    COUNT(email) as usuarios_con_email,
    COUNT(*) - COUNT(email) as usuarios_sin_email
FROM users;

-- ============================================
-- NOTAS
-- ============================================
-- Este script:
-- 1. Muestra cuántos usuarios tienen email NULL
-- 2. Los actualiza con el email de auth.users
-- 3. Muestra los últimos 10 usuarios registrados
-- 4. Muestra un reporte final con estadísticas
--
-- Ejecuta este script en el SQL Editor de Supabase
-- después de aplicar el trigger en create_user_trigger.sql
