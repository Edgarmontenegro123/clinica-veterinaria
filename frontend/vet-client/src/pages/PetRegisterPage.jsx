import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import PetRegisterForm from "../components/PetRegisterForm.jsx";

const PetRegisterPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="flex-1 flex petsBackgroundImage">
      <img
        src="/mascotasjpg.webp"
        alt="Fondo imagen"
        className="petBackground"
      />
      <div className="absolute z-10 w-full h-full flex items-center justify-center px-4 py-8">
        <div style={{ width: '100%', maxWidth: '850px', marginLeft: '160px' }}>
          <PetRegisterForm />
        </div>
      </div>
    </div>
  );
};

export default PetRegisterPage;
