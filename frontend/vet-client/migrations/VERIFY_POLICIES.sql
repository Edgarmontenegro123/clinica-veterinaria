-- ============================================
-- VERIFICAR QUE LAS POLÍTICAS FUNCIONAN
-- ============================================

-- 1. Ver cuántas políticas se crearon
SELECT
    tablename,
    COUNT(*) as total_politicas
FROM pg_policies
WHERE tablename IN ('users', 'pet')
GROUP BY tablename
ORDER BY tablename;

-- 2. Ver todas las políticas de pet con detalles
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

-- 3. Ver todas las políticas de users
SELECT
    policyname,
    cmd as operacion
FROM pg_policies
WHERE tablename = 'users'
ORDER BY cmd, policyname;

-- 4. Verificar que la función existe
SELECT
    routine_name,
    routine_type,
    security_type
FROM information_schema.routines
WHERE routine_name = 'get_user_role';

-- 5. Probar la función (ejecutar como tu usuario)
SELECT get_user_role() as mi_rol;

-- 6. Ver cuántas mascotas hay
SELECT
    CASE
        WHEN has_owner = true THEN 'Con dueño'
        WHEN has_owner = false THEN 'En adopción'
    END as tipo,
    CASE
        WHEN is_active = true THEN 'Activa'
        WHEN is_active = false THEN 'Inactiva'
    END as estado,
    COUNT(*) as total
FROM pet
GROUP BY has_owner, is_active
ORDER BY has_owner DESC, is_active DESC;

-- ============================================
-- COMPARTE TODOS ESTOS RESULTADOS
-- ============================================
