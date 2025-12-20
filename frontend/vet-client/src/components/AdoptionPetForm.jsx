import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createAdoptionPet, updateAdoptionPet } from "../services/adoption.service.js";
import { supabase } from "../services/supabase.js";
import {
  validateAgeAndBirthDate,
  getSuggestedAge,
  getInconsistencyMessage
} from "../utils/petValidation.js";

export default function AdoptionPetForm({ petData = null, mode = "create" }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: petData || {
      name: "",
      species: "",
      age: "",
      birth_date: "",
      sex: "",
      breed: "",
      vaccines: "",
      history: ""
    }
  });
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(petData?.image || null);
  const predefinedSpecies = ["Perro", "Gato", "Ave"];
  const isCustomSpecies = petData?.species && !predefinedSpecies.includes(petData.species);

  const [showCustomSpecies, setShowCustomSpecies] = useState(false);
  const [customSpecies, setCustomSpecies] = useState(isCustomSpecies ? petData.species : "");
  const [selectedSpecies, setSelectedSpecies] = useState(petData?.species || "");
  const [ageInconsistency, setAgeInconsistency] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [currentAge, setCurrentAge] = useState(petData?.age || "");
  const [currentBirthDate, setCurrentBirthDate] = useState(petData?.birth_date || "");

  useEffect(() => {
    if (petData && mode === "edit") {
      reset({
        ...petData,
        vaccines: Array.isArray(petData.vaccines) ? petData.vaccines.join(", ") : petData.vaccines || "",
        birth_date: petData.birth_date ? petData.birth_date.split('T')[0] : ""
      });
      setImagePreview(petData.image || null);
      setSelectedSpecies(petData.species || "");

      if (petData.species && !predefinedSpecies.includes(petData.species)) {
        setCustomSpecies(petData.species);
      }
    }
  }, [petData, mode, reset]);

  const handleSpeciesChange = (e) => {
    const value = e.target.value;
    setSelectedSpecies(value);

    if (value === "Otro") {
      setShowCustomSpecies(true);
    } else {
      setShowCustomSpecies(false);
      setCustomSpecies("");
    }
  };

  const handleCustomSpeciesSubmit = () => {
    if (customSpecies.trim()) {
      setSelectedSpecies(customSpecies.trim());
      setShowCustomSpecies(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validación en tiempo real
  useEffect(() => {
    if (currentAge && currentBirthDate) {
      const validation = validateAgeAndBirthDate(currentAge, currentBirthDate);
      if (!validation.isValid) {
        setAgeInconsistency(true);
        setValidationMessage(
          `La edad debería ser aproximadamente ${validation.suggestedAge} años según la fecha de nacimiento`
        );
      } else {
        setAgeInconsistency(false);
        setValidationMessage("");
      }
    } else {
      setAgeInconsistency(false);
      setValidationMessage("");
    }
  }, [currentAge, currentBirthDate]);

  // Función para auto-calcular edad desde fecha de nacimiento
  const handleCalculateAge = () => {
    if (!currentBirthDate) {
      Swal.fire({
        icon: "info",
        title: "Fecha requerida",
        text: "Primero debes ingresar la fecha de nacimiento para calcular la edad.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    const suggestedAge = getSuggestedAge(currentBirthDate);
    if (suggestedAge !== null) {
      setCurrentAge(suggestedAge);
      // Actualizar el valor en el formulario
      reset({
        ...petData,
        age: suggestedAge,
        birth_date: currentBirthDate
      });
      setAgeInconsistency(false);
      setValidationMessage("");

      Swal.fire({
        icon: "success",
        title: "Edad calculada",
        text: `La edad de la mascota es ${suggestedAge} año${suggestedAge !== 1 ? 's' : ''}.`,
        confirmButtonColor: "#3085d6",
        timer: 2000
      });
    }
  };

  const onSubmit = async (data) => {
    if (!selectedSpecies || selectedSpecies === "Otro") {
      Swal.fire({
        icon: "error",
        title: "Especie requerida",
        text: "Por favor, selecciona o ingresa una especie para la mascota.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    // Validar consistencia entre edad y fecha de nacimiento
    const validation = validateAgeAndBirthDate(data.age, data.birth_date);
    if (!validation.isValid) {
      setAgeInconsistency(true);

      const result = await Swal.fire({
        icon: "warning",
        title: "Inconsistencia detectada",
        html: getInconsistencyMessage(data.age, validation.suggestedAge),
        showCancelButton: true,
        confirmButtonText: `Auto-corregir a ${validation.suggestedAge} años`,
        cancelButtonText: "Revisar manualmente",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#f59e0b",
      });

      // Si el usuario elige auto-corregir
      if (result.isConfirmed) {
        setCurrentAge(validation.suggestedAge);
        reset({
          ...data,
          age: validation.suggestedAge,
          birth_date: data.birth_date
        });
        setAgeInconsistency(false);
        setValidationMessage("");
        // Continuar con el submit automáticamente
      } else {
        return; // Cancelar submit para que el usuario revise
      }
    } else {
      setAgeInconsistency(false);
      setValidationMessage("");
    }

    setIsSubmitting(true);

    try {
      let imageUrl = petData?.image || null;

      // Si hay una nueva imagen, subirla a Supabase Storage
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `pets/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("pet-images")
          .upload(filePath, imageFile);

        if (uploadError) {
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from("pet-images")
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;
      }

      // Preparar datos de la mascota
      const petPayload = {
        name: data.name,
        species: selectedSpecies,
        age: parseInt(data.age),
        birth_date: data.birth_date || null,
        vaccines: data.vaccines ? data.vaccines.split(",").map(v => v.trim()) : null,
        history: data.history || null,
        image: imageUrl,
        sex: data.sex,
        breed: data.breed
      };

      if (mode === "create") {
        await createAdoptionPet(petPayload);
        await Swal.fire({
          icon: "success",
          title: "¡Mascota agregada!",
          text: "La mascota ha sido agregada a la lista de adopciones exitosamente.",
          confirmButtonColor: "#16a34a",
        });
      } else {
        await updateAdoptionPet(petData.id, petPayload);
        await Swal.fire({
          icon: "success",
          title: "¡Mascota actualizada!",
          text: "La información de la mascota ha sido actualizada.",
          confirmButtonColor: "#16a34a",
        });
      }

      navigate("/adoptions");
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudo guardar la mascota. Intente nuevamente.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-black/50 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        {mode === "create" ? "Registrar Nueva Mascota Para Adopción" : "Editar Mascota en Adopción"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Imagen */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Foto de la mascota
          </label>
          <div className="flex flex-col items-center gap-4">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-48 h-48 object-cover rounded-lg shadow-md"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-300
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-green-600 file:text-white
                hover:file:bg-green-700
                active:file:scale-95
                file:transition-all file:duration-150
                file:shadow-md hover:file:shadow-lg
                cursor-pointer"
            />
          </div>
        </div>

        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Nombre *
          </label>
          <input
            type="text"
            {...register("name", { required: "El nombre es obligatorio" })}
            className="w-full px-4 py-2 bg-gray-800/30 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-gray-800/50 backdrop-blur-sm"
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Especie */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Especie *
          </label>
          <select
            value={selectedSpecies}
            onChange={handleSpeciesChange}
            className="w-full px-4 py-2 bg-gray-800/30 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-gray-800/50 backdrop-blur-sm"
          >
            <option value="">Seleccionar...</option>
            <option value="Perro">Perro</option>
            <option value="Gato">Gato</option>
            <option value="Ave">Ave</option>
            {!predefinedSpecies.includes(selectedSpecies) && selectedSpecies !== "" && selectedSpecies !== "Otro" && (
              <option value={selectedSpecies}>{selectedSpecies}</option>
            )}
            <option value="Otro">Otro</option>
          </select>

          {showCustomSpecies && (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={customSpecies}
                onChange={(e) => setCustomSpecies(e.target.value)}
                placeholder="Ingresa la especie"
                className="flex-1 px-4 py-2 bg-gray-800/30 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-gray-800/50 backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={handleCustomSpeciesSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 active:scale-95 transition-all duration-150 shadow-md hover:shadow-lg"
              >
                OK
              </button>
            </div>
          )}
        </div>

        {/* Raza */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Raza *
          </label>
          <input
            type="text"
            {...register("breed", { required: "La raza es obligatoria" })}
            className="w-full px-4 py-2 bg-gray-800/30 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-gray-800/50 backdrop-blur-sm"
          />
          {errors.breed && (
            <p className="text-red-400 text-sm mt-1">{errors.breed.message}</p>
          )}
        </div>

        {/* Sexo */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Sexo *
          </label>
          <select
            {...register("sex", { required: "El sexo es obligatorio" })}
            className="w-full px-4 py-2 bg-gray-800/30 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-gray-800/50 backdrop-blur-sm"
          >
            <option value="">Seleccionar...</option>
            <option value="Macho">Macho</option>
            <option value="Hembra">Hembra</option>
          </select>
          {errors.sex && (
            <p className="text-red-400 text-sm mt-1">{errors.sex.message}</p>
          )}
        </div>

        {/* Edad */}
        <div>
          <label className={`block text-sm font-medium mb-1 ${ageInconsistency ? 'text-red-400' : 'text-gray-200'}`}>
            Edad (años) *
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.1"
              {...register("age", { required: "La edad es obligatoria", min: 0 })}
              className={`w-24 sm:flex-1 px-3 sm:px-4 py-2 bg-gray-800/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-gray-800/50 backdrop-blur-sm ${ageInconsistency ? 'border-2 border-red-400' : 'border border-gray-600/50'}`}
              onChange={(e) => {
                setCurrentAge(e.target.value);
                register("age").onChange(e);
              }}
            />
            <button
              type="button"
              onClick={handleCalculateAge}
              disabled={!currentBirthDate}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold disabled:bg-gray-500 disabled:cursor-not-allowed whitespace-nowrap transition-all active:scale-95 shadow-md hover:shadow-lg"
              title="Calcular edad desde fecha de nacimiento"
            >
              📅 Calcular
            </button>
          </div>
          {errors.age && (
            <p className="text-red-400 text-sm mt-1">{errors.age.message}</p>
          )}
          {ageInconsistency && validationMessage && (
            <p className="text-yellow-300 text-sm mt-1 flex items-center gap-1">
              ⚠️ {validationMessage}
            </p>
          )}
        </div>

        {/* Fecha de nacimiento */}
        <div>
          <label className={`block text-sm font-medium mb-1 ${ageInconsistency ? 'text-red-400' : 'text-gray-200'}`}>
            Fecha de Nacimiento
          </label>
          <input
            type="date"
            {...register("birth_date")}
            className={`w-full px-4 py-2 bg-gray-800/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-gray-800/50 backdrop-blur-sm ${ageInconsistency ? 'border-2 border-red-400' : 'border border-gray-600/50'}`}
            onChange={(e) => {
              setCurrentBirthDate(e.target.value);
              register("birth_date").onChange(e);
            }}
          />
        </div>

        {/* Vacunas */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Vacunas (separadas por comas)
          </label>
          <input
            type="text"
            {...register("vaccines")}
            placeholder="Ej: Rabia, Parvovirus, Moquillo"
            className="w-full px-4 py-2 bg-gray-800/30 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-gray-800/50 backdrop-blur-sm"
          />
        </div>

        {/* Historia */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Historia / Descripción
          </label>
          <textarea
            {...register("history")}
            rows="4"
            placeholder="Cuéntanos sobre esta mascota..."
            className="w-full px-4 py-2 bg-gray-800/30 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-gray-800/50 backdrop-blur-sm"
          />
        </div>

        {/* Botones */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/adoptions")}
            className="flex-1 px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 active:scale-95 transition-all duration-150 border border-gray-600 shadow-md hover:shadow-lg"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 active:scale-95 transition-all duration-150 shadow-md hover:shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {isSubmitting
              ? "Guardando..."
              : mode === "create"
              ? "Agregar Mascota"
              : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
