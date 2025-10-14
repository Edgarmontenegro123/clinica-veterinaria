import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PetRegisterPage from './pages/PetRegisterPage';
import HomePage from './pages/HomePage';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* NAVBAR */}

      <main className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/petregister" element={<PetRegisterPage />} />
        </Routes>
      </main>

      {/* FOOTER */}
    </div>
  );
}