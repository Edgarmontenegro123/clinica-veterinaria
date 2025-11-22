-- ============================================
-- POLÍTICA RLS PARA ELIMINAR MASCOTAS (ADMIN)
-- ============================================
-- Este script crea una política RLS que permite a los administradores
-- eliminar permanentemente mascotas de la tabla 'pet'

-- IMPORTANTE: Ejecuta este código en el SQL Editor de Supabase
-- Dashboard de Supabase > SQL Editor > New Query > Pega este código > Run

-- ============================================
-- PASO 1: Eliminar política existente si existe
-- ============================================
DROP POLICY IF EXISTS "admin_can_delete_pets" ON pet;

-- ============================================
-- PASO 2: Crear nueva política DELETE para admin
-- ============================================
CREATE POLICY "admin_can_delete_pets"
ON pet
FOR DELETE
USING (
    EXISTS (
        SELECT 1
        FROM users
        WHERE users.auth_id = auth.uid()
        AND users.role = 'admin'
    )
);

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Para verificar que la política se creó correctamente, ejecuta:
-- SELECT * FROM pg_policies WHERE tablename = 'pet' AND policyname = 'admin_can_delete_pets';

-- ============================================
-- EXPLICACIÓN
-- ============================================
-- Esta política permite DELETE en la tabla 'pet' solo si:
-- 1. El usuario está autenticado (auth.uid() devuelve un valor)
-- 2. El usuario tiene role = 'admin' en la tabla 'users'
-- 3. El auth_id en la tabla 'users' coincide con el auth.uid() del usuario actual
