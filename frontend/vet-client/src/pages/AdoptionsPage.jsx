import React, { useEffect, useState } from "react";
import { FaPaw } from "react-icons/fa";
import { getPetsForAdoptions } from "../services/pets.service";

const AdoptionsPage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPetsAdoptions = async () => {
      const pets = await getPetsForAdoptions();
      setPets(pets);
      setLoading(false);
    };
    fetchPetsAdoptions();
  }, [pets]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-gray-600 animate-pulse">
          Cargando mascotas...
        </div>
      </div>
    );

  return (
    <div
      className="min-h-screen py-12 px-6 flex flex-col w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(/fondo1.jpg)' }}
    >
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800 flex items-center justify-center gap-3">
        <FaPaw className="text-pink-600" />
        Mascotas en Adopción
      </h1>

      {pets.length === 0 ? (
        <p className="text-center text-#fffdfd-600 text-lg">
          No hay mascotas disponibles por ahora 🐾
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <img
                src={pet.image || '/placeholder-pet.jpg'}
                alt={pet.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-5">
                <h2 className="text-2xl font-bold text-gray-800">{pet.name}</h2>
                <p className="text-gray-600 mt-1">
                  {pet.species} • {pet.age} año{pet.age !== 1 && "s"} •{" "}
                  {pet.sex == 'male' ? 'Macho' : 'Hembra'}
                </p>

                <button
                  onClick={() => alert(`Adoptar a ${pet.name}`)}
                  className="mt-4 w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg font-semibold transition-colors"
                >
                  Adoptar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdoptionsPage;
