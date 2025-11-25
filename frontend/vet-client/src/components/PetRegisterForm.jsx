import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createPet, updatePet, deletePet } from "../services/pets.service.js";
import { useAuthStore } from "../store/authStore.js";
import { supabase } from "../services/supabase.js";
import {
  validateAgeAndBirthDate,
  getSuggestedAge,
  getInconsistencyMessage
} from "../utils/petValidation.js";

export default function PetRegisterForm({ petData = null, mode = "create", onSuccess }) {
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
      history: "",
      has_owner: true
    }
  });
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();
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

      // Si la especie no es una de las predefinidas, mostrarla como personalizada
      const predefinedSpecies = ["Perro", "Gato", "Ave"];
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

    // Validar que se haya seleccionado o ingresado una especie
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

    if (data.birth_date) {
      const selectedDate = new Date(data.birth_date + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate > today) {
        Swal.fire({
          icon: "error",
          title: "Fecha inválida",
          text: "La fecha de nacimiento no puede ser posterior a la fecha actual.",
          confirmButtonColor: "#d33",
        });
        return;
      }

      const minDate = new Date();
      minDate.setFullYear(minDate.getFullYear() - 200);
      minDate.setHours(0, 0, 0, 0);

      if (selectedDate < minDate) {
        Swal.fire({
          icon: "error",
          title: "Fecha inválida",
          text: "La fecha de nacimiento no puede ser mayor a 200 años en el pasado.",
          confirmButtonColor: "#d33",
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      let imageUrl = petData?.image || "";

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `pets/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('pet-images')
          .upload(filePath, imageFile);

        if (uploadError) {
          throw new Error("No se pudo subir la imagen");
        }

        const { data: publicUrlData } = supabase.storage
          .from('pet-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      const processedData = {
        ...data,
        species: selectedSpecies, // Usar la especie seleccionada o personalizada
        vaccines: data.vaccines ? data.vaccines.split(",").map(v => v.trim()).filter(v => v) : [],
        has_owner: data.has_owner === true || data.has_owner === "true",
        image: imageUrl
      };

      let response;
      if (mode === "edit" && petData) {
        response = await updatePet(petData.id, processedData);
        await Swal.fire({
          icon: "success",
          title: "¡Mascota actualizada!",
          text: `La mascota ${data.name} se actualizó correctamente.`,
          confirmButtonColor: "#3085d6",
        });
      } else {
        response = await createPet(processedData);
        await Swal.fire({
          icon: "success",
          title: "¡Mascota registrada!",
          text: `La mascota ${data.name} se registró correctamente.`,
          confirmButtonColor: "#3085d6",
        });
      }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/mypets");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: mode === "edit"
          ? "No se pudo actualizar la mascota. Intente nuevamente."
          : "No se pudo registrar la mascota. Intente nuevamente.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!petData || mode !== "edit") return;

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas eliminar a ${petData.name}? Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        await deletePet(petData.id);
        await Swal.fire({
          icon: "success",
          title: "Eliminada",
          text: "La mascota ha sido eliminada correctamente.",
          confirmButtonColor: "#3085d6",
        });

        if (onSuccess) {
          onSuccess();
        } else {
          navigate("/mypets");
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar la mascota. Intente nuevamente.",
          confirmButtonColor: "#d33",
        });
      }
    }
  };

  return (
    <>
      <style>{`
        body::-webkit-scrollbar {
          width: 8px;
        }
        body::-webkit-scrollbar-track {
          background: #1f2937;
        }
        body::-webkit-scrollbar-thumb {
          background: #3b82f6;
          border-radius: 10px;
        }
        body::-webkit-scrollbar-thumb:hover {
          background: #1e40af;
        }
        
        div::after {
          display: none !important;
        }
      `}</style>
      
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          paddingTop: "48px",
          paddingBottom: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
          background: "transparent"
        }}
      >
        <div style={{ width: "100%", paddingLeft: "16px", paddingRight: "16px", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "-48px", paddingTop: "48px", marginBottom: "-48px", paddingBottom: "48px", boxSizing: "border-box", background: "transparent" }}>
          <form
            className="flex flex-col gap-3 justify-center border-2 border-white/30 p-4 sm:p-5 md:p-6 lg:p-8 rounded-xl shadow-2xl w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-2xl lg:max-w-3xl mx-auto backdrop-blur-xl bg-black/40"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 md:mb-4 text-center" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
              {mode === "edit" ? "Editar Mascota" : "Registrar Nueva Mascota"}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex flex-col">
                <label className="font-semibold text-white mb-1 text-sm sm:text-base" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>Nombre *</label>
                <input
                  className="bg-white/20 text-white px-3 py-2 text-sm sm:text-base rounded-md border border-white/30 focus:border-blue-400 focus:outline-none placeholder-white/60 backdrop-blur-md"
                  placeholder="Ej: Max"
                  {...register("name", { required: "El nombre es requerido" })}
                />
                {errors.name && <span className="text-red-300 text-xs sm:text-sm mt-1 font-semibold" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.7)" }}>{errors.name.message}</span>}
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-white mb-1 text-sm sm:text-base" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>Especie *</label>

                {!showCustomSpecies && customSpecies && (
                  <div className="mb-2 p-2 bg-blue-500/30 border border-blue-400/50 rounded-md backdrop-blur-md flex items-center justify-between">
                    <span className="text-white font-semibold text-sm sm:text-base" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
                      Especie: {customSpecies}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomSpecies("");
                        setSelectedSpecies("");
                      }}
                      className="text-white hover:text-red-300 text-xs sm:text-sm font-semibold ml-2"
                    >
                      Cambiar
                    </button>
                  </div>
                )}

                {!customSpecies && (
                  <select
                    className="bg-white/20 text-white px-3 py-2 text-sm sm:text-base rounded-md border border-white/30 focus:border-blue-400 focus:outline-none backdrop-blur-md"
                    value={selectedSpecies}
                    onChange={handleSpeciesChange}
                  >
                    <option value="" className="bg-gray-800">Selecciona especie</option>
                    <option value="Perro" className="bg-gray-800">Perro</option>
                    <option value="Gato" className="bg-gray-800">Gato</option>
                    <option value="Ave" className="bg-gray-800">Ave</option>
                    <option value="Otro" className="bg-gray-800">Otro</option>
                  </select>
                )}

                {showCustomSpecies && (
                  <div className="mt-2 flex flex-col gap-2">
                    <input
                      type="text"
                      value={customSpecies}
                      onChange={(e) => setCustomSpecies(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleCustomSpeciesSubmit();
                        }
                      }}
                      placeholder="Escribe la especie (ej: Conejo, Hamster, Reptil)"
                      className="bg-white/20 text-white px-3 py-2 text-sm sm:text-base rounded-md border border-white/30 focus:border-blue-400 focus:outline-none placeholder-white/60 backdrop-blur-md"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleCustomSpeciesSubmit}
                        disabled={!customSpecies.trim()}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 text-sm sm:text-base rounded-md font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        Confirmar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCustomSpecies(false);
                          setCustomSpecies("");
                          setSelectedSpecies("");
                        }}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 text-sm sm:text-base rounded-md font-semibold"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-white mb-1 text-sm sm:text-base" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>Raza *</label>
                <input
                  className="bg-white/20 text-white px-3 py-2 text-sm sm:text-base rounded-md border border-white/30 focus:border-blue-400 focus:outline-none placeholder-white/60 backdrop-blur-md"
                  placeholder="Ej: Mestizo, Labrador, Siamés"
                  {...register("breed", { required: "La raza es requerida" })}
                />
                {errors.breed && <span className="text-red-300 text-xs sm:text-sm mt-1 font-semibold" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.7)" }}>{errors.breed.message}</span>}
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-white mb-1 text-sm sm:text-base" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>Sexo *</label>
                <select
                  className="bg-white/20 text-white px-3 py-2 text-sm sm:text-base rounded-md border border-white/30 focus:border-blue-400 focus:outline-none backdrop-blur-md"
                  {...register("sex", { required: "El sexo es requerido" })}
                >
                  <option value="" className="bg-gray-800">Selecciona sexo</option>
                  <option value="Macho" className="bg-gray-800">Macho</option>
                  <option value="Hembra" className="bg-gray-800">Hembra</option>
                </select>
                {errors.sex && <span className="text-red-300 text-xs sm:text-sm mt-1 font-semibold" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.7)" }}>{errors.sex.message}</span>}
              </div>

              <div className="flex flex-col">
                <label className={`font-semibold mb-1 text-sm sm:text-base ${ageInconsistency ? 'text-red-400' : 'text-white'}`} style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
                  Edad (años) *
                </label>
                <div className="flex gap-2">
                  <input
                    className={`flex-1 bg-white/20 text-white px-3 py-2 text-sm sm:text-base rounded-md focus:border-blue-400 focus:outline-none placeholder-white/60 backdrop-blur-md ${ageInconsistency ? 'border-2 border-red-400' : 'border border-white/30'}`}
                    placeholder="Ej: 3"
                    type="number"
                    min="0"
                    step="1"
                    {...register("age", {
                      required: "La edad es requerida",
                      min: { value: 0, message: "La edad debe ser positiva" },
                      valueAsNumber: true
                    })}
                    onChange={(e) => {
                      setCurrentAge(e.target.value);
                      register("age").onChange(e);
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleCalculateAge}
                    disabled={!currentBirthDate}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 text-xs sm:text-sm rounded-md font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                    title="Calcular edad desde fecha de nacimiento"
                  >
                    📅 Calcular
                  </button>
                </div>
                {errors.age && <span className="text-red-300 text-xs sm:text-sm mt-1 font-semibold" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.7)" }}>{errors.age.message}</span>}
                {ageInconsistency && validationMessage && (
                  <span className="text-yellow-300 text-xs sm:text-sm mt-1 font-semibold flex items-center gap-1" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.7)" }}>
                    ⚠️ {validationMessage}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label className={`font-semibold mb-1 text-sm sm:text-base ${ageInconsistency ? 'text-red-400' : 'text-white'}`} style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
                  Fecha de Nacimiento <span className="text-white/60 text-xs sm:text-sm font-normal">(opcional)</span>
                </label>
                <input
                  type="date"
                  max={(() => {
                    const today = new Date();
                    return today.toISOString().split('T')[0];
                  })()}
                  min={(() => {
                    const minDate = new Date();
                    minDate.setFullYear(minDate.getFullYear() - 200);
                    return minDate.toISOString().split('T')[0];
                  })()}
                  className={`bg-white/20 text-white px-3 py-2 text-sm sm:text-base rounded-md focus:border-blue-400 focus:outline-none backdrop-blur-md ${ageInconsistency ? 'border-2 border-red-400' : 'border border-white/30'}`}
                  {...register("birth_date", {
                    validate: {
                      notFuture: value => {
                        if (!value) return true;
                        const selectedDate = new Date(value + 'T00:00:00');
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return selectedDate <= today || "La fecha de nacimiento no puede ser futura";
                      },
                      notTooOld: value => {
                        if (!value) return true;
                        const selectedDate = new Date(value + 'T00:00:00');
                        const minDate = new Date();
                        minDate.setFullYear(minDate.getFullYear() - 200);
                        minDate.setHours(0, 0, 0, 0);
                        return selectedDate >= minDate || "La fecha de nacimiento no puede ser mayor a 200 años";
                      }
                    }
                  })}
                  onChange={(e) => {
                    setCurrentBirthDate(e.target.value);
                    register("birth_date").onChange(e);
                  }}
                />
                {errors.birth_date && <span className="text-red-300 text-xs sm:text-sm mt-1 font-semibold" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.7)" }}>{errors.birth_date.message}</span>}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-white mb-1 text-sm sm:text-base" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
                Vacunas <span className="text-white/60 text-xs sm:text-sm font-normal">(opcional)</span>
                <span className="text-xs sm:text-sm font-normal text-white/70 ml-2">(separadas por comas)</span>
              </label>
              <input
                className="bg-white/20 text-white px-3 py-2 text-sm sm:text-base rounded-md border border-white/30 focus:border-blue-400 focus:outline-none placeholder-white/60 backdrop-blur-md"
                placeholder="Ej: Rabia, Parvovirus, Moquillo"
                {...register("vaccines")}
              />
            </div>

            {isAdmin && (
              <div className="flex flex-col">
                <label className="font-semibold text-white mb-1 text-sm sm:text-base" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>Historial Médico</label>
                <textarea
                  className="bg-white/20 text-white px-3 py-2 text-sm sm:text-base rounded-md border border-white/30 focus:border-blue-400 focus:outline-none resize-vertical placeholder-white/60 backdrop-blur-md"
                  placeholder="Información relevante sobre la salud de la mascota..."
                  rows="4"
                  {...register("history")}
                />
              </div>
            )}

            <div className="flex flex-col">
              <label className="font-semibold text-white mb-1 text-sm sm:text-base" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
                Imagen de la mascota <span className="text-white/60 text-xs sm:text-sm font-normal">(opcional)</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="flex-1 w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="bg-white/20 text-white px-3 py-2 text-sm sm:text-base rounded-md border border-white/30 focus:border-blue-400 focus:outline-none backdrop-blur-md w-full file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-md file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 file:cursor-pointer"
                  />
                </div>
                {imagePreview && (
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden border-2 border-white/30 flex-shrink-0 mx-auto sm:mx-0">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {isAdmin && (
              <div className="flex items-center gap-3 p-3 bg-yellow-500/20 rounded-md border border-yellow-400/40 backdrop-blur-md">
                <input
                  type="checkbox"
                  id="has_owner"
                  className="w-4 h-4 cursor-pointer"
                  {...register("has_owner")}
                />
                <label htmlFor="has_owner" className="font-semibold text-white cursor-pointer text-sm sm:text-base" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
                  ¿Tiene dueño? (desmarcar si es para adopción)
                </label>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="pet-form-button-primary flex-1 text-white px-4 py-2.5 sm:py-2 text-sm sm:text-base rounded-md font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Procesando..." : mode === "edit" ? "Actualizar Mascota" : "Registrar Mascota"}
              </button>

              {mode === "edit" && isAdmin && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="pet-form-button-delete px-4 py-2.5 sm:py-2 text-sm sm:text-base text-white rounded-md font-semibold"
                >
                  Eliminar
                </button>
              )}

              <button
                type="button"
                onClick={() => navigate("/mypets")}
                className="pet-form-button-cancel px-4 py-2.5 sm:py-2 text-sm sm:text-base text-white rounded-md font-semibold"
              >
                Cancelar
              </button>
            </div>

            <p className="text-xs sm:text-sm text-white/80 text-center mt-2" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
              * Campos requeridos
            </p>
          </form>
        </div>
      </div>
    </>
  );
}