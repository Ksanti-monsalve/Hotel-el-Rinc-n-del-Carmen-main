// Lógica del panel de administración
document.addEventListener('DOMContentLoaded', () => {
    // Verificar acceso de administrador
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
        showAlert('Acceso denegado. Solo administradores pueden acceder a esta página.', 'error');
        setTimeout(() => window.location.href = 'login.html', 2000);
        return;
    }
    
    loadRooms();
    loadReservations();
    loadTodayCheckins();
    
    // Configurar el formulario de habitaciones
    const roomForm = document.getElementById('roomForm');
    if (roomForm) {
        roomForm.addEventListener('submit', handleRoomFormSubmit);
    }
    
    // Configurar el formulario de check-in administrativo
    const adminCheckinForm = document.getElementById('adminCheckinFormElement');
    if (adminCheckinForm) {
        adminCheckinForm.addEventListener('submit', handleAdminCheckinSubmit);
    }
    
    // Actualizar check-ins cada minuto
    setInterval(loadTodayCheckins, 60000);
});

function loadRooms() {
    const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
    const tableBody = document.getElementById('roomsTable');
    tableBody.innerHTML = '';
    
    if (rooms.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay habitaciones registradas.</td></tr>';
        return;
    }
    
    rooms.forEach(room => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${room.name}</td>
            <td>${room.beds}</td>
            <td>${room.maxGuests}</td>
            <td>$${room.pricePerNight.toLocaleString()}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="editRoom('${room.id}')" class="btn btn-secondary btn-action">Editar</button>
                    <button onclick="deleteRoom('${room.id}')" class="btn btn-danger btn-action">Eliminar</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function loadReservations() {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const tableBody = document.getElementById('reservationsTable');
    tableBody.innerHTML = '';
    
    if (reservations.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No hay reservas registradas.</td></tr>';
        return;
    }
    
    reservations.forEach(res => {
        const room = rooms.find(r => r.id === res.roomId);
        const user = users.find(u => u.id === res.userId);
        const statusClass = res.status === 'confirmed' ? 'status-confirmed' : 'status-cancelled';
        const statusText = res.status === 'confirmed' ? 'Confirmada' : 'Cancelada';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user ? user.fullName : 'Usuario desconocido'}</td>
            <td>${room ? room.name : 'Habitación desconocida'}</td>
            <td>${formatDate(res.checkIn)}</td>
            <td>${formatDate(res.checkOut)}</td>
            <td>${res.guests}</td>
            <td>$${res.totalPrice.toLocaleString()}</td>
            <td><span class="${statusClass}">${statusText}</span></td>
            <td>
                ${res.status === 'confirmed' ? `
                    <div class="action-buttons">
                        <button onclick="modifyReservation('${res.id}')" class="btn btn-secondary btn-action">Modificar</button>
                        <button onclick="deleteReservation('${res.id}')" class="btn btn-danger btn-action">Eliminar</button>
                    </div>
                ` : '<span style="color: #999;">Cancelada</span>'}
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
}

function showAddRoomForm() {
    const form = document.getElementById('addRoomForm');
    if (form) {
        form.style.display = 'block';
    }
}

function hideAddRoomForm() {
    const form = document.getElementById('addRoomForm');
    if (form) {
        form.style.display = 'none';
        form.reset();
    }
}

function handleRoomFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const room = {
        id: Date.now().toString(),
        name: formData.get('roomName'),
        description: formData.get('roomDescription'),
        beds: parseInt(formData.get('roomBeds')),
        maxGuests: parseInt(formData.get('roomMaxGuests')),
        pricePerNight: parseFloat(formData.get('roomPrice')),
        services: formData.get('roomServices').split(',').map(s => s.trim()).filter(s => s),
        image: formData.get('roomImage') || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400'
    };
    
    const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
    rooms.push(room);
    localStorage.setItem('rooms', JSON.stringify(rooms));
    
    showAlert('Habitación agregada exitosamente.', 'success');
    loadRooms();
    hideAddRoomForm();
}

function editRoom(id) {
    const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
    const room = rooms.find(r => r.id === id);
    if (!room) return;
    
    // Crear formulario de edición
    showEditRoomForm(room);
}

function showEditRoomForm(room) {
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    `;
    
    // Crear formulario
    const formContainer = document.createElement('div');
    formContainer.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 2rem;
        max-width: 600px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    `;
    
    formContainer.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h2 style="color: #000000; margin: 0;">Editar Habitación</h2>
            <button onclick="closeEditForm()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666;">&times;</button>
        </div>
        
        <form id="editRoomForm">
            <div class="form-row">
                <div class="form-group">
                    <label for="editRoomName">Nombre de la Habitación</label>
                    <input type="text" id="editRoomName" name="editRoomName" value="${room.name}" required>
                </div>
                <div class="form-group">
                    <label for="editRoomBeds">Número de Camas</label>
                    <input type="number" id="editRoomBeds" name="editRoomBeds" value="${room.beds}" min="1" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="editRoomMaxGuests">Huéspedes Máximos</label>
                    <input type="number" id="editRoomMaxGuests" name="editRoomMaxGuests" value="${room.maxGuests}" min="1" required>
                </div>
                <div class="form-group">
                    <label for="editRoomPrice">Precio por Noche</label>
                    <input type="number" id="editRoomPrice" name="editRoomPrice" value="${room.pricePerNight}" min="0" step="0.01" required>
                </div>
            </div>
            <div class="form-group">
                <label for="editRoomDescription">Descripción</label>
                <textarea id="editRoomDescription" name="editRoomDescription" rows="3" required>${room.description}</textarea>
            </div>
            <div class="form-group">
                <label for="editRoomServices">Servicios (separados por comas)</label>
                <input type="text" id="editRoomServices" name="editRoomServices" value="${room.services.join(', ')}" placeholder="WiFi Gratuito, Minibar, TV Smart">
            </div>
            <div class="actions">
                <button type="submit" class="btn btn-success">Actualizar Habitación</button>
                <button type="button" class="btn" onclick="closeEditForm()">Cancelar</button>
            </div>
        </form>
    `;
    
    overlay.appendChild(formContainer);
    document.body.appendChild(overlay);
    
    // Configurar evento del formulario
    const form = document.getElementById('editRoomForm');
    form.addEventListener('submit', (e) => handleEditRoomFormSubmit(e, room.id));
    
    // Función para cerrar el formulario
    window.closeEditForm = function() {
        document.body.removeChild(overlay);
        delete window.closeEditForm;
    };
}

function handleEditRoomFormSubmit(e, roomId) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
    const roomIndex = rooms.findIndex(r => r.id === roomId);
    
    if (roomIndex !== -1) {
        rooms[roomIndex] = {
            ...rooms[roomIndex],
            name: formData.get('editRoomName'),
            description: formData.get('editRoomDescription'),
            beds: parseInt(formData.get('editRoomBeds')),
            maxGuests: parseInt(formData.get('editRoomMaxGuests')),
            pricePerNight: parseFloat(formData.get('editRoomPrice')),
            services: formData.get('editRoomServices').split(',').map(s => s.trim()).filter(s => s)
        };
        
        localStorage.setItem('rooms', JSON.stringify(rooms));
        showAlert('Habitación actualizada exitosamente.', 'success');
        loadRooms();
        closeEditForm();
    }
}

function deleteRoom(id) {
    if (!confirm('¿Estás seguro de eliminar esta habitación?')) return;
    
    const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
    const filtered = rooms.filter(r => r.id !== id);
    localStorage.setItem('rooms', JSON.stringify(filtered));
    
    showAlert('Habitación eliminada exitosamente.', 'success');
    loadRooms();
}

function modifyReservation(id) {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const reservation = reservations.find(r => r.id === id);
    
    if (!reservation) return;
    
    const room = rooms.find(r => r.id === reservation.roomId);
    const user = users.find(u => u.id === reservation.userId);
    
    showModifyReservationForm(reservation, room, user);
}

function showModifyReservationForm(reservation, room, user) {
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    `;
    
    // Crear formulario
    const formContainer = document.createElement('div');
    formContainer.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 2rem;
        max-width: 600px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    `;
    
    formContainer.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h2 style="color: #000000; margin: 0; font-family: serif; font-size: 1.8rem;">Modificar Reserva #${reservation.id.split('-')[1] || '1'}</h2>
            <button onclick="closeModifyForm()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666;">&times;</button>
        </div>
        
        <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 2rem; font-size: 0.9rem; color: #666;">
            <div>Cliente: ${user ? user.fullName : 'Usuario desconocido'}</div>
            <div>Reserva actual: ${room ? room.name : 'Habitación desconocida'}</div>
            <div>Estado: ${reservation.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}</div>
        </div>
        
        <form id="modifyReservationForm">
            <div class="form-group">
                <label for="modifyRoom">Habitación:</label>
                <select id="modifyRoom" name="modifyRoom" required style="width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 8px; background: white;">
                    ${getRoomOptions(room ? room.id : '')}
                </select>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="modifyCheckIn">Fecha de entrada:</label>
                    <input type="date" id="modifyCheckIn" name="modifyCheckIn" value="${reservation.checkIn}" required style="width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 8px;">
                </div>
                <div class="form-group">
                    <label for="modifyCheckOut">Fecha de salida:</label>
                    <input type="date" id="modifyCheckOut" name="modifyCheckOut" value="${reservation.checkOut}" required style="width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 8px;">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="modifyGuests">Número de Huéspedes:</label>
                    <select id="modifyGuests" name="modifyGuests" required style="width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 8px; background: white;">
                        ${getGuestOptions(reservation.guests)}
                    </select>
                </div>
                <div class="form-group">
                    <label for="modifyStatus">Estado de la Reserva:</label>
                    <select id="modifyStatus" name="modifyStatus" required style="width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 8px; background: white;">
                        <option value="confirmed" ${reservation.status === 'confirmed' ? 'selected' : ''}>Confirmada</option>
                        <option value="pending" ${reservation.status === 'pending' ? 'selected' : ''}>Pendiente</option>
                        <option value="cancelled" ${reservation.status === 'cancelled' ? 'selected' : ''}>Cancelada</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group">
                <label for="modifyNotes">Notas adicionales:</label>
                <textarea id="modifyNotes" name="modifyNotes" rows="4" placeholder="Agregar notas adicionales sobre la reserva..." style="width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 8px; resize: vertical;"></textarea>
            </div>
            
            <div class="actions" style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;">
                <button type="submit" class="btn" style="background: #d4a574; color: white; padding: 0.8rem 2rem; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Guardar Cambios</button>
                <button type="button" class="btn" onclick="closeModifyForm()" style="background: white; color: #d4a574; padding: 0.8rem 2rem; border: 1px solid #d4a574; border-radius: 8px; font-weight: 600; cursor: pointer;">Cancelar</button>
            </div>
        </form>
    `;
    
    overlay.appendChild(formContainer);
    document.body.appendChild(overlay);
    
    // Configurar evento del formulario
    const form = document.getElementById('modifyReservationForm');
    form.addEventListener('submit', (e) => handleModifyReservationFormSubmit(e, reservation.id));
    
    // Función para cerrar el formulario
    window.closeModifyForm = function() {
        document.body.removeChild(overlay);
        delete window.closeModifyForm;
    };
}

function getRoomOptions(currentRoomId) {
    const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
    return rooms.map(room => 
        `<option value="${room.id}" ${room.id === currentRoomId ? 'selected' : ''}>${room.name} - COP $${room.pricePerNight.toLocaleString()}/noche</option>`
    ).join('');
}

function getGuestOptions(currentGuests) {
    const options = [];
    for (let i = 1; i <= 6; i++) {
        options.push(`<option value="${i}" ${i == currentGuests ? 'selected' : ''}>${i} huésped${i > 1 ? 'es' : ''}</option>`);
    }
    return options.join('');
}

function handleModifyReservationFormSubmit(e, reservationId) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const reservationIndex = reservations.findIndex(r => r.id === reservationId);
    
    if (reservationIndex !== -1) {
        const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
        const selectedRoom = rooms.find(r => r.id === formData.get('modifyRoom'));
        
        if (selectedRoom) {
            const checkIn = new Date(formData.get('modifyCheckIn'));
            const checkOut = new Date(formData.get('modifyCheckOut'));
            const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
            const totalPrice = selectedRoom.pricePerNight * nights;
            
            reservations[reservationIndex] = {
                ...reservations[reservationIndex],
                roomId: formData.get('modifyRoom'),
                checkIn: formData.get('modifyCheckIn'),
                checkOut: formData.get('modifyCheckOut'),
                guests: parseInt(formData.get('modifyGuests')),
                status: formData.get('modifyStatus'),
                totalPrice: totalPrice,
                notes: formData.get('modifyNotes') || ''
            };
            
            localStorage.setItem('reservations', JSON.stringify(reservations));
            showAlert('Reserva modificada exitosamente.', 'success');
            loadReservations();
            closeModifyForm();
        }
    }
}

function deleteReservation(id) {
    if (!confirm('¿Estás seguro de eliminar esta reserva? Esta acción no se puede deshacer.')) return;
    
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const filtered = reservations.filter(r => r.id !== id);
    localStorage.setItem('reservations', JSON.stringify(filtered));
    
    showAlert('Reserva eliminada exitosamente.', 'success');
    loadReservations();
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

// ========== FUNCIONES DE GESTIÓN DE CHECK-IN ==========

function showAdminCheckinForm() {
    const form = document.getElementById('adminCheckinForm');
    form.style.display = 'block';
    
    // Cargar reservas disponibles para check-in
    loadAvailableReservationsForCheckin();
    
    // Establecer fecha y hora actual
    const now = new Date();
    const localDateTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    document.getElementById('adminCheckinTime').value = localDateTime;
}

function hideAdminCheckinForm() {
    const form = document.getElementById('adminCheckinForm');
    form.style.display = 'none';
    document.getElementById('adminCheckinFormElement').reset();
}

function loadAvailableReservationsForCheckin() {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
    const today = new Date().toISOString().split('T')[0];
    
    // Filtrar reservas confirmadas para hoy que no han hecho check-in
    const availableReservations = reservations.filter(res => 
        res.status === 'confirmed' && 
        res.checkIn === today
    );
    
    const select = document.getElementById('adminReservationSelect');
    select.innerHTML = '<option value="">Seleccione una reserva...</option>';
    
    availableReservations.forEach(reservation => {
        const user = users.find(u => u.id === reservation.userId);
        const room = rooms.find(r => r.id === reservation.roomId);
        
        if (user && room) {
            const option = document.createElement('option');
            option.value = reservation.id;
            option.textContent = `${reservation.id} - ${user.fullName} - ${room.name} - ${reservation.guests} huéspedes`;
            option.dataset.userId = user.id;
            option.dataset.userEmail = user.email;
            option.dataset.userIdentification = user.identification;
            select.appendChild(option);
        }
    });
    
    // Listener para autocompletar datos del huésped
    select.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        if (selectedOption.value) {
            document.getElementById('adminGuestId').value = selectedOption.dataset.userIdentification || '';
        }
    });
}

async function handleAdminCheckinSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const checkinData = {
        reservationId: formData.get('adminReservationSelect'),
        checkinTime: formData.get('adminCheckinTime'),
        guestId: formData.get('adminGuestId'),
        notes: formData.get('adminNotes'),
        overrideTimeValidation: formData.get('adminPoliciesOverride') === 'on'
    };
    
    if (!checkinData.reservationId) {
        showAlert('Seleccione una reserva', 'error');
        return;
    }
    
    if (!checkinData.guestId) {
        showAlert('Ingrese el documento del huésped', 'error');
        return;
    }
    
    try {
        const result = await processAdminCheckin(checkinData);
        
        if (result.success) {
            showAlert('Check-in realizado exitosamente por administrador', 'success');
            hideAdminCheckinForm();
            loadTodayCheckins();
            loadReservations();
        } else {
            showAlert(result.message, 'error');
        }
    } catch (error) {
        console.error('Error en check-in administrativo:', error);
        showAlert('Error interno del sistema', 'error');
    }
}

async function processAdminCheckin(checkinData) {
    try {
        const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        const reservationIndex = reservations.findIndex(r => r.id === checkinData.reservationId);
        
        if (reservationIndex === -1) {
            return { success: false, message: 'Reserva no encontrada' };
        }
        
        const reservation = reservations[reservationIndex];
        const user = users.find(u => u.id === reservation.userId);
        
        if (!user) {
            return { success: false, message: 'Usuario no encontrado' };
        }
        
        // Verificar documento
        if (user.identification !== checkinData.guestId) {
            return { success: false, message: 'El documento no coincide con la reserva' };
        }
        
        // Verificar estado
        if (reservation.status === 'checked-in') {
            return { success: false, message: 'Ya se ha realizado el check-in para esta reserva' };
        }
        
        // Verificar horario (solo si no se omite la validación)
        if (!checkinData.overrideTimeValidation) {
            const checkinTime = new Date(checkinData.checkinTime);
            const checkinHour = checkinTime.getHours() + (checkinTime.getMinutes() / 60);
            
            if (checkinHour < 14 || checkinHour >= 16) {
                return { success: false, message: 'Check-in fuera del horario permitido (14:00 - 16:00). Use la opción de omitir validación si es necesario.' };
            }
        }
        
        // Realizar check-in
        reservations[reservationIndex] = {
            ...reservation,
            status: 'checked-in',
            checkinTime: checkinData.checkinTime,
            checkinData: {
                guestId: checkinData.guestId,
                notes: checkinData.notes,
                checkinBy: 'admin',
                adminOverride: checkinData.overrideTimeValidation,
                checkinTimestamp: Date.now()
            }
        };
        
        localStorage.setItem('reservations', JSON.stringify(reservations));
        
        return { 
            success: true, 
            message: 'Check-in realizado exitosamente',
            reservation: reservations[reservationIndex]
        };
        
    } catch (error) {
        console.error('Error en processAdminCheckin:', error);
        return { success: false, message: 'Error interno del sistema' };
    }
}

function loadTodayCheckins() {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
    const today = new Date().toISOString().split('T')[0];
    
    // Filtrar check-ins de hoy
    const todayCheckins = reservations.filter(res => 
        res.status === 'checked-in' && 
        res.checkIn === today
    );
    
    const tableBody = document.getElementById('todayCheckinsTable');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (todayCheckins.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No hay check-ins registrados para hoy.</td></tr>';
        return;
    }
    
    todayCheckins.forEach(reservation => {
        const user = users.find(u => u.id === reservation.userId);
        const room = rooms.find(r => r.id === reservation.roomId);
        
        if (user && room) {
            const checkinTime = new Date(reservation.checkinTime);
            const timeRemaining = calculateTimeRemaining(checkinTime);
            const isConfirmed = localStorage.getItem(`room_confirmation_${reservation.id}`);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${reservation.id}</td>
                <td>${user.fullName}</td>
                <td>${room.name}</td>
                <td>${formatDateTime(reservation.checkinTime)}</td>
                <td>
                    <span class="status-badge ${isConfirmed ? 'confirmed' : 'pending'}">
                        ${isConfirmed ? '✅ Confirmado' : '⏳ Pendiente'}
                    </span>
                </td>
                <td>
                    <span class="time-remaining ${timeRemaining.expired ? 'expired' : timeRemaining.warning ? 'warning' : 'safe'}">
                        ${timeRemaining.text}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        ${!isConfirmed ? `
                            <button onclick="confirmGuestStay('${reservation.id}')" class="btn btn-success btn-sm">
                                Confirmar Estadía
                            </button>
                        ` : ''}
                        <button onclick="viewCheckinDetails('${reservation.id}')" class="btn btn-secondary btn-sm">
                            Ver Detalles
                        </button>
                        ${timeRemaining.expired && !isConfirmed ? `
                            <button onclick="releaseRoom('${reservation.id}')" class="btn btn-danger btn-sm">
                                Liberar Habitación
                            </button>
                        ` : ''}
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        }
    });
}

function calculateTimeRemaining(checkinTime) {
    const now = new Date();
    const checkin = new Date(checkinTime);
    const deadline = new Date(checkin.getTime() + (2 * 60 * 60 * 1000)); // 2 horas después
    const remaining = deadline - now;
    
    if (remaining <= 0) {
        return { expired: true, text: 'Tiempo expirado', warning: false };
    }
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    const warning = remaining <= (30 * 60 * 1000); // Advertencia en últimos 30 minutos
    
    return {
        expired: false,
        warning: warning,
        text: `${hours}h ${minutes}m restantes`
    };
}

function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function confirmGuestStay(reservationId) {
    if (confirm('¿Confirmar la estadía del huésped? Esto evitará la liberación automática de la habitación.')) {
        const confirmationKey = `room_confirmation_${reservationId}`;
        localStorage.setItem(confirmationKey, 'confirmed');
        
        showAlert('Estadía confirmada exitosamente', 'success');
        loadTodayCheckins();
    }
}

function viewCheckinDetails(reservationId) {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
    
    const reservation = reservations.find(r => r.id === reservationId);
    const user = users.find(u => u.id === reservation.userId);
    const room = rooms.find(r => r.id === reservation.roomId);
    
    if (!reservation || !user || !room) {
        showAlert('No se pudieron cargar los detalles', 'error');
        return;
    }
    
    const isConfirmed = localStorage.getItem(`room_confirmation_${reservationId}`);
    const checkinData = reservation.checkinData || {};
    
    const modal = document.createElement('div');
    modal.className = 'modal checkin-details-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Detalles del Check-in</h2>
                <span class="close" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="detail-grid">
                    <div class="detail-item">
                        <strong>Reserva:</strong>
                        <span>${reservation.id}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Cliente:</strong>
                        <span>${user.fullName}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Email:</strong>
                        <span>${user.email}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Documento:</strong>
                        <span>${user.identification}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Habitación:</strong>
                        <span>${room.name}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Huéspedes:</strong>
                        <span>${reservation.guests}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Check-in:</strong>
                        <span>${formatDateTime(reservation.checkinTime)}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Check-out:</strong>
                        <span>${formatDate(reservation.checkOut)}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Estado:</strong>
                        <span class="status-badge ${isConfirmed ? 'confirmed' : 'pending'}">
                            ${isConfirmed ? '✅ Confirmado' : '⏳ Pendiente de confirmación'}
                        </span>
                    </div>
                    <div class="detail-item">
                        <strong>Realizado por:</strong>
                        <span>${checkinData.checkinBy === 'admin' ? '👨‍💼 Administrador' : '👤 Cliente'}</span>
                    </div>
                    ${checkinData.notes ? `
                        <div class="detail-item full-width">
                            <strong>Notas:</strong>
                            <span>${checkinData.notes}</span>
                        </div>
                    ` : ''}
                    ${checkinData.adminOverride ? `
                        <div class="detail-item full-width">
                            <strong>⚠️ Observación:</strong>
                            <span>Check-in realizado fuera del horario estándar con autorización administrativa</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function releaseRoom(reservationId) {
    if (confirm('¿Está seguro de liberar esta habitación? Esta acción cancelará la reserva y liberará la habitación para otros huéspedes.')) {
        const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        
        const updatedReservations = reservations.map(r => {
            if (r.id === reservationId) {
                return { 
                    ...r, 
                    status: 'auto-cancelled', 
                    reason: 'Liberada por administrador - No confirmó estadía',
                    releasedAt: new Date().toISOString()
                };
            }
            return r;
        });
        
        localStorage.setItem('reservations', JSON.stringify(updatedReservations));
        
        // Limpiar confirmación si existe
        localStorage.removeItem(`room_confirmation_${reservationId}`);
        
        showAlert('Habitación liberada exitosamente', 'success');
        loadTodayCheckins();
        loadReservations();
    }
}
