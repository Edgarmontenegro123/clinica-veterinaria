import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore.js";
import PetsContainer from "../components/PetsContainer.jsx";
import { getPets } from "../services/pets.service.js";

const PetsPage = () => {
  const { user } = useAuthStore();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      console.log("PetsPage - User:", user);

      if (!user) {
        console.log("PetsPage - No user found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("PetsPage - Fetching pets...");
        const petsDB = await getPets();
        console.log("PetsPage - Pets fetched:", petsDB);
        setPets(petsDB || []);
      } catch (error) {
        console.error("Failed to fetch pets", error);
        setPets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, [user]);

  return (
    <div className="flex-1 flex  petsBackgroundImage">
      <img src="/mascotas2.avif" alt="Fondo imagen" className="petBackground" />
      {!user ? (
        <div
          className="auth-message-container absolute z-10 w-[500px] p-8 rounded-2xl bg-white shadow-2xl text-center flex flex-col justify-center items-center
  left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
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
      ) : (
        <div className="container absolute z-10 h-full flex flex-col justify-center items-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {pets.length === 0 ? (
            <div className="auth-message-container w-[500px] p-8 rounded-2xl bg-white shadow-2xl text-center flex flex-col justify-center items-center">
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
            <div className="flex-1">
              <PetsContainer pets={pets} setPets={setPets} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PetsPage;
