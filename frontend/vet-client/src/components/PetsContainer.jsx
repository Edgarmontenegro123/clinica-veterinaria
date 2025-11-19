import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegTrashAlt } from "react-icons/fa";
import { deletePetPermanently } from "../services/pets.service";
import { useAuthStore } from "../store/authStore";
import Swal from "sweetalert2";

const PetsContainer = ({ pets, setPets }) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();
  const [selectedPet, setSelectedPet] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleDeletePet = async (petId) => {
    try {
      const result = await Swal.fire({
        title: "¿Eliminar permanentemente esta mascota?",
        html: "<strong>¡ADVERTENCIA!</strong><br/>Esta acción eliminará la mascota definitivamente de la base de datos.<br/><br/>Si solo deseas marcarla como fallecida, usa el botón 'Gestionar' → 'Marcar como Fallecida'.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Sí, eliminar permanentemente",
        cancelButtonText: "Cancelar",
        focusCancel: true,
      });

      if (result.isConfirmed) {
        await deletePetPermanently(petId);
        await Swal.fire({
          icon: "success",
          title: "¡Mascota eliminada permanentemente!",
          text: "La mascota ha sido eliminada de la base de datos.",
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

  const handleImageClick = (pet) => {
    if (!pet.image || pet.image === './no-image.png') {
      // Si no hay imagen, redirigir a la página de detalles
      navigate(`/pets/${pet.id}`);
    } else {
      // Si hay imagen, mostrar modal
      setSelectedPet(pet);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPet(null);
  };

  return (
    <>
    <div className="w-full px-4 pt-4 pb-12">
      {/* Grid responsive: 1 columna en móvil, 2 en tablet, 3-4 en desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 place-items-center">
        {pets.map((pet) => (
          <div key={pet.id} className="w-full max-w-[280px] flex flex-col items-center gap-2">
            {/* Tarjeta de mascota */}
            <div className="relative rounded-2xl h-[200px] w-full border-2 border-gray-300 overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-shadow">
              <img
                src={pet.image || './no-image.png'}
                alt={pet.name}
                className={`w-full h-full object-cover transition-opacity ${!pet.is_active ? 'opacity-40 grayscale' : ''}`}
                onClick={() => handleImageClick(pet)}
              />

              {/* Indicador de mascota fallecida */}
              {!pet.is_active && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 px-6 py-3 rounded-lg border-2 border-red-600 pointer-events-none">
                  <p className="text-red-500 font-bold text-lg text-center whitespace-nowrap">
                    FALLECIDA
                  </p>
                </div>
              )}

              {/* Botón de eliminar - Solo para admin */}
              {isAdmin && (
                <button
                  className="absolute bottom-2 right-2 text-red-700 bg-white/70 rounded-full p-2 hover:bg-white transition-all hover:scale-110"
                  onClick={() => handleDeletePet(pet.id)}
                >
                  <FaRegTrashAlt size={18} />
                </button>
              )}
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

    {/* Modal para mostrar imagen maximizada */}
    {showModal && selectedPet && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        style={{ paddingTop: 'calc(6rem + 10px)' }}
        onClick={closeModal}
      >
        <div
          className="relative max-w-5xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botón cerrar */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition-all hover:scale-110 shadow-lg"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="flex flex-col md:flex-row">
            {/* Imagen */}
            <div className="md:w-2/3 bg-gray-100 flex items-center justify-center p-6">
              <img
                src={selectedPet.image}
                alt={selectedPet.name}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
              />
            </div>

            {/* Información */}
            <div className="md:w-1/3 p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b-2 border-blue-400 pb-2">
                {selectedPet.name}
              </h2>

              <div className="space-y-3">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-sm font-semibold text-blue-600">Especie</p>
                  <p className="text-lg text-gray-800">{selectedPet.species || 'No especificado'}</p>
                </div>

                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-sm font-semibold text-blue-600">Raza</p>
                  <p className="text-lg text-gray-800">{selectedPet.breed || 'No especificado'}</p>
                </div>

                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-sm font-semibold text-blue-600">Edad</p>
                  <p className="text-lg text-gray-800">{selectedPet.age} años</p>
                </div>

                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-sm font-semibold text-blue-600">Sexo</p>
                  <p className="text-lg text-gray-800">{selectedPet.sex || 'No especificado'}</p>
                </div>

                {selectedPet.birth_date && (
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm font-semibold text-blue-600">Fecha de Nacimiento</p>
                    <p className="text-lg text-gray-800">
                      {new Date(selectedPet.birth_date).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}

                {selectedPet.history && (
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm font-semibold text-blue-600">Historia Clínica</p>
                    <p className="text-sm text-gray-700 max-h-32 overflow-y-auto">
                      {selectedPet.history}
                    </p>
                  </div>
                )}

                {/* Indicador si está fallecida */}
                {!selectedPet.is_active && (
                  <div className="bg-red-100 border-2 border-red-600 p-3 rounded-lg shadow-sm">
                    <p className="text-red-600 font-bold text-center text-lg">
                      ⚰️ FALLECIDA
                    </p>
                  </div>
                )}

                {/* Información del dueño (solo admin) */}
                {isAdmin && selectedPet.users && (
                  <div className="bg-indigo-100 p-3 rounded-lg shadow-sm border-2 border-indigo-300">
                    <p className="text-sm font-semibold text-indigo-700 mb-2">👤 Dueño</p>
                    <p className="text-sm text-gray-800 font-medium">{selectedPet.users.name}</p>
                    <p className="text-xs text-gray-600">{selectedPet.users.email}</p>
                    {selectedPet.users.phone && (
                      <p className="text-xs text-gray-600 mt-1">📞 {selectedPet.users.phone}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default PetsContainer;
