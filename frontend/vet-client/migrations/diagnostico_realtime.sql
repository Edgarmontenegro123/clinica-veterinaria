-- ============================================
-- SCRIPT DE DIAGNÓSTICO PARA REALTIME
-- Ejecuta este script para verificar la configuración
-- ============================================

-- 1. VERIFICAR SI REALTIME ESTÁ HABILITADO
SELECT
    'Realtime habilitado' as diagnostico,
    COUNT(*) as total_tablas,
    string_agg(tablename, ', ') as tablas
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
  AND tablename = 'appoinment';

-- Si el resultado tiene total_tablas = 0, entonces Realtime NO está habilitado
-- Si total_tablas = 1 y tablas = 'appoinment', entonces SÍ está habilitado

-- ============================================

-- 2. VERIFICAR POLÍTICAS RLS
SELECT
    policyname as "Nombre de Política",
    cmd as "Operación",
    CASE
        WHEN qual IS NOT NULL THEN 'Tiene condición USING'
        ELSE 'Sin condición USING'
    END as "Estado USING",
    CASE
        WHEN with_check IS NOT NULL THEN 'Tiene condición WITH CHECK'
        ELSE 'Sin condición WITH CHECK'
    END as "Estado WITH CHECK"
FROM pg_policies
WHERE tablename = 'appoinment'
ORDER BY cmd, policyname;

-- Deberías ver al menos:
-- - 2 políticas para SELECT (una para users, una para admins)
-- - 2 políticas para UPDATE (una para users, una para admins)

-- ============================================

-- 3. VERIFICAR SI RLS ESTÁ HABILITADO EN LA TABLA
SELECT
    schemaname,
    tablename,
    rowsecurity as "RLS Habilitado"
FROM pg_tables
WHERE tablename = 'appoinment';

-- Si RLS Habilitado = false, ejecuta: ALTER TABLE appoinment ENABLE ROW LEVEL SECURITY;

-- ============================================

-- 4. VERIFICAR ESTRUCTURA DE LA TABLA appoinment
SELECT
    column_name as "Columna",
    data_type as "Tipo",
    is_nullable as "Permite NULL"
FROM information_schema.columns
WHERE table_name = 'appoinment'
  AND column_name IN ('id', 'user_id', 'status', 'cancelled_by', 'cancelled_at')
ORDER BY ordinal_position;

-- Verifica que existan las columnas: status, cancelled_by, cancelled_at

-- ============================================

-- 5. VERIFICAR ESTRUCTURA DE LA TABLA users
SELECT
    column_name as "Columna",
    data_type as "Tipo"
FROM information_schema.columns
WHERE table_name = 'users'
  AND column_name IN ('id', 'auth_id', 'role')
ORDER BY ordinal_position;

-- Verifica que existan las columnas: auth_id (UUID) y role (VARCHAR)

-- ============================================

-- 6. PROBAR POLÍTICAS RLS (ejecuta como usuario normal, NO como admin)
-- Esta query debería devolver solo tus turnos si eres usuario
-- O todos los turnos si eres admin
SELECT
    id,
    user_id,
    status,
    cancelled_by,
    datetime
FROM appoinment
WHERE status IS NULL OR status = 'cancelled'
ORDER BY datetime DESC
LIMIT 5;

-- ============================================

-- RESUMEN DE DIAGNÓSTICO:
-- Si todos los puntos anteriores muestran resultados correctos pero
-- el Realtime no funciona, entonces el problema está en:
-- 1. La suscripción del frontend (verifica la consola del navegador)
-- 2. El token de autenticación del usuario
-- 3. La configuración del cliente de Supabase

-- ============================================
