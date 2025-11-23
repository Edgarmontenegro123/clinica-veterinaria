-- ============================================
-- AGREGAR POLÍTICA RLS PARA ELIMINAR TURNOS
-- Solo admins pueden eliminar turnos permanentemente
-- ============================================

-- Verificar que la política no exista antes de crearla
-- Si ya existe, comentar la siguiente línea:
DROP POLICY IF EXISTS "Admins can delete appointments" ON appoinment;

-- Crear política para que los admins puedan eliminar cualquier turno
CREATE POLICY "Admins can delete appointments" ON appoinment
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND users.role = 'admin'
  )
);

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Para verificar que la política se creó correctamente:
-- SELECT * FROM pg_policies WHERE tablename = 'appoinment' AND cmd = 'DELETE';
