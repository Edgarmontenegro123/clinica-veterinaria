-- ============================================
-- CONFIGURACIÓN COMPLETA DE REALTIME Y RLS
-- Para el sistema de cancelación de turnos
-- ============================================

-- PASO 1: Habilitar Realtime para la tabla appoinment
ALTER PUBLICATION supabase_realtime ADD TABLE appoinment;

-- PASO 2: Verificar que RLS esté habilitado
ALTER TABLE appoinment ENABLE ROW LEVEL SECURITY;

-- PASO 3: Eliminar políticas antiguas si existen (opcional, comentar si no es necesario)
-- DROP POLICY IF EXISTS "Users can view their own appointments" ON appoinment;
-- DROP POLICY IF EXISTS "Users can insert their own appointments" ON appoinment;
-- DROP POLICY IF EXISTS "Users can update their own appointments" ON appoinment;
-- DROP POLICY IF EXISTS "Admins can view all appointments" ON appoinment;
-- DROP POLICY IF EXISTS "Admins can update all appointments" ON appoinment;

-- PASO 4: Crear políticas RLS para SELECT (lectura en tiempo real)
-- Política para que los usuarios puedan ver sus propios turnos
CREATE POLICY "Users can view their own appointments" ON appoinment
FOR SELECT
USING (
  auth.uid() = user_id
);

-- Política para que los admins puedan ver todos los turnos
CREATE POLICY "Admins can view all appointments" ON appoinment
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND users.role = 'admin'
  )
);

-- PASO 5: Crear políticas RLS para INSERT (crear turnos)
CREATE POLICY "Users can insert their own appointments" ON appoinment
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
);

CREATE POLICY "Admins can insert any appointment" ON appoinment
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND users.role = 'admin'
  )
);

-- PASO 6: Crear políticas RLS para UPDATE (cancelar turnos) - ¡IMPORTANTE!
-- Política para que los usuarios puedan cancelar sus propios turnos
CREATE POLICY "Users can update their own appointments" ON appoinment
FOR UPDATE
USING (
  auth.uid() = user_id
)
WITH CHECK (
  auth.uid() = user_id
);

-- Política para que los admins puedan cancelar cualquier turno
CREATE POLICY "Admins can update all appointments" ON appoinment
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND users.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND users.role = 'admin'
  )
);

-- PASO 7: Crear políticas RLS para DELETE (opcional, por si necesitas eliminar)
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
-- VERIFICACIÓN DE POLÍTICAS
-- ============================================
-- Para verificar que las políticas se crearon correctamente, ejecuta:
-- SELECT * FROM pg_policies WHERE tablename = 'appoinment';

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================
-- 1. Asegúrate de ejecutar este script en el SQL Editor de Supabase
-- 2. Si ya tienes políticas creadas, es posible que necesites eliminarlas primero
-- 3. Las políticas RLS son CRUCIALES para que Realtime funcione correctamente
-- 4. Los usuarios solo recibirán updates en tiempo real de los registros que pueden ver según sus políticas
