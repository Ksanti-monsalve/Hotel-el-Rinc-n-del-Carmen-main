// Check-in functionality for Hotel el Rincón del Carmen

document.addEventListener('DOMContentLoaded', function() {
    initializeCheckinSystem();
    loadRepositoryInfo();
    setupFormValidation();
});

function initializeCheckinSystem() {
    console.log('🏨 Sistema de Check-in inicializado');
    
    // Verificar hora actual para mostrar disponibilidad
    checkCheckinAvailability();
    
    // Configurar formulario de check-in
    const checkinForm = document.getElementById('checkinForm');
    if (checkinForm) {
        checkinForm.addEventListener('submit', handleCheckinSubmission);
    }
    
    // Actualizar información cada minuto
    setInterval(checkCheckinAvailability, 60000);
}

function checkCheckinAvailability() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTime = currentHour + (currentMinutes / 60);
    
    const checkinTime = 14; // 14:00
    const cutoffTime = 16; // 16:00
    
    const statusElement = document.querySelector('.checkin-status');
    
    if (currentTime >= checkinTime && currentTime < cutoffTime) {
        updateCheckinStatus('available', 'Check-in disponible hasta las 16:00');
    } else if (currentTime >= cutoffTime) {
        updateCheckinStatus('expired', 'Horario de check-in expirado. Contacte recepción.');
    } else {
        updateCheckinStatus('pending', `Check-in disponible a partir de las 14:00 (${Math.floor(checkinTime - currentTime)} horas restantes)`);
    }
}

function updateCheckinStatus(status, message) {
    let statusElement = document.querySelector('.checkin-status');
    
    if (!statusElement) {
        statusElement = document.createElement('div');
        statusElement.className = 'checkin-status';
        document.querySelector('.checkin-header').appendChild(statusElement);
    }
    
    statusElement.className = `checkin-status ${status}`;
    statusElement.innerHTML = `
        <div class="status-icon">
            ${status === 'available' ? '✅' : status === 'expired' ? '⏰' : '⏳'}
        </div>
        <div class="status-message">${message}</div>
    `;
}

function setupFormValidation() {
    const form = document.getElementById('checkinForm');
    const inputs = form.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    
    clearFieldError(event);
    
    switch(field.type) {
        case 'email':
            if (value && !isValidEmail(value)) {
                showFieldError(field, 'Ingrese un email válido');
            }
            break;
        case 'text':
            if (field.name === 'reservationId' && value) {
                validateReservationId(field, value);
            }
            break;
    }
}

function clearFieldError(event) {
    const field = event.target;
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
    field.classList.remove('error');
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateReservationId(field, reservationId) {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const reservation = reservations.find(r => r.id === reservationId);
    
    if (!reservation) {
        showFieldError(field, 'Número de reserva no encontrado');
        return false;
    }
    
    if (reservation.status === 'cancelled') {
        showFieldError(field, 'Esta reserva ha sido cancelada');
        return false;
    }
    
    if (reservation.status === 'checked-in') {
        showFieldError(field, 'Ya se ha realizado el check-in para esta reserva');
        return false;
    }
    
    return true;
}

async function handleCheckinSubmission(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const checkinData = {
        reservationId: formData.get('reservationId').trim(),
        guestEmail: formData.get('guestEmail').trim(),
        guestId: formData.get('guestId').trim(),
        acceptPolicies: formData.get('acceptPolicies')
    };
    
    // Validar datos
    if (!validateCheckinData(checkinData)) {
        return;
    }
    
    // Verificar horario de check-in
    if (!isCheckinTimeValid()) {
        showAlert('El check-in solo está disponible entre las 14:00 y 16:00 horas', 'error');
        return;
    }
    
    // Procesar check-in
    const result = await processCheckin(checkinData);
    
    if (result.success) {
        showAlert('Check-in realizado exitosamente', 'success');
        showCheckinConfirmation(result.reservation);
        event.target.reset();
    } else {
        showAlert(result.message, 'error');
    }
}

function validateCheckinData(data) {
    if (!data.reservationId) {
        showAlert('Ingrese el número de reserva', 'error');
        return false;
    }
    
    if (!data.guestEmail || !isValidEmail(data.guestEmail)) {
        showAlert('Ingrese un email válido', 'error');
        return false;
    }
    
    if (!data.guestId) {
        showAlert('Ingrese el documento de identidad', 'error');
        return false;
    }
    
    if (!data.acceptPolicies) {
        showAlert('Debe aceptar los términos y condiciones', 'error');
        return false;
    }
    
    return true;
}

function isCheckinTimeValid() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTime = currentHour + (currentMinutes / 60);
    
    return currentTime >= 14 && currentTime < 16; // 14:00 - 16:00
}

async function processCheckin(checkinData) {
    try {
        const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Buscar reserva
        const reservationIndex = reservations.findIndex(r => r.id === checkinData.reservationId);
        
        if (reservationIndex === -1) {
            return { success: false, message: 'Reserva no encontrada' };
        }
        
        const reservation = reservations[reservationIndex];
        
        // Verificar que la reserva pertenece al usuario
        const user = users.find(u => u.id === reservation.userId);
        
        if (!user || user.email !== checkinData.guestEmail || user.identification !== checkinData.guestId) {
            return { success: false, message: 'Los datos no coinciden con la reserva' };
        }
        
        // Verificar estado de la reserva
        if (reservation.status === 'checked-in') {
            return { success: false, message: 'Ya se ha realizado el check-in para esta reserva' };
        }
        
        if (reservation.status === 'cancelled') {
            return { success: false, message: 'Esta reserva ha sido cancelada' };
        }
        
        // Verificar fechas
        const today = new Date().toISOString().split('T')[0];
        if (reservation.checkIn !== today) {
            return { success: false, message: 'El check-in no corresponde a la fecha de hoy' };
        }
        
        // Realizar check-in
        reservations[reservationIndex] = {
            ...reservation,
            status: 'checked-in',
            checkinTime: new Date().toISOString(),
            checkinData: {
                guestEmail: checkinData.guestEmail,
                guestId: checkinData.guestId,
                policiesAccepted: true,
                checkinTimestamp: Date.now()
            }
        };
        
        localStorage.setItem('reservations', JSON.stringify(reservations));
        
        // Programar liberación automática si no se confirma en 2 horas
        scheduleRoomRelease(reservation.id);
        
        return { 
            success: true, 
            message: 'Check-in realizado exitosamente',
            reservation: reservations[reservationIndex]
        };
        
    } catch (error) {
        console.error('Error en check-in:', error);
        return { success: false, message: 'Error interno del sistema' };
    }
}

function scheduleRoomRelease(reservationId) {
    // Simular programación de liberación automática
    // En un sistema real, esto se manejaría en el backend
    const releaseTime = 2 * 60 * 60 * 1000; // 2 horas en milisegundos
    
    setTimeout(() => {
        checkAndReleaseRoom(reservationId);
    }, releaseTime);
    
    console.log(`⏰ Habitación programada para liberación automática en 2 horas para reserva: ${reservationId}`);
}

function checkAndReleaseRoom(reservationId) {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const reservation = reservations.find(r => r.id === reservationId);
    
    if (reservation && reservation.status === 'checked-in') {
        // Verificar si el huésped ha confirmado su estadía
        const confirmationKey = `room_confirmation_${reservationId}`;
        const isConfirmed = localStorage.getItem(confirmationKey);
        
        if (!isConfirmed) {
            // Liberar habitación
            const updatedReservations = reservations.map(r => {
                if (r.id === reservationId) {
                    return { ...r, status: 'auto-cancelled', reason: 'No confirmó estadía en 2 horas' };
                }
                return r;
            });
            
            localStorage.setItem('reservations', JSON.stringify(updatedReservations));
            console.log(`🏨 Habitación liberada automáticamente para reserva: ${reservationId}`);
        }
    }
}

function showCheckinConfirmation(reservation) {
    const modal = document.createElement('div');
    modal.className = 'confirmation-modal';
    modal.innerHTML = `
        <div class="confirmation-content">
            <div class="confirmation-header">
                <h2>✅ Check-in Exitoso</h2>
                <span class="close-confirmation" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</span>
            </div>
            <div class="confirmation-body">
                <p><strong>Reserva:</strong> ${reservation.id}</p>
                <p><strong>Habitación:</strong> ${getRoom(reservation.roomId)?.name || 'N/A'}</p>
                <p><strong>Fecha:</strong> ${formatDate(reservation.checkIn)} - ${formatDate(reservation.checkOut)}</p>
                <p><strong>Huéspedes:</strong> ${reservation.guests}</p>
                <div class="important-notice">
                    <h3>⚠️ Importante</h3>
                    <p>Tiene hasta las 16:00 para confirmar su estadía. Si no confirma, la habitación quedará disponible para otros huéspedes.</p>
                </div>
                <button onclick="confirmStay('${reservation.id}')" class="btn-confirm-stay">
                    Confirmar Estadía
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function confirmStay(reservationId) {
    const confirmationKey = `room_confirmation_${reservationId}`;
    localStorage.setItem(confirmationKey, 'confirmed');
    
    showAlert('Estadía confirmada exitosamente', 'success');
    
    // Cerrar modal
    const modal = document.querySelector('.confirmation-modal');
    if (modal) {
        modal.remove();
    }
}

function loadRepositoryInfo() {
    // Cargar información del repositorio si existe
    const savedRepoUrl = localStorage.getItem('repository_url');
    const savedRepoHash = localStorage.getItem('repository_hash');
    
    if (savedRepoUrl) {
        document.getElementById('repoUrl').value = savedRepoUrl;
    }
    
    if (savedRepoHash) {
        document.getElementById('repoHash').value = savedRepoHash;
    }
}

function updateRepositoryInfo() {
    const repoUrl = document.getElementById('repoUrl').value.trim();
    const repoHash = document.getElementById('repoHash').value.trim();
    
    if (!repoUrl) {
        const defaultUrl = 'https://github.com/usuario/hotel-rincon-del-carmen';
        document.getElementById('repoUrl').value = defaultUrl;
        localStorage.setItem('repository_url', defaultUrl);
    } else {
        localStorage.setItem('repository_url', repoUrl);
    }
    
    if (!repoHash) {
        const generatedHash = generateHash();
        document.getElementById('repoHash').value = generatedHash;
        localStorage.setItem('repository_hash', generatedHash);
    } else {
        localStorage.setItem('repository_hash', repoHash);
    }
    
    showAlert('Información del repositorio actualizada correctamente', 'success');
}

function generateHash() {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substr(2, 9);
    return `commit-${randomStr}${timestamp}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Función para obtener información de habitación
function getRoom(roomId) {
    const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
    return rooms.find(room => room.id === roomId);
}

// Estilos CSS adicionales para confirmación
const additionalStyles = `
<style>
.confirmation-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
}

.confirmation-content {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.confirmation-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid #e07a5f;
    padding-bottom: 1rem;
}

.confirmation-header h2 {
    color: #000000;
    margin: 0;
    font-size: 1.5rem;
}

.close-confirmation {
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
}

.close-confirmation:hover {
    color: #e07a5f;
}

.confirmation-body p {
    margin-bottom: 0.8rem;
    color: #333;
}

.important-notice {
    background: linear-gradient(135deg, #fff3cd, #ffeaa7);
    padding: 1rem;
    border-radius: 10px;
    margin: 1.5rem 0;
    border-left: 4px solid #e07a5f;
}

.important-notice h3 {
    margin: 0 0 0.5rem 0;
    color: #000000;
    font-size: 1.1rem;
}

.important-notice p {
    margin: 0;
    color: #333;
    font-weight: 600;
}

.btn-confirm-stay {
    width: 100%;
    padding: 1rem;
    background: linear-gradient(135deg, #e07a5f, #c65d42);
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1rem;
}

.btn-confirm-stay:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(224, 122, 95, 0.3);
}

.checkin-status {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-radius: 12px;
    margin-top: 1rem;
    font-weight: 600;
}

.checkin-status.available {
    background: linear-gradient(135deg, #d4edda, #c3e6cb);
    color: #155724;
    border: 2px solid #28a745;
}

.checkin-status.expired {
    background: linear-gradient(135deg, #f8d7da, #f5c6cb);
    color: #721c24;
    border: 2px solid #dc3545;
}

.checkin-status.pending {
    background: linear-gradient(135deg, #fff3cd, #ffeaa7);
    color: #856404;
    border: 2px solid #ffc107;
}

.status-icon {
    font-size: 1.5rem;
}

.status-message {
    flex: 1;
}

.field-error {
    color: #dc3545;
    font-size: 0.85rem;
    margin-top: 0.25rem;
    font-weight: 600;
}

.form-group input.error {
    border-color: #dc3545;
    background: #fff5f5;
}
</style>
`;

// Agregar estilos adicionales al head
document.head.insertAdjacentHTML('beforeend', additionalStyles);