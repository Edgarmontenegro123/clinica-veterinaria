import { useEffect, useState } from "react";
import { getPets } from "../services/pets.service.js";
import { useAuthStore } from "../store/authStore.js";
import PetsContainer from "../components/PetsContainer.jsx";
import { getUserPets } from "../services/appointments.service.js";

const PetsPage = () => {
  const { user } = useAuthStore();
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const petsDB = await getUserPets(user.id);
        setPets(petsDB);
      } catch (error) {
        console.error("Failed to fetch pets", error);
      }
    };
    fetchPets();
  }, [pets]);

  return (
    <div className="flex-1 flex  petsBackgroundImage">
      <img src="/mascotas2.avif" alt="Fondo imagen" className="petBackground" />
      {!user ? (
        <div
          className="absolute z-10 border-4 border-red-800 w-1/3 h-48 p-10 rounded-3xl bg-white/70 text-center flex flex-col justify-center items-center 
  left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <p>
            Por favor,{" "}
            <a href="/login" className="text-blue-800 font-bold">
              inicia sesión
            </a>{" "}
            para ver tus mascotas.
          </p>
          <div className="flex gap-5 justify-center mt-4">
            <a className="px-4 py-2 border rounded-xl" href="/login">
              Iniciar sesión
            </a>
            <a className="px-4 py-2 border rounded-xl" href="/Register">
              Registrarse
            </a>
          </div>
        </div>
      ) : (
        <div className="container absolute z-10  h-full flex flex-col  justify-center items-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {pets.length === 0 ? (
        <div>
           <p>No tienes mascotas registradas.</p>
            <a href='/PetRegister'>
              Registrá tu mascota
            </a>
         </div>
          ) : (
            <div className="flex-1 ">
              <PetsContainer pets={pets} setPets={setPets} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PetsPage;
