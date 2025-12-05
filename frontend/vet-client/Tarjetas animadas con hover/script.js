// Obtener todas las tarjetas
const items = document.querySelectorAll('.item');

// Detectar tamaño de pantalla
const isMobile = window.matchMedia('(max-width: 480px)').matches;
const isTablet = window.matchMedia('(min-width: 481px) and (max-width: 1024px)').matches;
const isDesktop = window.matchMedia('(min-width: 1025px)').matches;

items.forEach(item => {
    if (isMobile || isTablet) {
        // Variable para controlar el estado de la tarjeta en móvil/tablet
        let tapCount = 0;
        let touchHandled = false;
        let lastEventTime = 0;

        // Función para manejar clicks/taps
        const handleInteraction = function(e) {
            const currentTime = Date.now();

            // Si ya manejamos el touchend, ignorar el click que viene después
            if (e.type === 'click' && touchHandled && (currentTime - lastEventTime) < 500) {
                touchHandled = false;
                return;
            }

            e.preventDefault();
            lastEventTime = currentTime;
            tapCount++;

            if (tapCount === 1) {
                // Primer tap: revelar imagen (simular hover)
                item.classList.add('revealed');
            } else if (tapCount === 2) {
                // Segundo tap: voltear tarjeta
                item.classList.add('flipped');
            } else {
                // Tercer tap: regresar a estado inicial
                item.classList.remove('flipped');
                item.classList.remove('revealed');
                tapCount = 0;
            }

            // Marcar que manejamos un touch para ignorar el click subsecuente
            if (e.type === 'touchend') {
                touchHandled = true;
                setTimeout(() => {
                    touchHandled = false;
                }, 500);
            }
        };

        // En móvil/tablet: usar touchend primero, click como fallback
        item.addEventListener('touchend', handleInteraction);
        item.addEventListener('click', handleInteraction);

    } else {
        // En desktop (> 1024px): hover descubre, click voltea, otro click resetea
        // Usar tanto click como touchend para pantallas táctiles de desktop
        let touchHandledDesktop = false;

        const handleDesktopClick = function(e) {
            // Si ya manejamos el touchend, ignorar el click
            if (e.type === 'click' && touchHandledDesktop) {
                touchHandledDesktop = false;
                return;
            }

            // Toggle entre voltear y resetear
            this.classList.toggle('flipped');

            // Marcar que manejamos un touch
            if (e.type === 'touchend') {
                touchHandledDesktop = true;
            }
        };

        item.addEventListener('click', handleDesktopClick);
        item.addEventListener('touchend', function(e) {
            e.preventDefault();
            handleDesktopClick.call(this, e);
        });
    }
});
