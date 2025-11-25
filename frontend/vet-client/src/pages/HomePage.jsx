import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import '../components/css/googlemap.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handleAgendarTurno = () => {
    navigate("/turnos");
  };

  const initMap = () => {
    if (!window.L) return;

    try {
      const mapContainer = document.getElementById('map');
      
      // Evitar reinicializar si ya existe
      if (mapContainer && mapContainer._leaflet_map) {
        return;
      }

      // Coordenadas de Av. Cabildo 4082, Buenos Aires
      const lat = -34.56583;
      const lng = -58.47052;
      const map = window.L.map('map').setView([lat, lng], 16);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      window.L.marker([lat, lng])
        .addTo(map)
        .bindPopup('<strong>Clínica Veterinaria</strong><br>Av. Cabildo 4082, CABA');
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    // Pequeño delay para asegurar que el DOM esté listo
    const timer = setTimeout(() => {
      initMap();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Sección Hero con Fondo - FULLWIDTH */}
      <div className="imageBackground relative w-full h-screen flex items-center">
        <img
          src="/fondo.jpg"
          alt="Fondo"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Contenido Hero */}
        <div className="content relative w-1/3 left-0 bottom-27 gap-4 flex flex-col items-start p-8">
          <h2 className="leading-tight text-white text-4xl font-bold">
            Cuidamos a tus Mascotas
          </h2>
          <h3 className="text-white text-lg leading-relaxed">
            Somos una clínica veterinaria integral, pioneros en la atención
            especializada para tus mascotas. Agendá ahora tu consulta
          </h3>
          <button
            onClick={handleAgendarTurno}
            className="rounded-4xl px-6 py-3 border-2 border-white cursor-pointer bg-transparent text-white font-semibold hover:bg-white hover:text-black hover:scale-105 active:opacity-70 transition-all duration-300"
          >
            Agendar turno
          </button>
        </div>
      </div>

      {/* Sección Mapa - CENTRADA */}
      <section className="mapa-section w-full py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h3 className="mapa-title text-3xl font-bold mb-8 text-center text-gray-800">
            Encontranos acá 📍
          </h3>
          <div
            id="map"
            className="mapa-container w-full rounded-lg shadow-lg mb-8"
            style={{
              height: '400px',
              backgroundColor: '#e5e7eb'
            }}
          ></div>
          <div className="mapa-info bg-white p-6 rounded-lg shadow">
            <p className="text-center text-gray-700 text-lg">
              📍 Av. Cabildo 4082, CABA | 🕒 Lun-Vie 10:00-20:00 Sab 10:00-12:30 Dom cerrado| 📞 (11) 1234-5678
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;