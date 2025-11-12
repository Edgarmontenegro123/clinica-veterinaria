import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleAgendarTurno = () => {
    navigate("/turnos");
  };

  return (
    <div className="imageBackground max-h-screen ">
      <img src="/fondo.jpg" alt="Fondo" />

      <div className="content w-1/3 left-0 bottom-0 m- p-10 py-24 gap-4 flex flex-col items-start">
        <h2 className=" leading-24">Cuidamos a tus Mascotas</h2>
        <h3>
          Somos una clínica veterinaria integral, pioneros en la atención
          especializada para tus mascotas. Agendá ahora tu consulta
        </h3>
        <button
          onClick={handleAgendarTurno}
          className=" rounded-4xl px-4 py-2 border-2 border-white cursor-pointer hover:bg-white hover:text-black hover:scale-105 active:opacity-70 transition-all"
        >
          Agendar turno
        </button>
      </div>
    </div>
  );
};

export default HomePage;
