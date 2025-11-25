# Guía de Seguridad - Clínica Veterinaria

## ⚠️ ACCIÓN REQUERIDA INMEDIATAMENTE

### 1. Regenerar Credenciales de Supabase

Las credenciales actuales están comprometidas. Debes regenerar inmediatamente:

1. Ve a tu proyecto en Supabase: https://app.supabase.com
2. Navega a **Settings** → **API**
3. Haz clic en **"Reset API keys"** para generar nuevas claves
4. Actualiza el archivo `.env` local con las nuevas credenciales
5. **NUNCA** hagas commit del archivo `.env`

### 2. Revisar Políticas RLS (Row Level Security)

Asegúrate de que todas las tablas en Supabase tengan políticas RLS habilitadas:

```sql
-- Verifica que RLS esté habilitado en todas las tablas
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE adoptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
-- ... y todas las demás tablas
```

### 3. Configuración para Nuevos Desarrolladores

Si alguien clona este repositorio:

1. Copiar `.env.example` a `.env`:
   ```bash
   cd frontend/vet-client
   cp .env.example .env
   ```

2. Contactar al administrador del proyecto para obtener las credenciales reales
3. **NUNCA** compartir credenciales por email, chat público, o commits

### 4. Verificación de Seguridad

Antes de hacer push:
```bash
# Verifica que .env no esté siendo trackeado
git status

# Si aparece .env, NO hagas commit
# El archivo .gitignore ya lo está protegiendo
```

## Buenas Prácticas

- ✅ Usar `.env` para variables sensibles
- ✅ Mantener `.gitignore` actualizado
- ✅ Usar `.env.example` como plantilla
- ✅ Habilitar RLS en todas las tablas de Supabase
- ❌ NUNCA hacer commit de archivos `.env`
- ❌ NUNCA compartir credenciales en código
- ❌ NUNCA deshabilitar políticas de seguridad en producción

## Contacto de Seguridad

Si encuentras una vulnerabilidad de seguridad, repórtala inmediatamente al administrador del proyecto.
