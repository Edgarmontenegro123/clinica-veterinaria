import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import '../components/css/googlemap.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handleAgendarTurno = () => {
    navigate("/turnos");
  };

  const initMap = () => {
    if (!window.L) {
      console.log('Leaflet no está cargado');
      return;
    }

    try {
      const mapContainer = document.getElementById('map');

      if (!mapContainer) {
        console.log('Contenedor del mapa no encontrado');
        return;
      }

      // Si ya existe un mapa, eliminarlo primero
      if (mapContainer._leaflet_id) {
        mapContainer._leaflet_id = null;
        mapContainer.innerHTML = '';
      }

      const lat = -34.5462;
      const lng = -58.4705;

      const map = window.L.map('map', {
        center: [lat, lng],
        zoom: 16,
        scrollWheelZoom: true
      });

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      window.L.marker([lat, lng])
        .addTo(map)
        .bindPopup('<strong>Clínica Veterinaria</strong><br>Av. Cabildo 4082, CABA')
        .openPopup();

      // Forzar invalidación del tamaño del mapa
      setTimeout(() => {
        map.invalidateSize();
      }, 100);

    } catch (error) {
      console.error('Error inicializando el mapa:', error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      initMap();
    }, 300);

    return () => {
      clearTimeout(timer);
      // Limpiar el mapa al desmontar
      const mapContainer = document.getElementById('map');
      if (mapContainer && mapContainer._leaflet_id) {
        mapContainer._leaflet_id = null;
        mapContainer.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col">

      {/* HERO SECTION */}
      <div className="hero-section relative w-full h-screen overflow-hidden flex items-center">
        {/* Imagen de fondo - Desktop */}
        <img
          src="/fondo.jpg"
          alt="Fondo"
          className="absolute inset-0 w-full h-full object-cover object-center hidden min-[769px]:block"
        />

        {/* Imagen de fondo - Mobile */}
        <img
          src="/homeCelu.png"
          alt="Fondo móvil"
          className="absolute inset-0 w-full h-full object-cover object-top block min-[769px]:hidden"
        />

        {/* Overlay oscuro */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Contenido del Hero */}
        <div className="relative z-10 w-full px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 landscape:px-8 landscape:pt-20">
          {/* Contenedor con blur solo en móviles */}
          <div className="max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl landscape:max-w-sm
            max-[768px]:bg-black/30 max-[768px]:backdrop-blur-md max-[768px]:p-6 max-[768px]:rounded-2xl max-[768px]:border max-[768px]:border-white/20">

            <h1 className="text-white font-bold leading-tight mb-6
              text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] xl:text-[7rem] 2xl:text-[9rem]
              landscape:text-2xl landscape:mb-2
              drop-shadow-2xl">
              Cuidamos a tus Mascotas
            </h1>

            <p className="text-white mb-8 leading-relaxed
              text-base sm:text-lg md:text-xl lg:text-3xl xl:text-4xl 2xl:text-5xl
              landscape:text-sm landscape:mb-3
              drop-shadow-xl">
              Somos una clínica veterinaria integral, pioneros en la atención especializada para tus mascotas. Agendá ahora tu consulta
            </p>

            <button
              onClick={handleAgendarTurno}
              className="px-8 py-4
                border-2 border-white
                bg-transparent text-white
                font-semibold rounded-full
                hover:bg-white hover:text-black
                transition-all duration-300
                text-lg md:text-xl lg:text-2xl xl:text-3xl
                landscape:text-xs landscape:px-5 landscape:py-2
                shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              Agendar turno
            </button>
          </div>
        </div>
      </div>

      {/* MAPA SECTION */}
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
              📍 Av. Cabildo 4082, CABA | 🕒 Lun-Vie 10:00-20:00 Sab 10:00-12:30 Dom cerrado | 📞 (11) 1234-5678
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;