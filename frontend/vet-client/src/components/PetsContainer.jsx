import { useNavigate } from "react-router-dom";
import { FaRegTrashAlt } from "react-icons/fa";
import { deletePet } from "../services/pets.service";
import { useAuthStore } from "../store/authStore";
import Swal from "sweetalert2";

const PetsContainer = ({ pets, setPets }) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();

  const handleDeletePet = async (petId) => {
    try {
      const result = await Swal.fire({
        title: "¿Quieres eliminar la mascota?",
        text: "Esta opción es irreversible!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar!",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        await deletePet(petId);
        await Swal.fire({
          icon: "success",
          title: "¡Mascota eliminada!",
          text: "La mascota se eliminó correctamente.",
          confirmButtonColor: "#3085d6",
        });

        setPets(prev => prev.filter(pet => pet.id !== petId));
      }
    } catch (error) {
      console.error("Pet deletion failed", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar la mascota. Intente nuevamente.",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="flex gap-10 justify-center items-center flex-wrap  h-full">
      {pets.map((pet) => (
        <div key={pet.id} className="flex flex-col items-center gap-2">
          <div className="relative rounded-4xl h-[200px] w-[200px] border-2 border-gray-300 overflow-hidden cursor-pointer">
            <img
              src={pet.image || './no-image.png'}
              alt={pet.name}
              className="w-full h-full object-cover rounded-4xl"
              onClick={() => navigate(`/pets/${pet.id}`)}
            />
            <button
              className="absolute bottom-2 right-2 text-red-700 bg-white/70 rounded-full p-1 hover:bg-white"
              onClick={() => handleDeletePet(pet.id)}
            >
              <FaRegTrashAlt size={20} />
            </button>
          </div>
          <div className="flex flex-col items-center">
            <h5 className="font-bold text-xl text-yellow-200">{pet.name}</h5>
            <p className="text-lg text-yellow-100">{pet.age} años</p>
            {isAdmin && pet.users && (
              <div className="mt-2 text-center bg-blue-900/50 px-3 py-2 rounded-lg">
                <p className="text-sm text-blue-200 font-semibold">Dueño</p>
                <p className="text-sm text-white">{pet.users.name}</p>
                <p className="text-xs text-blue-300">{pet.users.email}</p>
                {pet.users.phone && (
                  <p className="text-xs text-blue-300">📞 {pet.users.phone}</p>
                )}
              </div>
            )}
          </div>
        </div>
      ))}

      <a
        href="/petregister"
        className="relative bg-green-600 w-20 h-20 rounded-xl flex items-center justify-center group border border-white"
      >
        <span className="absolute w-10 h-2 bg-white rounded-full group-hover:scale-125"></span>
        <span className="absolute w-2 h-10 bg-white rounded-full group-hover:scale-125"></span>
      </a>
    </div>
  );
};

export default PetsContainer;
