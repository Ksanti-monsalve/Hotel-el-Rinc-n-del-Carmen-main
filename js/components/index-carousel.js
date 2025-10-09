// Carrusel de habitaciones para la página de inicio
document.addEventListener('DOMContentLoaded', () => {
    loadRoomsCarousel();
});


function loadRoomsCarousel() {
    const carousel = document.getElementById('carousel');
    const allRooms = JSON.parse(localStorage.getItem('rooms')) || [];
    
    // Filtrar habitaciones: eliminar suites y villas
    const rooms = allRooms.filter(room => {
        const roomNameLower = room.name.toLowerCase();
        return !roomNameLower.includes('suite') && 
               !roomNameLower.includes('villa') && 
               !roomNameLower.includes('saint');
    });

    if (rooms.length === 0) {
        carousel.innerHTML = '<p style="text-align: center; padding: 2rem;">Cargando habitaciones...</p>';
        return;
    }

    carousel.innerHTML = '';
    rooms.forEach((room, index) => {
        const div = document.createElement('div');
        div.className = 'room-card';
        
        // Obtener los primeros 3 servicios para mostrar
        const topServices = (room.services && Array.isArray(room.services)) ? room.services.slice(0, 3) : [];
        
        div.innerHTML = `
            <div class="room-image-container">
                <img src="${room.image || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400'}" alt="${room.name || 'Habitación'}" onerror="this.src='https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400'">
                <div class="room-badge">⭐ Destacada</div>
            </div>
            <div class="room-card-content">
                <h3>${room.name || 'Habitación sin nombre'}</h3>
                <p>${room.description ? room.description.substring(0, 100) + '...' : 'Descripción no disponible'}</p>
                <div class="room-features">
                    <span class="feature-tag">🛏️ ${room.beds || 1} cama${(room.beds || 1) > 1 ? 's' : ''}</span>
                    <span class="feature-tag">👥 ${room.maxGuests || 1} huéspedes</span>
                    ${topServices.map(service => `<span class="feature-tag">✨ ${service}</span>`).join('')}
                </div>
                <div class="room-price-section">
                    <div class="room-price-container">
                        <span class="price-label">Desde</span>
                        <div class="room-price">
                            <span class="price-currency">$</span>
                            <span>${(room.pricePerNight || 0).toLocaleString()}</span>
                            <span class="price-period">/noche</span>
                        </div>
                    </div>
                    <a href="html/disponibilidad.html" class="btn-reserve-room">
                        <span>Reservar</span>
                        <span class="btn-arrow-icon">→</span>
                    </a>
                </div>
            </div>
        `;
        carousel.appendChild(div);
    });
}
