/**
 * Utilidades de validación para mascotas
 * Funciones compartidas para validar edad y fecha de nacimiento
 */

// Tolerancia permitida en años para diferencias entre edad ingresada y calculada
export const AGE_TOLERANCE_YEARS = 1;

/**
 * Calcula la edad actual en años a partir de una fecha de nacimiento
 * @param {string|Date} birthDate - Fecha de nacimiento
 * @returns {number} - Edad en años (con decimales)
 */
export const calculateAgeFromBirthDate = (birthDate) => {
  if (!birthDate) return null;

  const today = new Date();
  const birth = new Date(birthDate);
  const ageInYears = (today - birth) / (1000 * 60 * 60 * 24 * 365.25);

  return ageInYears;
};

/**
 * Obtiene la edad sugerida (redondeada) basada en la fecha de nacimiento
 * @param {string|Date} birthDate - Fecha de nacimiento
 * @returns {number|null} - Edad sugerida en años (entero) o null si no hay fecha
 */
export const getSuggestedAge = (birthDate) => {
  const ageInYears = calculateAgeFromBirthDate(birthDate);
  if (ageInYears === null) return null;

  return Math.round(ageInYears);
};

/**
 * Valida la consistencia entre la edad ingresada y la fecha de nacimiento
 * @param {number|string} age - Edad ingresada por el usuario
 * @param {string|Date} birthDate - Fecha de nacimiento
 * @returns {Object} - { isValid: boolean, suggestedAge: number|null, difference: number|null }
 */
export const validateAgeAndBirthDate = (age, birthDate) => {
  // Si falta alguno de los campos, no validamos
  if (!birthDate || !age) {
    return {
      isValid: true,
      suggestedAge: null,
      difference: null
    };
  }

  const ageFromBirthDate = calculateAgeFromBirthDate(birthDate);
  const ageDifference = Math.abs(parseFloat(age) - ageFromBirthDate);
  const suggestedAge = getSuggestedAge(birthDate);

  // Si la diferencia es mayor a la tolerancia, hay inconsistencia
  const isValid = ageDifference <= AGE_TOLERANCE_YEARS;

  return {
    isValid,
    suggestedAge,
    difference: ageDifference
  };
};

/**
 * Genera el mensaje de error para mostrar en la alerta
 * @param {number} enteredAge - Edad ingresada por el usuario
 * @param {number} suggestedAge - Edad calculada desde la fecha de nacimiento
 * @returns {string} - Mensaje formateado
 */
export const getInconsistencyMessage = (enteredAge, suggestedAge) => {
  return `La edad ingresada (${enteredAge} años) no coincide con la fecha de nacimiento. Según la fecha ingresada, la mascota debería tener aproximadamente ${suggestedAge} años. Por favor, revisa ambos campos antes de continuar.`;
};
