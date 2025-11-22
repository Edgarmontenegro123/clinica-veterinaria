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
    <div className="flex-1 flex petsBackgroundImage overflow-y-auto">
      <img
        src="/mascotasjpg.webp"
        alt="Fondo imagen"
        className="petBackground"
      />
      <div className="absolute z-10 w-full min-h-full flex items-start md:items-center justify-center px-4 pb-8 pt-4 md:py-8">
        <div className="w-full max-w-[850px] mx-auto my-4">
          <PetRegisterForm />
        </div>
      </div>
    </div>
  );
};

export default PetRegisterPage;
