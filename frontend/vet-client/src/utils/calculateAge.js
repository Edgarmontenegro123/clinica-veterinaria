/**
 * Calcula la edad actual de una mascota basándose en diferentes criterios
 * @param {Object} pet - Objeto de mascota con campos: birth_date, age, created_at, is_active
 * @returns {number} - Edad actual de la mascota en años
 */
export const calculateCurrentAge = (pet) => {
  // Si la mascota está marcada como fallecida, devolver la edad registrada sin modificar
  if (pet.is_active === false) {
    return pet.age;
  }

  const today = new Date();

  // CASO 1: Si existe birth_date, calcular edad exacta desde la fecha de nacimiento
  if (pet.birth_date) {
    const birthDate = new Date(pet.birth_date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Ajustar si aún no cumplió años este año
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return Math.max(0, age); // No puede ser negativa
  }

  // CASO 2: Si NO existe birth_date, calcular desde created_at + age inicial
  if (pet.created_at && pet.age !== null && pet.age !== undefined) {
    const createdDate = new Date(pet.created_at);
    const yearsSinceCreation = today.getFullYear() - createdDate.getFullYear();
    const monthDiff = today.getMonth() - createdDate.getMonth();

    // Ajustar años si aún no ha pasado el mes/día de creación este año
    let yearsToAdd = yearsSinceCreation;
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < createdDate.getDate())) {
      yearsToAdd--;
    }

    return Math.max(0, pet.age + yearsToAdd);
  }

  // CASO 3: Si solo tenemos age (sin created_at), devolver la edad registrada
  return pet.age || 0;
};

/**
 * Calcula la edad para todas las mascotas en un array
 * @param {Array} pets - Array de mascotas
 * @returns {Array} - Array de mascotas con edad calculada
 */
export const calculateAgesForPets = (pets) => {
  return pets.map(pet => ({
    ...pet,
    calculatedAge: calculateCurrentAge(pet)
  }));
};
