import { FaFacebook, FaInstagram, FaWhatsapp, FaTelegram, FaYoutube, FaTiktok } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-8 px-4 border-t-4 border-blue-500">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Información de la Clínica */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-400">Clínica Ramvet</h3>
            <div className="space-y-2 text-gray-300">
              <p className="flex items-start gap-2">
                <span className="text-blue-400">📍</span>
                <span>Av. Cabildo 4082, CABA, Argentina</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-blue-400">📞</span>
                <a href="tel:+541112345678" className="hover:text-blue-400 transition-colors">
                  (011) 1234-5678
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-blue-400">📧</span>
                <a href="mailto:info@ramvet.com" className="hover:text-blue-400 transition-colors">
                  info@ramvet.com
                </a>
              </p>
            </div>
          </div>

          {/* Horarios de Atención */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-400">Horarios de Atención</h3>
            <div className="space-y-2 text-gray-300">
              <p className="flex justify-between">
                <span className="font-semibold">Lunes - Viernes:</span>
                <span>10:00 - 20:00</span>
              </p>
              <p className="flex justify-between">
                <span className="font-semibold">Sábados:</span>
                <span>10:00 - 12:30</span>
              </p>
              <p className="flex justify-between">
                <span className="font-semibold text-red-400">Domingos:</span>
                <span className="text-red-400">Cerrado</span>
              </p>
            </div>
          </div>

          {/* Redes Sociales */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-400">Síguenos</h3>
            <p className="text-gray-300 mb-4">Conéctate con nosotros en nuestras redes sociales</p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 p-3 rounded-full transition-all hover:scale-110 shadow-lg"
                aria-label="Facebook"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 p-3 rounded-full transition-all hover:scale-110 shadow-lg"
                aria-label="Instagram"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://wa.me/541112345678"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 p-3 rounded-full transition-all hover:scale-110 shadow-lg"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={24} />
              </a>
              <a
                href="https://t.me/ramvet"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 hover:bg-blue-600 p-3 rounded-full transition-all hover:scale-110 shadow-lg"
                aria-label="Telegram"
              >
                <FaTelegram size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black hover:bg-gray-800 p-3 rounded-full transition-all hover:scale-110 shadow-lg"
                aria-label="X (Twitter)"
              >
                <FaXTwitter size={24} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 hover:bg-red-700 p-3 rounded-full transition-all hover:scale-110 shadow-lg"
                aria-label="YouTube"
              >
                <FaYoutube size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* Copyright */}
        <div className="text-center text-gray-400 text-sm">
          <p>© Copyright 2025 Clínica Ramvet - Todos los derechos reservados</p>
          <p className="mt-2 text-xs">Diseñado con ❤️ para el cuidado de tus mascotas</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
