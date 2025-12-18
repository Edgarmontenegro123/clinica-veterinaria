import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore.js";
import PetsContainer from "../components/PetsContainer.jsx";
import CatSpinner from "../components/CatSpinner.jsx";
import { getPets } from "../services/pets.service.js";

const PetsPage = () => {
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
    const fetchPets = async () => {

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const petsDB = await getPets();
        setPets(petsDB || []);
      } catch (error) {
        console.error('Error al cargar mascotas:', error);
        console.error('Detalles del error:', error.message, error.details, error.hint);
        setPets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, [user]);

  // Filtrar mascotas por nombre
  const filteredPets = pets.filter(pet =>
    pet.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 petsBackgroundImage overflow-y-auto">
      <img
        src={isMobile ? "/fondocelu.png" : "/fondo2.jpg"}
        alt="Fondo imagen"
        className="petBackground"
      />
      <div className={`relative z-10 w-full py-6 flex justify-center ${pets.length === 0 || !user || loading ? 'min-h-full items-center' : 'items-start'}`}>
        {!user ? (
          <div className="w-[500px] p-8 rounded-2xl bg-white shadow-2xl text-center flex flex-col justify-center items-center"
        >
          <div className="mb-6">
            <svg
              className="w-20 h-20 mx-auto mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Acceso Restringido
            </h2>
            <p className="text-gray-600 text-lg">
              Por favor, inicia sesión para ver tus mascotas
            </p>
          </div>
          <div className="flex gap-4 justify-center w-full">
            <a
              className="auth-button auth-button-login flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold"
              href="/login"
            >
              Iniciar sesión
            </a>
            <a
              className="auth-button auth-button-register flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold"
              href="/login?mode=register"
            >
              Registrarse
            </a>
          </div>
        </div>
        ) : loading ? (
          <CatSpinner />
        ) : pets.length === 0 ? (
          <div className="w-[500px] p-8 rounded-2xl bg-white shadow-2xl text-center flex flex-col justify-center items-center">
              <div className="mb-6">
                <svg
                  className="w-20 h-20 mx-auto mb-4 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  No tienes mascotas registradas
                </h2>
                <p className="text-gray-600 text-lg">
                  Registra tu primera mascota para comenzar
                </p>
              </div>
              <div className="flex gap-4 justify-center w-full">
                <a
                  className="auth-button auth-button-login flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold"
                  href="/PetRegister"
                >
                  Registrar Mascota
                </a>
              </div>
            </div>
        ) : (
          <div className="w-full max-w-7xl pets-content-container">
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
                    focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                    hover:border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:scale-[1.02]
                    text-gray-800 placeholder-gray-500 shadow-lg transition-all duration-300 cursor-text"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-600 hover:scale-110 transition-all duration-200 cursor-pointer"
                    title="Limpiar búsqueda"
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

            <PetsContainer pets={isAdmin ? filteredPets : pets} setPets={setPets} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PetsPage;
