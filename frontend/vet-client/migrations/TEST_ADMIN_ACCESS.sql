-- ============================================
-- PRUEBA RÁPIDA DE ACCESO COMO ADMIN
-- ============================================
-- Este script simula el acceso de un admin
-- REEMPLAZA 'ae4f5904-04e0-410a-9f72-495599f21811' con tu auth_id de admin
-- ============================================

-- Configurar el contexto como el usuario admin
-- IMPORTANTE: Reemplaza con tu auth_id real del admin
SET LOCAL role TO authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "ae4f5904-04e0-410a-9f72-495599f21811"}';

-- Verificar si eres admin
SELECT
    EXISTS (
        SELECT 1 FROM users
        WHERE auth_id = 'ae4f5904-04e0-410a-9f72-495599f21811'
        AND role = 'admin'
    ) as soy_admin;

-- Intentar ver todas las mascotas como lo haría el admin
SELECT
    p.*,
    u.name as owner_name,
    u.email as owner_email
FROM pet p
LEFT JOIN users u ON p.user_id = u.auth_id
WHERE p.has_owner = true
ORDER BY p.is_active DESC;

-- Ver solo las mascotas (sin JOIN) para comparar
SELECT *
FROM pet
WHERE has_owner = true;

-- Ver mascotas en adopción
SELECT *
FROM pet
WHERE has_owner = false;

-- ============================================
-- Si estas consultas funcionan, el problema está
-- en cómo se aplican las políticas RLS
-- ============================================
