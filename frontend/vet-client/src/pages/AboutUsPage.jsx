import { useEffect, useRef } from 'react';
import '../components/css/AboutUsPage.css'

export default function AboutUsPage() {
  const itemsRef = useRef([]);

  useEffect(() => {
    const items = itemsRef.current;

    // Detectar tamaño de pantalla y capacidad táctil
    const isMobile = window.matchMedia('(max-width: 480px)').matches;
    const isTablet = window.matchMedia('(min-width: 481px) and (max-width: 1024px)').matches;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const allCleanupHandlers = [];

    items.forEach(item => {
      if (!item) return;

      // Guardar el estado de cada tarjeta independientemente
      let currentState = 0; // 0: inicial (cuadro), 1: revelado (imagen), 2: volteado (descripción)
      let lastInteractionTime = 0;
      let touchHandled = false;

      const resetCard = () => {
        item.classList.remove('flipped');
        item.classList.remove('revealed');
        currentState = 0;
      };

      const setState = (state) => {
        if (state === 0) {
          // Estado inicial: mostrar cuadro
          item.classList.remove('revealed');
          item.classList.remove('flipped');
        } else if (state === 1) {
          // Estado revelado: mostrar imagen real
          item.classList.add('revealed');
          item.classList.remove('flipped');
        } else if (state === 2) {
          // Estado volteado: mostrar descripción
          item.classList.add('revealed');
          item.classList.add('flipped');
        }
        currentState = state;
      };

      // Manejador para dispositivos táctiles (móvil/tablet)
      const handleTouchInteraction = (e) => {
        const currentTime = Date.now();

        // Prevenir múltiples toques rápidos
        if (currentTime - lastInteractionTime < 300) {
          return;
        }

        e.preventDefault();
        e.stopPropagation();

        lastInteractionTime = currentTime;
        touchHandled = true;

        // Ciclo: cuadro → imagen → descripción → cuadro
        if (currentState === 0) {
          // Primer touch: revelar imagen
          setState(1);
        } else if (currentState === 1) {
          // Segundo touch: mostrar descripción
          setState(2);
        } else {
          // Tercer touch: resetear al cuadro
          setState(0);
        }

        // Resetear flag de touch después de un tiempo
        setTimeout(() => {
          touchHandled = false;
        }, 500);
      };

      // Manejador para click con mouse (desktop)
      const handleMouseClick = (e) => {
        console.log('Click detectado - touchHandled:', touchHandled);

        // En desktop, ignorar clicks sintéticos que vienen inmediatamente después de touch
        if (touchHandled) {
          console.log('Click bloqueado por touchHandled');
          return;
        }

        console.log('Procesando click de mouse');

        // Toggle entre voltear y resetear
        if (item.classList.contains('flipped')) {
          console.log('Reseteando tarjeta');
          resetCard();
        } else {
          console.log('Volteando tarjeta');
          item.classList.add('flipped');
        }
      };

      // Para dispositivos móviles y tablets (pantalla pequeña)
      if (isMobile || isTablet) {
        item.addEventListener('touchend', handleTouchInteraction, { passive: false });
        // Prevenir click duplicado en móvil
        const preventClick = (e) => {
          if (touchHandled) {
            e.preventDefault();
            e.stopPropagation();
          }
        };
        item.addEventListener('click', preventClick, { passive: false });

        allCleanupHandlers.push(() => {
          item.removeEventListener('touchend', handleTouchInteraction);
          item.removeEventListener('click', preventClick);
        });
      }
      // Para desktop (> 1024px) - mouse prioritario
      else {
        // En desktop: usar mousedown para clicks de mouse real
        const handleMouseDown = (e) => {
          // Solo procesar eventos de mouse real (no touch)
          if (e.pointerType && e.pointerType !== 'mouse') {
            return;
          }

          console.log('Mousedown detectado');

          // Toggle entre voltear y resetear
          if (item.classList.contains('flipped')) {
            resetCard();
          } else {
            item.classList.add('flipped');
          }
        };

        // Si hay soporte táctil, agregar manejador de touch
        if (isTouchDevice) {
          item.addEventListener('touchend', handleTouchInteraction, { passive: false });
          allCleanupHandlers.push(() => {
            item.removeEventListener('touchend', handleTouchInteraction);
          });
        }

        // Agregar manejador de mousedown para mouse real
        item.addEventListener('mousedown', handleMouseDown, false);
        allCleanupHandlers.push(() => {
          item.removeEventListener('mousedown', handleMouseDown);
        });
      }
    });

    // Cleanup function fuera del forEach
    return () => {
      allCleanupHandlers.forEach(cleanup => cleanup());
    };
  }, []);

  const cardData = [
    {
      id: 1,
      frontImage: '/images/AleSamu2.png',
      profileImage: '/images/Lopez.png',
      name: 'Alexis López',
      title: 'Dev-Samurai',
      description: 'Escribe con precisión milenaria, pero hace más console.log que un trainee nervioso.'
    },
    {
      id: 2,
      frontImage: '/images/EdgarSamu.jpg',
      profileImage: '/images/Montenegro.png',
      name: 'Edgar Montenegro',
      title: 'Dev-Samurai',
      description: 'Su código fluye como el agua… porque siempre se le escapa algo.'
    },
    {
      id: 3,
      frontImage: '/images/LeoSamu.png',
      profileImage: '/images/leo.png',
      name: 'Leonardo Lipiejko',
      title: 'Dev-Samurai',
      description: 'En su código hay honor... y spagetti. Su mantra: "vibe coding primero, entender después."'
    }
  ];

  return (
    <div className="about-us-page">
      <div className="about-header">
        <h1 className="about-title">Acerca de Nosotros</h1>
        <p className="about-subtitle">Conoce más acerca de los creadores de esta página</p>
      </div>

      <div className="cards-container">
        {cardData.map((card, index) => (
          <div
            key={card.id}
            className="item"
            ref={el => itemsRef.current[index] = el}
          >
            <div className="card-inner">
              <div className="card-front">
                <img src={card.frontImage} alt={card.name} />
              </div>
              <div className="card-back">
                <div className="card-content">
                  <div className="profile-image">
                    <img src={card.profileImage} alt={card.name} />
                  </div>
                  <h2>{card.name}</h2>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
