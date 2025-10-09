// Lógica de gestión de reservas del usuario
document.addEventListener('DOMContentLoaded', () => {
    console.log('Página de mis reservas cargada');
    
    const currentUser = getCurrentUser();
    console.log('Usuario actual:', currentUser);
    
    if (!currentUser) {
        showAlert('Debes iniciar sesión para ver tus reservas.', 'error');
        setTimeout(() => window.location.href = 'login.html', 2000);
        return;
    }
    
    loadMyReservations();
});

function loadMyReservations() {
    const currentUser = getCurrentUser();
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
    const container = document.getElementById('reservasContainer');
    
    if (!container) {
        console.error('No se encontró el contenedor de reservas');
        return;
    }
    
    const myReservations = reservations.filter(res => res.userId === currentUser.id);
    
    console.log('Usuario actual:', currentUser);
    console.log('Todas las reservas:', reservations);
    console.log('Mis reservas:', myReservations);
    
    if (myReservations.length === 0) {
        container.innerHTML = `
            <div class="no-reservations">
                <div class="no-reservations-icon">📅</div>
                <h3>No tienes reservas</h3>
                <p>Aún no has realizado ninguna reserva. ¡Explora nuestras habitaciones disponibles!</p>
                <a href="disponibilidad.html" class="btn btn-primary">Ver Disponibilidad</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    myReservations.forEach(res => {
        const room = rooms.find(r => r.id === res.roomId);
        if (!room) {
            console.warn('No se encontró la habitación:', res.roomId);
            return;
        }
        
        const nights = Math.ceil((new Date(res.checkOut) - new Date(res.checkIn)) / (1000 * 60 * 60 * 24));
        
        const card = document.createElement('div');
        card.className = 'reservation-card';
        card.innerHTML = `
            <div class="reservation-header">
                <div>
                    <h3 class="reservation-title">${room.name}</h3>
                    <p class="reservation-id">ID: ${res.id}</p>
                </div>
                <span class="reservation-status status-${res.status}">${res.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}</span>
            </div>
            
            <div class="reservation-details">
                <div class="detail-item">
                    <strong>Check-in</strong>
                    <span>${formatDate(res.checkIn)}</span>
                </div>
                <div class="detail-item">
                    <strong>Check-out</strong>
                    <span>${formatDate(res.checkOut)}</span>
                </div>
                <div class="detail-item">
                    <strong>Noches</strong>
                    <span>${nights} noche${nights > 1 ? 's' : ''}</span>
                </div>
                <div class="detail-item">
                    <strong>Huéspedes</strong>
                    <span>${res.guests} persona${res.guests > 1 ? 's' : ''}</span>
                </div>
            </div>
            
            <div class="reservation-footer">
                <div class="reservation-price">
                    Total: $${res.totalPrice.toLocaleString()}
                </div>
                
                ${res.status === 'confirmed' ? `
                    <button class="btn-cancel-reservation" onclick="cancelMyReservation('${res.id}')">
                        Cancelar Reserva
                    </button>
                ` : '<p style="text-align: center; color: #999; font-size: 0.9rem; margin-top: 1rem;">Esta reserva ha sido cancelada</p>'}
            </div>
        `;
        container.appendChild(card);
    });
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
}

function cancelMyReservation(reservationId) {
    if (!confirm('¿Estás seguro de que deseas cancelar esta reserva? Esta acción no se puede deshacer.')) {
        return;
    }
    
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const reservation = reservations.find(r => r.id === reservationId);
    
    if (reservation) {
        reservation.status = 'cancelled';
        localStorage.setItem('reservations', JSON.stringify(reservations));
        
        showAlert('Reserva cancelada exitosamente. La habitación ahora está disponible para otros huéspedes.', 'success');
        setTimeout(() => loadMyReservations(), 1500);
    } else {
        showAlert('No se pudo encontrar la reserva.', 'error');
    }
}

function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        background: ${type === 'success' ? '#000000' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    alert.textContent = message;
    document.body.appendChild(alert);
    setTimeout(() => {
        alert.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}
