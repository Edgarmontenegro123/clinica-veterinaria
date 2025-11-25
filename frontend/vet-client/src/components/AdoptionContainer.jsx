import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegTrashAlt, FaEdit, FaHeart } from "react-icons/fa";
import { deleteAdoptionPet, adoptPet } from "../services/adoption.service";
import { useAuthStore } from "../store/authStore";
import Swal from "sweetalert2";

const AdoptionContainer = ({ pets, setPets }) => {
  const navigate = useNavigate();
  const { isAdmin, user } = useAuthStore();
  const [selectedPet, setSelectedPet] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleDeletePet = async (petId) => {
    try {
      const result = await Swal.fire({
        title: "¿Eliminar esta mascota de adopción?",
        text: "Esta acción eliminará la mascota de la lista de adopciones.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        focusCancel: true,
      });

      if (result.isConfirmed) {
        await deleteAdoptionPet(petId);
        await Swal.fire({
          icon: "success",
          title: "¡Mascota eliminada!",
          text: "La mascota ha sido eliminada de la lista de adopciones.",
          confirmButtonColor: "#3085d6",
        });

        setPets(prev => prev.filter(pet => pet.id !== petId));
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudo eliminar la mascota. Intente nuevamente.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleAdoptPet = async (pet) => {
    if (!user) {
      await Swal.fire({
        icon: "warning",
        title: "Inicia sesión",
        text: "Debes iniciar sesión para adoptar una mascota.",
        confirmButtonColor: "#3085d6",
      });
      navigate('/login');
      return;
    }

    try {
      const result = await Swal.fire({
        title: `¿Adoptar a ${pet.name}?`,
        html: `
          <div class="text-left">
            <p class="mb-2">Estás a punto de adoptar a <strong>${pet.name}</strong>.</p>
            <p class="mb-2"><strong>Especie:</strong> ${pet.species}</p>
            <p class="mb-2"><strong>Edad:</strong> ${pet.calculatedAge ?? pet.age} años</p>
            <p class="mb-2"><strong>Sexo:</strong> ${pet.sex}</p>
            <br/>
            <p class="text-sm text-gray-600">Al adoptar, esta mascota aparecerá en tu página de "Mis Mascotas".</p>
          </div>
        `,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#16a34a",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Sí, adoptar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        await adoptPet(pet.id);
        await Swal.fire({
          icon: "success",
          title: `¡Felicidades! 🎉`,
          html: `
            <p>Has adoptado a <strong>${pet.name}</strong>.</p>
            <p class="mt-2">Ahora puedes verla en tu página de "Mis Mascotas".</p>
          `,
          confirmButtonColor: "#3085d6",
        });

        // Remover la mascota de la lista de adopciones
        setPets(prev => prev.filter(p => p.id !== pet.id));
        closeModal();
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudo adoptar la mascota. Intente nuevamente.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleImageClick = (pet) => {
    setSelectedPet(pet);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPet(null);
  };

  const handleEditPet = (petId) => {
    navigate(`/admin/adoption/${petId}/edit`);
  };

  return (
    <>
      <div className="w-full px-4 pt-4 pb-12">
        {/* Grid responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 place-items-center">
          {pets.map((pet) => (
            <div key={pet.id} className="w-full max-w-[280px] flex flex-col items-center gap-2">
              {/* Tarjeta de mascota */}
              <div className="relative rounded-2xl h-[280px] w-full border-2 border-gray-300 overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all hover:scale-105">
                <img
                  src={pet.image || './no-image.png'}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                  onClick={() => handleImageClick(pet)}
                />

                {/* Badge de "Disponible para adopción" */}
                <div className="absolute top-2 left-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  ✓ Disponible
                </div>

                {/* Botones de admin */}
                {isAdmin && (
                  <div className="absolute bottom-2 right-2 flex gap-2">
                    <button
                      className="text-blue-700 bg-white/90 rounded-full p-2 hover:bg-white transition-all hover:scale-110 shadow-lg"
                      onClick={() => handleEditPet(pet.id)}
                      title="Editar"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      className="text-red-700 bg-white/90 rounded-full p-2 hover:bg-white transition-all hover:scale-110 shadow-lg"
                      onClick={() => handleDeletePet(pet.id)}
                      title="Eliminar"
                    >
                      <FaRegTrashAlt size={18} />
                    </button>
                  </div>
                )}

                {/* Botón de adoptar para usuarios */}
                {!isAdmin && (
                  <button
                    className="absolute bottom-2 right-2 bg-pink-600 text-white rounded-full p-3 hover:bg-pink-700 transition-all hover:scale-110 shadow-lg"
                    onClick={() => handleAdoptPet(pet)}
                    title="Adoptar"
                  >
                    <FaHeart size={20} />
                  </button>
                )}
              </div>

              {/* Información de la mascota */}
              <div className="w-full flex flex-col items-center">
                <h5 className="font-bold text-xl text-yellow-200 truncate w-full text-center">{pet.name}</h5>
                <p className="text-lg text-yellow-100">{pet.calculatedAge ?? pet.age} años</p>
                <p className="text-sm text-yellow-100">{pet.species} - {pet.breed}</p>
              </div>
            </div>
          ))}

          {/* Botón para agregar mascota (solo admin) */}
          {isAdmin && (
            <div className="w-full max-w-[280px] h-[280px] flex items-center justify-center">
              <a
                href="/admin/adoption/new"
                className="relative bg-green-600 w-20 h-20 rounded-xl flex items-center justify-center group border-2 border-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <span className="absolute w-10 h-2 bg-white rounded-full group-hover:scale-125 transition-transform"></span>
                <span className="absolute w-2 h-10 bg-white rounded-full group-hover:scale-125 transition-transform"></span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Modal para mostrar información detallada */}
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
                  src={selectedPet.image || './no-image.png'}
                  alt={selectedPet.name}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                />
              </div>

              {/* Información */}
              <div className="md:w-1/3 p-6 bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="flex items-center justify-between mb-4 border-b-2 border-green-400 pb-2">
                  <h2 className="text-3xl font-bold text-gray-800">
                    {selectedPet.name}
                  </h2>
                  <span className="text-green-600 text-2xl">🐾</span>
                </div>

                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm font-semibold text-green-600">Especie</p>
                    <p className="text-lg text-gray-800">{selectedPet.species || 'No especificado'}</p>
                  </div>

                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm font-semibold text-green-600">Raza</p>
                    <p className="text-lg text-gray-800">{selectedPet.breed || 'No especificado'}</p>
                  </div>

                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm font-semibold text-green-600">Edad</p>
                    <p className="text-lg text-gray-800">{selectedPet.calculatedAge ?? selectedPet.age} años</p>
                  </div>

                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm font-semibold text-green-600">Sexo</p>
                    <p className="text-lg text-gray-800">{selectedPet.sex || 'No especificado'}</p>
                  </div>

                  {selectedPet.birth_date && (
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm font-semibold text-green-600">Fecha de Nacimiento</p>
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
                      <p className="text-sm font-semibold text-green-600">Historia</p>
                      <p className="text-sm text-gray-700 max-h-32 overflow-y-auto">
                        {selectedPet.history}
                      </p>
                    </div>
                  )}

                  {/* Botón de adoptar */}
                  {!isAdmin && (
                    <button
                      onClick={() => handleAdoptPet(selectedPet)}
                      className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-700 text-white font-bold rounded-lg hover:from-pink-700 hover:to-pink-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <FaHeart size={20} />
                      Adoptar a {selectedPet.name}
                    </button>
                  )}

                  {/* Botones de admin */}
                  {isAdmin && (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleEditPet(selectedPet.id)}
                        className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2"
                      >
                        <FaEdit size={16} />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeletePet(selectedPet.id)}
                        className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all shadow-lg flex items-center justify-center gap-2"
                      >
                        <FaRegTrashAlt size={16} />
                        Eliminar
                      </button>
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

export default AdoptionContainer;
