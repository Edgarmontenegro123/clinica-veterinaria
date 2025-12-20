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
    <div className="flex-1" style={{
      position: 'relative',
      width: '100%',
      minHeight: '100vh',
      backgroundImage: 'url(/mascotasjpg.webp)',
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
      <div className="relative z-10 w-full px-4 pb-20" style={{ paddingTop: '1rem' }}>
        <div className="w-full max-w-[850px] mx-auto">
          <PetRegisterForm />
        </div>
      </div>
    </div>
  );
};

export default PetRegisterPage;
