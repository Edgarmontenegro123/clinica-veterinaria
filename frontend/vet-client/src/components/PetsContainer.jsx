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
    <div className="w-full h-full px-4 py-6">
      {/* Grid responsive: 1 columna en móvil, 2 en tablet, 3-4 en desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-items-center">
        {pets.map((pet) => (
          <div key={pet.id} className="w-full max-w-[280px] flex flex-col items-center gap-2">
            {/* Tarjeta de mascota */}
            <div className="relative rounded-2xl h-[200px] w-full border-2 border-gray-300 overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-shadow">
              <img
                src={pet.image || './no-image.png'}
                alt={pet.name}
                className="w-full h-full object-cover"
                onClick={() => navigate(`/pets/${pet.id}`)}
              />
              <button
                className="absolute bottom-2 right-2 text-red-700 bg-white/70 rounded-full p-2 hover:bg-white transition-all hover:scale-110"
                onClick={() => handleDeletePet(pet.id)}
              >
                <FaRegTrashAlt size={18} />
              </button>
            </div>

            {/* Información de la mascota */}
            <div className="w-full flex flex-col items-center">
              <h5 className="font-bold text-xl text-yellow-200 truncate w-full text-center">{pet.name}</h5>
              <p className="text-lg text-yellow-100">{pet.age} años</p>

              {/* Información del dueño (solo admin) */}
              {isAdmin && pet.users && (
                <div className="mt-2 w-full text-center bg-blue-900/50 px-3 py-3 rounded-lg border border-blue-700/30">
                  <p className="text-xs text-blue-200 font-semibold mb-1">👤 Dueño</p>
                  <p className="text-sm text-white font-medium truncate">{pet.users.name}</p>
                  <p className="text-xs text-blue-300 truncate">{pet.users.email}</p>
                  {pet.users.phone && (
                    <p className="text-xs text-blue-300 mt-1">📞 {pet.users.phone}</p>
                  )}
                  <button
                    onClick={() => navigate(`/admin/pets/${pet.id}`)}
                    className="mt-3 w-full px-3 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    🔧 Gestionar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Botón para agregar mascota */}
        <div className="w-full max-w-[280px] h-[200px] flex items-center justify-center">
          <a
            href="/petregister"
            className="relative bg-green-600 w-20 h-20 rounded-xl flex items-center justify-center group border-2 border-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <span className="absolute w-10 h-2 bg-white rounded-full group-hover:scale-125 transition-transform"></span>
            <span className="absolute w-2 h-10 bg-white rounded-full group-hover:scale-125 transition-transform"></span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default PetsContainer;
