-- ============================================
-- POLÍTICAS DE SEGURIDAD PARA STORAGE
-- Protección para las imágenes de mascotas
-- ============================================
-- EJECUTAR EN: Supabase Dashboard > SQL Editor > New Query
-- Fecha: 2025-12-17
-- ============================================

-- ============================================
-- BUCKET: pet-images (o el nombre que uses)
-- ============================================

-- NOTA: Reemplaza 'pet-images' con el nombre real de tu bucket
-- Puedes verificar el nombre en: Storage > Buckets

-- Eliminar políticas existentes del bucket pet-images
DROP POLICY IF EXISTS "Users can upload their pet images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their pet images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their pet images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their pet images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage all pet images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view pet images" ON storage.objects;

-- ============================================
-- POLÍTICAS DE LECTURA (SELECT)
-- ============================================

-- Política 1: Público puede ver todas las imágenes (para adopciones)
CREATE POLICY "Public can view pet images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'pet-images');

-- ============================================
-- POLÍTICAS DE SUBIDA (INSERT)
-- ============================================

-- Política 2: Usuarios autenticados pueden subir imágenes
CREATE POLICY "Users can upload their pet images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'pet-images'
  AND auth.role() = 'authenticated'
);

-- ============================================
-- POLÍTICAS DE ACTUALIZACIÓN (UPDATE)
-- ============================================

-- Política 3: Usuarios pueden actualizar sus propias imágenes
CREATE POLICY "Users can update their pet images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'pet-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'pet-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Política 4: Admins pueden actualizar cualquier imagen
CREATE POLICY "Admins can update all pet images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'pet-images'
  AND EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND users.role = 'admin'
  )
)
WITH CHECK (
  bucket_id = 'pet-images'
  AND EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND users.role = 'admin'
  )
);

-- ============================================
-- POLÍTICAS DE ELIMINACIÓN (DELETE)
-- ============================================

-- Política 5: Usuarios pueden eliminar sus propias imágenes
CREATE POLICY "Users can delete their pet images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'pet-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Política 6: Admins pueden eliminar cualquier imagen
CREATE POLICY "Admins can delete all pet images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'pet-images'
  AND EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND users.role = 'admin'
  )
);

-- ============================================
-- CONFIGURACIÓN DEL BUCKET
-- ============================================

-- Asegúrate de que el bucket esté configurado como PÚBLICO
-- para que las imágenes puedan ser vistas sin autenticación

-- Ve a: Storage > pet-images > Settings > Public bucket: ON

-- ============================================
-- VERIFICACIÓN DE POLÍTICAS DE STORAGE
-- ============================================

-- Ver todas las políticas del bucket pet-images
SELECT *
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage';

-- ============================================
-- ESTRUCTURA DE CARPETAS RECOMENDADA
-- ============================================
-- Las imágenes deben guardarse con esta estructura:
-- pet-images/
--   ├── {user_id}/
--   │   ├── {pet_id}_1.jpg
--   │   ├── {pet_id}_2.jpg
--   │   └── ...
--   └── public/
--       └── (imágenes públicas sin dueño específico)

-- Ejemplo de path: pet-images/550e8400-e29b-41d4-a716-446655440000/pet_123_1.jpg

-- ============================================
-- INSTRUCCIONES ADICIONALES
-- ============================================
-- 1. Si tu bucket tiene otro nombre, reemplaza 'pet-images' en todo el script
-- 2. Verifica que el bucket esté configurado como público
-- 3. Asegúrate de que las imágenes se guarden con la estructura: {user_id}/{filename}
-- 4. Si usas otra estructura, ajusta las políticas según tu caso
-- ============================================