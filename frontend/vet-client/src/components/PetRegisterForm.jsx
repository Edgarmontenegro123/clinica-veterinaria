import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createPet, createPetForAdoption } from "../services/pets.service.js";
import { useAuthStore } from "../store/authStore.js";

export default function PetRegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const { roles } = useAuthStore();

  const imageFile = watch("image");

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  }, [imageFile]);

  const onSubmit = async (data) => {
    console.log(data)
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("species", data.species);
      formData.append("age", data.age.toString());
      formData.append("sex", data.sex);
      formData.append("breed", data.breed);

      if (data.image && data.image.length > 0) {
        formData.append("file", data.image[0]);
      }

      if (data.has_owner === true) {
        const response = await createPetForAdoption(formData);
      } else {
        const response = await createPet(formData);
      }

      await Swal.fire({
        icon: "success",
        title: "¡Mascota registrada!",
        text: `La mascota ${data.name} se registró correctamente.`,
        confirmButtonColor: "#3085d6",
      });

      navigate("/mypets");
    } catch (error) {
      console.error("Pet registration failed", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo registrar la mascota. Intente nuevamente.",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <form
      className="flex flex-col gap-2 justify-center border-2 p-4 rounded-xl bg-gray-100"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col">
        <label>Nombre</label>
        <input
          className="bg-white px-1 rounded-md"
          placeholder="Nombre"
          {...register("name", { required: true })}
        />
        {errors.name && <span>El campo es requerido</span>}
      </div>

      <div className="flex flex-col">
        <label>Especie</label>
        <select
          className="bg-white px-1 rounded-md"
          {...register("species", { required: true })}
        >
          <option value="">Selecciona especie</option>
          <option value="Perro">Perro</option>
          <option value="Gato">Gato</option>
        </select>
        {errors.species && <span>El campo es requerido</span>}
      </div>

      <div className="flex flex-col">
        <label>Años</label>
        <input
          className="bg-white px-1 rounded-md"
          placeholder="3"
          type="number"
          {...register("age", { required: true, valueAsNumber: true })}
        />
        {errors.age && <span>El campo es requerido</span>}
      </div>

      <div className="flex flex-col">
        <label>Sexo</label>
        <select
          className="bg-white px-1 rounded-md"
          {...register("sex", { required: true })}
        >
          <option value="">Selecciona sexo</option>
          <option value="male">Macho</option>
          <option value="female">Hembra</option>
        </select>
        {errors.sex && <span>El campo es requerido</span>}
      </div>

      <div className="flex flex-col">
        <label>Raza</label>
        <input
          className="bg-white px-1 rounded-md"
          placeholder="Callejero"
          {...register("breed", { required: true })}
        />
        {errors.breed && <span>El campo es requerido</span>}
      </div>
      {roles?.includes("admin") && (
        <div className="flex gap-2 items-end">
          <label>¿Es Adoptable?</label>
          <input
            type="checkbox"
            className="bg-white px-1 rounded-md"
            {...register("has_owner", { valueAsBoolean: true })}
          />
        </div>
      )}

      <div className="flex flex-col">
        <label>Imagen</label>
        <input
          type="file"
          className="bg-white px-1 rounded-md"
          {...register("image", { required: true })}
        />
        {errors.image && <span>El campo es requerido</span>}

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-2 w-40 h-40 object-cover m-auto rounded-md border"
          />
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Crear mascota
      </button>
    </form>
  );
}
