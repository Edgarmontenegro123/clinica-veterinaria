import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore.js";
import AdoptionContainer from "../components/AdoptionContainer.jsx";
import CatSpinner from "../components/CatSpinner.jsx";
import { getAdoptionPets } from "../services/adoption.service.js";

const AdoptionPage = () => {
  const { user, isAdmin } = useAuthStore();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Detectar cambios en el tamaño de la pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchAdoptionPets = async () => {
      try {
        setLoading(true);
        console.log("AdoptionPage - Fetching adoption pets...");
        const adoptionPets = await getAdoptionPets();
        console.log("AdoptionPage - Adoption pets fetched:", adoptionPets);
        setPets(adoptionPets || []);
      } catch (error) {
        console.error("Failed to fetch adoption pets", error);
        setPets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAdoptionPets();
  }, []);

  // Filtrar mascotas por nombre (solo admin)
  const filteredPets = isAdmin
    ? pets.filter(pet => pet.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : pets;

  return (
    <div className="flex-1 petsBackgroundImage overflow-y-auto">
      <img
        src={isMobile ? "/fondo1celu.png" : "/fondo1.jpg"}
        alt="Fondo imagen"
        className="petBackground"
      />
      <div className={`relative z-10 w-full py-6 flex justify-center ${pets.length === 0 || loading ? 'min-h-full items-center' : 'items-start'}`}>
        {loading ? (
          <CatSpinner />
        ) : pets.length === 0 ? (
          <div className="w-[500px] p-8 rounded-2xl bg-white shadow-2xl text-center flex flex-col justify-center items-center">
            <div className="mb-6">
              <svg
                className="w-20 h-20 mx-auto mb-4 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                No hay mascotas disponibles para adopción
              </h2>
              <p className="text-gray-600 text-lg">
                {isAdmin
                  ? "Agrega mascotas disponibles para adopción"
                  : "Vuelve pronto para ver nuevas mascotas disponibles"}
              </p>
            </div>
            {isAdmin && (
              <div className="flex gap-4 justify-center w-full">
                <a
                  className="auth-button auth-button-login flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold"
                  href="/admin/adoption/new"
                >
                  Agregar Mascota
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full max-w-7xl">
            {/* Título de la página */}
            <div className="px-4 mb-6">
              <h1 className="text-4xl font-bold text-center text-yellow-100 mb-2">
                🐾 Adopciones
              </h1>
              <p className="text-center text-yellow-50 text-lg">
                {isAdmin
                  ? "Gestiona las mascotas disponibles para adopción"
                  : "Encuentra a tu nuevo mejor amigo"}
              </p>
            </div>

            {/* Barra de búsqueda - Solo para admin */}
            {isAdmin && (
              <div className="px-4 mb-6">
                <div className="relative max-w-md mx-auto">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar mascota por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-300 bg-white/90 backdrop-blur-sm
                      focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200
                      text-gray-800 placeholder-gray-500 shadow-lg transition-all"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                {searchTerm && (
                  <p className="text-center mt-3 text-yellow-100 text-sm">
                    {filteredPets.length === 0
                      ? "No se encontraron mascotas con ese nombre"
                      : `Se ${filteredPets.length === 1 ? 'encontró' : 'encontraron'} ${filteredPets.length} ${filteredPets.length === 1 ? 'mascota' : 'mascotas'}`
                    }
                  </p>
                )}
              </div>
            )}

            <AdoptionContainer pets={filteredPets} setPets={setPets} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdoptionPage;
