import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* NAVBAR */}

      <main className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<div>Home page</div>} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>

      {/* FOOTER */}
    </div>
  );
}