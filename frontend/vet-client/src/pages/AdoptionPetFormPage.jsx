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
  const mode = id ? "edit" : "create";

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
      console.error("Error fetching pet:", error);
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
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4">
      <AdoptionPetForm petData={petData} mode={mode} />
    </div>
  );
};

export default AdoptionPetFormPage;
