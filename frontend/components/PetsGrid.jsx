import { useEffect, useState } from 'react';
import Tarjeta from './Tarjeta';

const API_BASE = 'https://my-api-pets.onrender.com/api/pets';

function PetsGrid() {
  const [Pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(API_BASE)
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener las Mascotas');
        return res.json();
      })
      .then(data => {
        setPets(data); 
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('No se pudieron cargar las Mascotas');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando Mascotas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="tarjeta-grid-container">
      {Pets.map((pet) => (
        <Tarjeta key={pet.id} pet={pet} />
      ))}
    </div>
  );
}

export default PetsGrid;
