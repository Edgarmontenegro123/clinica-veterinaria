-- ============================================
-- OBTENER DEFINICIÓN DE LAS VISTAS
-- ============================================
-- EJECUTAR PRIMERO: Para ver la definición actual de las vistas
-- antes de recrearlas
-- ============================================

-- Ver la definición completa de AMBAS vistas
SELECT
    schemaname,
    viewname,
    viewowner,
    definition
FROM pg_views
WHERE schemaname = 'public'
AND viewname IN ('pet_appointment_summary', 'available_appointments_stats')
ORDER BY viewname;

-- Ver información adicional sobre las vistas
SELECT
    table_name,
    view_definition
FROM information_schema.views
WHERE table_schema = 'public'
AND table_name IN ('pet_appointment_summary', 'available_appointments_stats')
ORDER BY table_name;

-- ============================================
-- INSTRUCCIONES
-- ============================================
-- 1. Ejecuta esta consulta en Supabase SQL Editor
-- 2. Copia las definiciones (columna 'definition') de AMBAS vistas
-- 3. Compártelas para actualizar el script SECURITY_FIX_VIEW.sql si es necesario
-- ============================================