# Sistema de Cálculo Automático de Edad de Mascotas

## Descripción General

El sistema calcula automáticamente la edad actual de las mascotas basándose en diferentes criterios, asegurando que la edad se mantenga actualizada sin intervención manual.

## Funcionamiento

### 1. Cálculo según datos disponibles

El sistema utiliza tres métodos de cálculo según la información disponible:

#### Método 1: Fecha de Nacimiento Exacta (Prioridad Alta)
- Si el usuario proporcionó `birth_date`, se calcula la edad exacta comparando con la fecha actual
- Considera año, mes y día para determinar si ya cumplió años
- **Ejemplo:** Si nació el 15/03/2020 y hoy es 10/01/2025 → Edad = 4 años

#### Método 2: Edad Inicial + Tiempo Transcurrido (Prioridad Media)
- Si NO hay `birth_date` pero SÍ hay `age` y `created_at`
- Suma la edad inicial al tiempo transcurrido desde la creación del registro
- **Ejemplo:** Registrada con 2 años el 01/01/2023, hoy 01/01/2025 → Edad = 4 años

#### Método 3: Edad Registrada (Fallback)
- Si solo existe `age` sin otros datos
- Devuelve la edad registrada sin modificación

### 2. Mascotas Fallecidas

Las mascotas marcadas como `is_active = false` **NO** aumentan su edad automáticamente. Se mantiene la edad que tenían al momento de ser marcadas como fallecidas.

## Archivos Involucrados

### 1. `utils/calculateAge.js`
Contiene las funciones de cálculo:
- `calculateCurrentAge(pet)`: Calcula la edad de una mascota individual
- `calculateAgesForPets(pets)`: Calcula edades para un array de mascotas

### 2. `services/pets.service.js`
- `getPets()`: Obtiene mascotas y aplica cálculo automático de edad
- Devuelve mascotas con campo adicional `calculatedAge`

### 3. Componentes Actualizados
- `PetsContainer.jsx`: Muestra `calculatedAge ?? age`
- `PetRegisterForm.jsx`: Marca campos opcionales: birth_date, vaccines, image

## Campos Opcionales

Los siguientes campos ahora son opcionales en el formulario de registro:

| Campo | Descripción | Valor si no se proporciona |
|-------|-------------|---------------------------|
| `birth_date` | Fecha de nacimiento | `null` |
| `vaccines` | Vacunas administradas | `null` |
| `history` | Historial médico | `null` |
| `image` | Imagen de la mascota | `null` |

## Script SQL de Base de Datos

Ejecutar `ALTER_PET_TABLE_NULLABLE_FIELDS.sql` en Supabase para permitir valores NULL en estos campos.

## Ejemplos de Uso

### Ejemplo 1: Con Fecha de Nacimiento
```javascript
const pet = {
  name: "Max",
  birth_date: "2020-05-15",
  age: 3,
  created_at: "2023-01-01",
  is_active: true
};

// Resultado: calculatedAge = 4 (basado en birth_date, edad actual en 2025)
```

### Ejemplo 2: Sin Fecha de Nacimiento
```javascript
const pet = {
  name: "Luna",
  birth_date: null,
  age: 2,
  created_at: "2023-01-01",
  is_active: true
};

// Resultado: calculatedAge = 4 (2 años iniciales + 2 años transcurridos)
```

### Ejemplo 3: Mascota Fallecida
```javascript
const pet = {
  name: "Bobby",
  birth_date: "2015-03-10",
  age: 8,
  created_at: "2020-01-01",
  is_active: false  // Fallecida
};

// Resultado: calculatedAge = 8 (no aumenta, mantiene edad registrada)
```

## Flujo de Datos

```
Usuario registra mascota
    ↓
Datos guardados en Supabase (age, birth_date, created_at)
    ↓
getPets() obtiene datos de la base de datos
    ↓
calculateAgesForPets() calcula edades actuales
    ↓
Componentes muestran calculatedAge
```

## Notas Importantes

1. La edad en la base de datos (`age`) **NO se modifica automáticamente**
2. El cálculo se realiza en tiempo real cada vez que se cargan las mascotas
3. Las mascotas fallecidas mantienen su edad registrada
4. Si hay `birth_date`, siempre tiene prioridad sobre el cálculo por tiempo transcurrido
5. Los campos opcionales pueden ser `null` en la base de datos

## Mantenimiento

- La función de cálculo es completamente automática
- No requiere cronjobs ni tareas programadas
- Se ejecuta cada vez que se cargan las mascotas
- Es eficiente y no impacta el rendimiento
