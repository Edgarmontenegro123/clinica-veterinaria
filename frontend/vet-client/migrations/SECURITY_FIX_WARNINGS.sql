-- ============================================
-- FIX PARA WARNINGS DE SEGURIDAD
-- Para funciones sin search_path fijo
-- ============================================
-- EJECUTAR EN: Supabase Dashboard > SQL Editor > New Query
-- Fecha: 2025-12-17
-- IMPORTANTE: Ejecuta este script DESPUÉS de todos los anteriores
-- ============================================

-- ============================================
-- WARNING 1 y 2: Funciones sin search_path fijo
-- ============================================

-- Agregar search_path fijo a la función handle_new_user
ALTER FUNCTION public.handle_new_user()
SET search_path = public, pg_temp;

-- Agregar search_path fijo a la función on_auth_user_created
ALTER FUNCTION public.on_auth_user_created()
SET search_path = public, pg_temp;

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Verificar que las funciones tienen search_path configurado
SELECT
    p.proname AS function_name,
    pg_get_function_arguments(p.oid) AS arguments,
    CASE
        WHEN p.proconfig IS NOT NULL THEN 'search_path configured'
        ELSE 'search_path NOT configured'
    END AS search_path_status,
    p.proconfig AS configuration
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname IN ('handle_new_user', 'on_auth_user_created')
ORDER BY p.proname;

-- ============================================
-- INSTRUCCIONES POST-EJECUCIÓN
-- ============================================
-- 1. Ejecuta este script en Supabase SQL Editor
-- 2. Verifica que no haya errores
-- 3. Revisa las queries de verificación
-- 4. Ve a Security Advisor y confirma que los warnings desaparezcan
--
-- NOTA SOBRE WARNING 3 (Leaked Password Protection):
-- Este warning se resuelve desde el Dashboard de Supabase:
-- 1. Ve a Authentication > Policies
-- 2. Busca "Password Protection"
-- 3. Habilita "Leaked Password Protection"
-- ============================================