import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { supabase } from "../services/supabase";
import AdoptionPetForm from "../components/AdoptionPetForm";
import { useNavigate } from "react-router-dom";

const AdoptionPetFormPage = () => {
  const { id } = useParams();
  const { isAdmin } = useAuthStore();
  const navigate = useNavigate();
  const [petData, setPetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const mode = id ? "edit" : "create";

  // Detectar cambios en el tamaño de la pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Verificar que el usuario sea admin
    if (!isAdmin) {
      navigate("/adoptions");
      return;
    }

    if (id) {
      fetchPetData();
    } else {
      setLoading(false);
    }
  }, [id, isAdmin, navigate]);

  const fetchPetData = async () => {
    try {
      const { data, error } = await supabase
        .from("pet")
        .select("*")
        .eq("id", id)
        .eq("has_owner", false)
        .single();

      if (error) throw error;
      setPetData(data);
    } catch (error) {
      navigate("/adoptions");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-xl text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex-1" style={{
      position: 'relative',
      width: '100%',
      minHeight: '100vh',
      backgroundImage: 'url(/adopciones.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center top',
      backgroundAttachment: 'scroll',
      overflow: 'auto',
      paddingTop: '72px'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 1,
        pointerEvents: 'none'
      }}></div>
      <div className="relative z-10 w-full py-8 px-4">
        <AdoptionPetForm petData={petData} mode={mode} />
      </div>
    </div>
  );
};

export default AdoptionPetFormPage;
