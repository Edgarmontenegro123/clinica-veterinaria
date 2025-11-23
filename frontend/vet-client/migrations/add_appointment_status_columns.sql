-- Migración para agregar columnas de estado de cancelación a la tabla appoinment
-- Ejecutar este script en el SQL Editor de Supabase

-- Agregar columna status (puede ser null para turnos existentes que están activos)
ALTER TABLE appoinment
ADD COLUMN IF NOT EXISTS status VARCHAR(20);

-- Agregar columna cancelled_at para registrar cuándo se canceló
ALTER TABLE appoinment
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ;

-- Agregar columna cancelled_by para saber quién canceló (admin o user)
ALTER TABLE appoinment
ADD COLUMN IF NOT EXISTS cancelled_by VARCHAR(10);

-- Crear un índice para mejorar las consultas por status
CREATE INDEX IF NOT EXISTS idx_appoinment_status ON appoinment(status);

-- Comentarios para documentar las columnas
COMMENT ON COLUMN appoinment.status IS 'Estado del turno: null (activo), cancelled (cancelado)';
COMMENT ON COLUMN appoinment.cancelled_at IS 'Fecha y hora de cancelación del turno';
COMMENT ON COLUMN appoinment.cancelled_by IS 'Quién canceló el turno: admin o user';
