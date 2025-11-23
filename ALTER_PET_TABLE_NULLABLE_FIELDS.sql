-- Script para permitir valores NULL en campos opcionales de la tabla pet
-- Ejecutar este script en Supabase SQL Editor

-- Permitir NULL en birth_date (fecha de nacimiento)
ALTER TABLE pet
ALTER COLUMN birth_date DROP NOT NULL;

-- Permitir NULL en vaccines (vacunas)
ALTER TABLE pet
ALTER COLUMN vaccines DROP NOT NULL;

-- Permitir NULL en history (historial médico)
ALTER TABLE pet
ALTER COLUMN history DROP NOT NULL;

-- Permitir NULL en image (imagen de la mascota)
ALTER TABLE pet
ALTER COLUMN image DROP NOT NULL;

-- Verificar cambios
SELECT column_name, is_nullable, data_type
FROM information_schema.columns
WHERE table_name = 'pet'
AND column_name IN ('birth_date', 'vaccines', 'history', 'image');
