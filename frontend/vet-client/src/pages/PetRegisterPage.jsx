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
      <div
        className="absolute z-10 flex flex-col justify-center items-center 
  left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <PetRegisterForm />
      </div>
    </div>
  );
};

export default PetRegisterPage;
