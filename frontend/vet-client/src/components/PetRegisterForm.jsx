import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createPet, updatePet, deletePet } from "../services/pets.service.js";
import { useAuthStore } from "../store/authStore.js";
import { supabase } from "../services/supabase.js";

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

  // Cargar datos si estamos en modo edición
  useEffect(() => {
    if (petData && mode === "edit") {
      reset({
        ...petData,
        vaccines: Array.isArray(petData.vaccines) ? petData.vaccines.join(", ") : petData.vaccines || "",
        birth_date: petData.birth_date ? petData.birth_date.split('T')[0] : ""
      });
      setImagePreview(petData.image || null);
    }
  }, [petData, mode, reset]);

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

  const onSubmit = async (data) => {
    console.log(data);

    // Validación adicional para birth_date
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

      // Subir imagen a Supabase Storage si hay una nueva imagen
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `pets/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('pet-images')
          .upload(filePath, imageFile);

        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          throw new Error("No se pudo subir la imagen");
        }

        // Obtener la URL pública de la imagen
        const { data: publicUrlData } = supabase.storage
          .from('pet-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      // Procesar vacunas como array
      const processedData = {
        ...data,
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

      console.log(response);

      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/mypets");
      }
    } catch (error) {
      console.error("Pet operation failed", error);
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
        console.error("Delete failed", error);
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
    <form
      className="flex flex-col gap-3 justify-center border-2 border-white/30 p-4 sm:p-5 md:p-6 lg:p-8 rounded-xl shadow-2xl w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-2xl lg:max-w-3xl overflow-y-auto"
      style={{
        background: "rgba(0, 0, 0, 0.45)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)"
      }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 md:mb-4 text-center" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
        {mode === "edit" ? "Editar Mascota" : "Registrar Nueva Mascota"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Nombre */}
        <div className="flex flex-col">
          <label className="font-semibold text-white mb-1 text-sm sm:text-base" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>Nombre *</label>
          <input
            className="bg-white/20 text-white px-3 py-2 text-sm sm:text-base rounded-md border border-white/30 focus:border-blue-400 focus:outline-none placeholder-white/60 backdrop-blur-sm"
            placeholder="Ej: Max"
            {...register("name", { required: "El nombre es requerido" })}
          />
          {errors.name && <span className="text-red-300 text-xs sm:text-sm mt-1 font-semibold" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.7)" }}>{errors.name.message}</span>}
        </div>

        {/* Especie */}
        <div className="flex flex-col">
          <label className="font-semibold text-white mb-1 text-sm sm:text-base" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>Especie *</label>
          <select
            className="bg-white/20 text-white px-3 py-2 text-sm sm:text-base rounded-md border border-white/30 focus:border-blue-400 focus:outline-none backdrop-blur-sm"
            {...register("species", { required: "La especie es requerida" })}
          >
            <option value="" className="bg-gray-800">Selecciona especie</option>
            <option value="Perro" className="bg-gray-800">Perro</option>
            <option value="Gato" className="bg-gray-800">Gato</option>
            <option value="Ave" className="bg-gray-800">Ave</option>
            <option value="Otro" className="bg-gray-800">Otro</option>
          </select>
          {errors.species && <span className="text-red-300 text-xs sm:text-sm mt-1 font-semibold" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.7)" }}>{errors.species.message}</span>}
        </div>

        {/* Raza */}
        <div className="flex flex-col">
          <label className="font-semibold text-white mb-1 text-sm sm:text-base" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>Raza *</label>
          <input
            className="bg-white/20 text-white px-3 py-2 text-sm sm:text-base rounded-md border border-white/30 focus:border-blue-400 focus:outline-none placeholder-white/60 backdrop-blur-sm"
            placeholder="Ej: Mestizo, Labrador, Siamés"
            {...register("breed", { required: "La raza es requerida" })}
          />
          {errors.breed && <span className="text-red-300 text-xs sm:text-sm mt-1 font-semibold" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.7)" }}>{errors.breed.message}</span>}
        </div>

        {/* Sexo */}
        <div className="flex flex-col">
          <label className="font-semibold text-white mb-1 text-sm sm:text-base" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>Sexo *</label>
          <select
            className="bg-white/20 text-white px-3 py-2 text-sm sm:text-base rounded-md border border-white/30 focus:border-blue-400 focus:outline-none backdrop-blur-sm"
            {...register("sex", { required: "El sexo es requerido" })}
          >
            <option value="" className="bg-gray-800">Selecciona sexo</option>
            <option value="Macho" className="bg-gray-800">Macho</option>
            <option value="Hembra" className="bg-gray-800">Hembra</option>
          </select>
          {errors.sex && <span className="text-red-300 text-xs sm:text-sm mt-1 font-semibold" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.7)" }}>{errors.sex.message}</span>}
        </div>

        {/* Edad */}
        <div className="flex flex-col">
          <label className="font-semibold text-white mb-1 text-sm sm:text-base" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>Edad (años) *</label>
          <input
            className="bg-white/20 text-white px-3 py-2 text-sm sm:text-base rounded-md border border-white/30 focus:border-blue-400 focus:outline-none placeholder-white/60 backdrop-blur-sm"
            placeholder="Ej: 3"
            type="number"
            min="0"
            step="1"
            {...register("age", {
              required: "La edad es requerida",
              min: { value: 0, message: "La edad debe ser positiva" },
              valueAsNumber: true
            })}
          />
          {errors.age && <span className="text-red-300 text-xs sm:text-sm mt-1 font-semibold" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.7)" }}>{errors.age.message}</span>}
        </div>

        {/* Fecha de nacimiento */}
        <div className="flex flex-col">
          <label className="font-semibold text-white mb-1 text-sm sm:text-base" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
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
            className="bg-white/20 text-white px-3 py-2 text-sm sm:text-base rounded-md border border-white/30 focus:border-blue-400 focus:outline-none backdrop-blur-sm"
            {...register("birth_date", {
              validate: {
                notFuture: value => {
                  if (!value) return true; // Permitir vacío (opcional)
                  const selectedDate = new Date(value + 'T00:00:00');
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return selectedDate <= today || "La fecha de nacimiento no puede ser futura";
                },
                notTooOld: value => {
                  if (!value) return true; // Permitir vacío (opcional)
                  const selectedDate = new Date(value + 'T00:00:00');
                  const minDate = new Date();
                  minDate.setFullYear(minDate.getFullYear() - 200);
                  minDate.setHours(0, 0, 0, 0);
                  return selectedDate >= minDate || "La fecha de nacimiento no puede ser mayor a 200 años";
                }
              }
            })}
          />
          {errors.birth_date && <span className="text-red-300 text-xs sm:text-sm mt-1 font-semibold" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.7)" }}>{errors.birth_date.message}</span>}
        </div>
      </div>

      {/* Vacunas */}
      <div className="flex flex-col">
        <label className="font-semibold text-white mb-1 text-sm sm:text-base" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
          Vacunas <span className="text-white/60 text-xs sm:text-sm font-normal">(opcional)</span>
          <span className="text-xs sm:text-sm font-normal text-white/70 ml-2">(separadas por comas)</span>
        </label>
        <input
          className="bg-white/20 text-white px-3 py-2 text-sm sm:text-base rounded-md border border-white/30 focus:border-blue-400 focus:outline-none placeholder-white/60 backdrop-blur-sm"
          placeholder="Ej: Rabia, Parvovirus, Moquillo"
          {...register("vaccines")}
        />
      </div>

      {/* Historial médico - Solo visible para admin */}
      {isAdmin && (
        <div className="flex flex-col">
          <label className="font-semibold text-white mb-1 text-sm sm:text-base" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>Historial Médico</label>
          <textarea
            className="bg-white/20 text-white px-3 py-2 text-sm sm:text-base rounded-md border border-white/30 focus:border-blue-400 focus:outline-none resize-vertical placeholder-white/60 backdrop-blur-sm"
            placeholder="Información relevante sobre la salud de la mascota..."
            rows="4"
            {...register("history")}
          />
        </div>
      )}

      {/* Imagen de la mascota */}
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
              className="bg-white/20 text-white px-3 py-2 text-sm sm:text-base rounded-md border border-white/30 focus:border-blue-400 focus:outline-none backdrop-blur-sm w-full file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-md file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 file:cursor-pointer"
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

      {/* Solo administradores pueden ver/editar has_owner */}
      {isAdmin && (
        <div className="flex items-center gap-3 p-3 bg-yellow-500/20 rounded-md border border-yellow-400/40 backdrop-blur-sm">
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

      {/* Botones */}
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
  );
}
