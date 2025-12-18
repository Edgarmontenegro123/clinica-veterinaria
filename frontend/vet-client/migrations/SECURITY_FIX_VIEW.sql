-- ============================================
-- FIX PARA VISTAS CON SECURITY DEFINER
-- Para las vistas: pet_appointment_summary, available_appointments_stats
-- ============================================
-- EJECUTAR EN: Supabase Dashboard > SQL Editor > New Query
-- Fecha: 2025-12-17
-- IMPORTANTE: Ejecuta este script DESPUÉS de los otros tres scripts
-- ============================================

-- ============================================
-- VISTA 1: pet_appointment_summary
-- ============================================

-- Eliminar la vista existente
DROP VIEW IF EXISTS pet_appointment_summary;

-- Recrear la vista sin SECURITY DEFINER (usa SECURITY INVOKER por defecto)
CREATE VIEW pet_appointment_summary AS
SELECT
    p.id AS pet_id,
    p.name AS pet_name,
    p.species,
    p.breed,
    p.user_id,
    COUNT(a.id) AS total_appointments,
    COUNT(CASE WHEN a.status = 'pending' THEN 1 END) AS pending_appointments,
    COUNT(CASE WHEN a.status = 'confirmed' THEN 1 END) AS confirmed_appointments,
    COUNT(CASE WHEN a.status = 'cancelled' THEN 1 END) AS cancelled_appointments,
    MAX(a.datetime) AS last_appointment_date
FROM pet p
LEFT JOIN appoinment a ON p.id = a.pet_id
GROUP BY p.id, p.name, p.species, p.breed, p.user_id;

-- Aplicar SECURITY INVOKER
ALTER VIEW pet_appointment_summary SET (security_invoker = true);

-- ============================================
-- VISTA 2: available_appointments_stats
-- ============================================

-- Eliminar la vista existente
DROP VIEW IF EXISTS available_appointments_stats;

-- Recrear la vista sin SECURITY DEFINER
-- NOTA: Esta es una suposición de la estructura. Ajusta según necesidad.
CREATE VIEW available_appointments_stats AS
SELECT
    DATE(datetime) AS appointment_date,
    COUNT(*) AS total_slots,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) AS available_slots,
    COUNT(CASE WHEN status = 'confirmed' THEN 1 END) AS confirmed_slots,
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) AS cancelled_slots
FROM appoinment
WHERE datetime >= CURRENT_DATE
GROUP BY DATE(datetime)
ORDER BY appointment_date;

-- Aplicar SECURITY INVOKER
ALTER VIEW available_appointments_stats SET (security_invoker = true);

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Verificar que la vista se creó correctamente
SELECT viewname, definition
FROM pg_views
WHERE schemaname = 'public'
AND viewname = 'pet_appointment_summary';

-- Verificar que no tiene SECURITY DEFINER
SELECT viewname,
       CASE
           WHEN viewowner = current_user THEN 'SECURITY INVOKER'
           ELSE 'SECURITY DEFINER'
       END AS security_type
FROM pg_views
WHERE schemaname = 'public'
AND viewname = 'pet_appointment_summary';

-- ============================================
-- INSTRUCCIONES POST-EJECUCIÓN
-- ============================================
-- 1. Si la consulta SELECT de la vista no coincide con tu estructura,
--    necesitarás obtener la definición actual de la vista primero:
--
--    SELECT definition FROM pg_views
--    WHERE viewname = 'pet_appointment_summary';
--
-- 2. Copia la definición y reemplázala en este script
-- 3. Ejecuta el script actualizado
-- 4. Ve a Security Advisor y verifica que el error desaparezca
-- ============================================