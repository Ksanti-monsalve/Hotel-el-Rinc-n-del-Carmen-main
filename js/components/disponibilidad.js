// Lógica de búsqueda de disponibilidad de habitaciones
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('searchForm');
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    
    // Verificar si el usuario está logueado al cargar la página
    checkUserAuthentication();
    
    // Establecer fecha mínima como hoy
    const today = new Date().toISOString().split('T')[0];
    checkInInput.min = today;
    checkOutInput.min = today;
    
    // Actualizar fecha mínima de check-out cuando cambie check-in
    checkInInput.addEventListener('change', () => {
        const checkInDate = new Date(checkInInput.value);
        checkInDate.setDate(checkInDate.getDate() + 1);
        checkOutInput.min = checkInDate.toISOString().split('T')[0];
        
        if (checkOutInput.value && new Date(checkOutInput.value) <= new Date(checkInInput.value)) {
            checkOutInput.value = '';
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Verificar autenticación antes de buscar
        if (!checkUserAuthentication()) {
            return;
        }
        
        const checkIn = checkInInput.value;
        const checkOut = checkOutInput.value;
        const guests = parseInt(document.getElementById('guests').value);
        
        if (!checkIn || !checkOut) {
            showAlert('Por favor, selecciona las fechas de entrada y salida.', 'error');
            return;
        }
        
        if (new Date(checkOut) <= new Date(checkIn)) {
            showAlert('La fecha de salida debe ser posterior a la de entrada.', 'error');
            return;
        }
        
        searchAvailableRooms(checkIn, checkOut, guests);
    });
});

// Función para verificar autenticación
function checkUserAuthentication() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser || currentUser === 'null') {
        // Mostrar mensaje de que necesita iniciar sesión
        const resultsSection = document.getElementById('results');
        if (resultsSection) {
            resultsSection.innerHTML = `
                <div style="text-align: center; padding: 3rem; background: #f8f9fa; border-radius: 12px; margin: 2rem 0;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🔐</div>
                    <h3 style="color: #000000; margin-bottom: 1rem;">Inicia sesión para reservar</h3>
                    <p style="color: #666; margin-bottom: 2rem; font-size: 1.1rem;">
                        Para hacer una reserva necesitas estar registrado en nuestro sistema.
                    </p>
                    <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                        <a href="login.html" style="background: #000000; color: white; padding: 1rem 2rem; border-radius: 8px; text-decoration: none; font-weight: 600;">
                            Iniciar Sesión
                        </a>
                        <a href="register.html" style="background: #e07a5f; color: white; padding: 1rem 2rem; border-radius: 8px; text-decoration: none; font-weight: 600;">
                            Registrarse
                        </a>
                    </div>
                </div>
            `;
        }
        return false;
    }
    
    // Usuario logueado, mostrar mensaje de bienvenida
    const currentUserObj = JSON.parse(currentUser);
    const resultsSection = document.getElementById('results');
    const isAdmin = currentUserObj.role === 'admin';
    
    if (resultsSection && resultsSection.innerHTML.trim() === '') {
        if (isAdmin) {
            // Mensaje especial para administradores
            resultsSection.innerHTML = `
                <div style="text-align: center; padding: 2rem; background: linear-gradient(135deg, #fff4e6, #ffe8cc); border-radius: 12px; margin: 2rem 0; box-shadow: 0 4px 12px rgba(224, 122, 95, 0.15); border: 2px solid #e07a5f;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">👨‍💼</div>
                    <h3 style="color: #e07a5f; margin-bottom: 1rem; font-size: 1.8rem;">Panel de Administrador</h3>
                    <p style="color: #666; margin-bottom: 1rem; font-size: 1.1rem;">Puedes consultar la disponibilidad de habitaciones</p>
                    <div style="margin-top: 1rem; padding: 1rem; background: rgba(224, 122, 95, 0.15); border-radius: 8px; border-left: 4px solid #e07a5f;">
                        <p style="color: #c65d42; font-weight: 600; margin: 0;">⚠️ Nota: Los administradores no pueden realizar reservas</p>
                        <p style="color: #999; font-size: 0.9rem; margin-top: 0.5rem;">Esta función es exclusiva para clientes del hotel</p>
                    </div>
                </div>
            `;
        } else {
            // Mensaje normal para usuarios
            resultsSection.innerHTML = `
                <div style="text-align: center; padding: 2rem; background: linear-gradient(135deg, #e8f5e8, #f0f8f0); border-radius: 12px; margin: 2rem 0; box-shadow: 0 4px 12px rgba(44, 95, 45, 0.1);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">👋</div>
                    <h3 style="color: #000000; margin-bottom: 1rem; font-size: 1.8rem;">¡Hola, ${currentUserObj.fullName.split(' ')[0]}!</h3>
                    <p style="color: #666; margin-bottom: 0; font-size: 1.1rem;">Busca las fechas que desees y encuentra tu habitación perfecta.</p>
                    <div style="margin-top: 1rem; padding: 1rem; background: rgba(44, 95, 45, 0.1); border-radius: 8px;">
                        <p style="color: #000000; font-weight: 600; margin: 0;">💡 Consejo: Selecciona tus fechas de entrada y salida para ver las habitaciones disponibles</p>
                    </div>
                </div>
            `;
        }
    }
    
    return true;
}

function searchAvailableRooms(checkIn, checkOut, guests) {
    const resultsSection = document.getElementById('results');
    const availableRooms = getAvailableRooms(checkIn, checkOut, guests);

    if (availableRooms.length === 0) {
        resultsSection.innerHTML = '<div class="no-results"><h3>😔 No hay habitaciones disponibles</h3><p>No hay habitaciones disponibles para las fechas y número de huéspedes seleccionados. Por favor, intenta con otras fechas.</p></div>';
        return;
    }

    resultsSection.innerHTML = '';
    availableRooms.forEach(room => {
        const roomCard = createRoomCard(room, checkIn, checkOut, guests);
        resultsSection.appendChild(roomCard);
    });
}

function getAvailableRooms(checkIn, checkOut, guests) {
    const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];

    return rooms.filter(room => {
        // Verificar capacidad
        if (room.maxGuests < guests) return false;
        
        // Verificar si hay solapamiento con reservas confirmadas
        const isBooked = reservations.some(res => {
            if (res.roomId !== room.id || res.status !== 'confirmed') return false;
            // Hay solapamiento si las fechas se cruzan
            return !(checkOut <= res.checkIn || checkIn >= res.checkOut);
        });
        
        return !isBooked;
    });
}

function createRoomCard(room, checkIn, checkOut, guests) {
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * (room.pricePerNight || 0);
    
    // Verificar si el usuario actual es administrador
    const currentUser = localStorage.getItem('currentUser');
    const isAdmin = currentUser && currentUser !== 'null' ? JSON.parse(currentUser).role === 'admin' : false;
    
    const card = document.createElement('div');
    card.className = 'room-card';
    card.innerHTML = `
        <img class="room-image" src="${room.image || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400'}" alt="${room.name || 'Habitación'}" onerror="this.src='https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400'">
        
        <div class="room-content">
            <div class="room-header">
                <div>
                    <h3 class="room-title">${room.name || 'Habitación sin nombre'}</h3>
                    <p class="room-description">${room.description || 'Descripción no disponible'}</p>
                </div>
                <div class="room-price">
                    $${(room.pricePerNight || 0).toLocaleString()}<span style="font-size: 0.9rem; font-weight: 400;">/noche</span>
                </div>
            </div>
            
            <div class="room-details">
                <div class="detail-item">
                    <span>🛏️ ${room.beds || 1} cama${(room.beds || 1) > 1 ? 's' : ''}</span>
                </div>
                <div class="detail-item">
                    <span>👥 Máx. ${room.maxGuests || 1} huéspedes</span>
                </div>
                <div class="detail-item">
                    <span>📅 ${formatDate(checkIn)} - ${formatDate(checkOut)}</span>
                </div>
                <div class="detail-item">
                    <span>🌙 ${nights} noche${nights > 1 ? 's' : ''}</span>
                </div>
            </div>
            
            <div class="room-services">
                <p class="services-title">Servicios incluidos:</p>
                <div class="services-list">
                    ${(room.services && Array.isArray(room.services)) ? room.services.map(service => `<span class="service-tag">✓ ${service}</span>`).join('') : '<span class="service-tag">✓ Sin servicios específicos</span>'}
                </div>
            </div>
            
            <div class="room-footer" style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 2px solid #e5e5e5;">
                <div>
                    <p style="font-size: 0.9rem; color: #666; margin-bottom: 0.25rem;">Precio Total</p>
                    <p style="font-size: 2rem; font-weight: 700; color: var(--color-accent);">$${totalPrice.toLocaleString()}</p>
                    <p style="font-size: 0.85rem; color: #999;">${nights} noche${nights > 1 ? 's' : ''} × ${guests} huésped${guests > 1 ? 'es' : ''}</p>
                </div>
                ${isAdmin ? `
                    <div style="text-align: right; max-width: 200px;">
                        <p style="color: #e07a5f; font-weight: 600; font-size: 0.95rem; margin: 0;">⚠️ Solo clientes pueden reservar</p>
                        <p style="color: #999; font-size: 0.85rem; margin-top: 0.5rem;">Los administradores no pueden hacer reservas</p>
                    </div>
                ` : `
                    <button class="btn-reserve" data-room-id="${room.id || ''}" data-check-in="${checkIn}" data-check-out="${checkOut}" data-guests="${guests}" data-total="${totalPrice}">
                        Reservar Ahora
                    </button>
                `}
            </div>
        </div>
    `;
    
    // Agregar evento al botón de reserva solo si no es admin
    if (!isAdmin) {
        const btnReserve = card.querySelector('.btn-reserve');
        if (btnReserve) {
            btnReserve.addEventListener('click', function() {
                handleReservation(
                    this.dataset.roomId,
                    this.dataset.checkIn,
                    this.dataset.checkOut,
                    parseInt(this.dataset.guests),
                    parseFloat(this.dataset.total),
                    room
                );
            });
        }
    }
    
    return card;
}

function handleReservation(roomId, checkIn, checkOut, guests, totalPrice, room) {
    // Verificar si el usuario está logueado con validación más robusta
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser || currentUser === 'null') {
        showAlert('Debes iniciar sesión para hacer una reserva. Te redirigiremos al login.', 'error');
        setTimeout(() => window.location.href = 'login.html', 2000);
        return;
    }

    // Validar que el usuario esté correctamente parseado
    let user;
    try {
        user = JSON.parse(currentUser);
        if (!user.id || !user.fullName) {
            throw new Error('Usuario inválido');
        }
    } catch (error) {
        showAlert('Error en la sesión. Por favor, inicia sesión nuevamente.', 'error');
        localStorage.removeItem('currentUser');
        setTimeout(() => window.location.href = 'login.html', 2000);
        return;
    }

    // Verificar que el usuario NO sea administrador
    if (user.role === 'admin') {
        showAlert('Los administradores no pueden realizar reservas. Esta función es exclusiva para clientes.', 'error');
        return;
    }

    // Verificar disponibilidad una vez más antes de confirmar
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const hasConflict = reservations.some(res => {
        if (res.roomId !== roomId || res.status !== 'confirmed') return false;
        const resCheckIn = new Date(res.checkIn);
        const resCheckOut = new Date(res.checkOut);
        const newCheckIn = new Date(checkIn);
        const newCheckOut = new Date(checkOut);
        return !(newCheckOut <= resCheckIn || newCheckIn >= resCheckOut);
    });

    if (hasConflict) {
        showAlert('Lo sentimos, esta habitación ya no está disponible para las fechas seleccionadas. Por favor, elige otras fechas.', 'error');
        // Recargar la búsqueda
        setTimeout(() => window.location.reload(), 2000);
        return;
    }

    // Crear la reserva (user ya está validado arriba)
    const reservation = {
        id: Date.now().toString(),
        userId: user.id,
        userName: user.fullName,
        roomId: roomId,
        roomName: room.name || 'Habitación sin nombre',
        checkIn: checkIn,
        checkOut: checkOut,
        guests: guests,
        totalPrice: totalPrice,
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };

    reservations.push(reservation);
    localStorage.setItem('reservations', JSON.stringify(reservations));
    
    showAlert(`¡Reserva confirmada exitosamente! Total: $${totalPrice.toLocaleString()}`, 'success');
    setTimeout(() => window.location.href = 'mis-reservas.html', 2000);
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
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
