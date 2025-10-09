// Inicializar datos en localStorage si no existen

// Inicializar habitaciones si no existen
if (!localStorage.getItem('rooms')) {
    const initialRooms = [
        {
            id: '2',
            name: 'Habitación Superior',
            description: 'Confortable habitación con todas las comodidades modernas. Ideal para viajes de negocios o escapadas de fin de semana.',
            beds: 1,
            maxGuests: 2,
            pricePerNight: 120,
            services: ['WiFi Gratuito', 'Minibar', 'TV 43" Smart', 'Aire Acondicionado', 'Escritorio de Trabajo', 'Caja Fuerte'],
            image: 'https://www.mator.es/wp-content/uploads/2020/09/limpiezahabitaciondehotel.jpg'
        },
        {
            id: '3',
            name: 'Habitación Familiar',
            description: 'Espaciosa habitación con dos camas individuales y una cama matrimonial. Diseñada especialmente para familias con niños.',
            beds: 3,
            maxGuests: 4,
            pricePerNight: 160,
            services: ['WiFi Gratuito', 'Minibar', 'TV 50" Smart', 'Aire Acondicionado', 'Área de Juegos Infantiles', 'Cuna Gratuita', 'Desayuno Familiar'],
            image: 'https://52b85234.delivery.rocketcdn.me/wp-content/uploads/2024/03/Como-decorar-una-habitacion-de-un-hotel.jpg'
        },
        {
            id: '5',
            name: 'Habitación Estándar',
            description: 'Habitación cómoda y funcional con todas las comodidades básicas. Excelente relación calidad-precio para estadías cortas.',
            beds: 1,
            maxGuests: 2,
            pricePerNight: 90,
            services: ['WiFi Gratuito', 'TV 32" Smart', 'Aire Acondicionado', 'Baño Privado', 'Teléfono Directo'],
            image: 'https://cdn0.uncomo.com/es/posts/1/9/2/guia_de_decoracion_para_habitaciones_de_hoteles_47291_orig.jpg'
        },
        {
            id: '6',
            name: 'Habitación Deluxe',
            description: 'Habitación de lujo con decoración elegante y servicios premium. Perfecta para ocasiones especiales.',
            beds: 1,
            maxGuests: 2,
            pricePerNight: 180,
            services: ['WiFi Gratuito', 'Minibar Premium', 'TV 55" Smart', 'Aire Acondicionado', 'Jacuzzi', 'Servicio a la Habitación', 'Caja Fuerte Digital'],
            image: 'https://www.cosemarozono.com/wp-content/uploads/2017/02/eliminar-olores-en-habitaciones-de-hotel-con-ozono.jpg'
        },
        {
            id: '7',
            name: 'Habitación Ejecutiva',
            description: 'Habitación diseñada para ejecutivos con espacio de trabajo y todas las comodidades modernas.',
            beds: 1,
            maxGuests: 2,
            pricePerNight: 150,
            services: ['WiFi Gratuito', 'Minibar', 'TV 43" Smart', 'Aire Acondicionado', 'Escritorio Ejecutivo', 'Impresora', 'Línea Telefónica Directa', 'Caja Fuerte'],
            image: 'https://static1.eskypartners.com/travelguide/vancouver-hotels.jpg'
        }
    ];
    localStorage.setItem('rooms', JSON.stringify(initialRooms));
}

// Inicializar reservas si no existen
if (!localStorage.getItem('reservations')) {
    localStorage.setItem('reservations', '[]');
}

// Inicializar usuarios si no existen
if (!localStorage.getItem('users')) {
    // Crear usuario administrador por defecto
    const adminUser = {
        id: 'admin-' + Date.now(),
        fullName: 'Administrador del Hotel',
        identification: '000000000',
        nationality: 'Colombia',
        email: 'admin@hotel.com',
        phone: '+57 301 333 7644',
        password: 'admin123',
        role: 'admin'
    };
    
    localStorage.setItem('users', JSON.stringify([adminUser]));
}

// Inicializar usuario actual si no existe
if (!localStorage.getItem('currentUser')) {
    localStorage.setItem('currentUser', 'null');
}

// Funciones de autenticación
function login(email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Debug: mostrar información
    console.log('Usuarios en sistema:', users.length);
    console.log('Email buscado:', email);
    console.log('Password buscado:', password);
    
    // Buscar usuario
    const user = users.find(u => {
        console.log('Comparando con:', u.email, u.password);
        return u.email === email && u.password === password;
    });
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        console.log('Login exitoso:', user);
        return true;
    }
    
    console.log('Login fallido - usuario no encontrado');
    return false;
}

function logout() {
    localStorage.setItem('currentUser', 'null');
}

// Función para obtener el usuario actual
function getCurrentUser() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser && currentUser !== 'null') {
        try {
            return JSON.parse(currentUser);
        } catch (e) {
            return null;
        }
    }
    return null;
}

// Función para verificar si hay un usuario logueado
function isLoggedIn() {
    const currentUser = getCurrentUser();
    return currentUser !== null;
}

// Función para verificar si el usuario actual es admin
function isAdmin() {
    const currentUser = getCurrentUser();
    return currentUser && currentUser.role === 'admin';
}

function register(userData) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Verificar si el email ya existe
    const emailExists = users.some(u => u.email === userData.email);
    if (emailExists) {
        return { success: false, message: 'El email ya está registrado' };
    }
    
    // Verificar si la identificación ya existe
    const idExists = users.some(u => u.identification === userData.identification);
    if (idExists) {
        return { success: false, message: 'El número de identificación ya está registrado' };
    }
    
    // Crear nuevo usuario
    const newUser = {
        id: 'user-' + Date.now(),
        ...userData,
        role: 'user' // Asignar rol de usuario por defecto
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    return { success: true, message: 'Usuario registrado exitosamente' };
}

function getCurrentUser() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser && currentUser !== 'null') {
        try {
            return JSON.parse(currentUser);
        } catch (e) {
            return null;
        }
    }
    return null;
}

function isLoggedIn() {
    return getCurrentUser() !== null;
}

function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

// Funciones de reservas
function createReservation(reservationData) {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    
    // Verificar disponibilidad
    if (!isRoomAvailable(reservationData.roomId, reservationData.checkIn, reservationData.checkOut)) {
        return { success: false, message: 'La habitación no está disponible para esas fechas' };
    }
    
    const newReservation = {
        id: 'reservation-' + Date.now(),
        ...reservationData,
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };
    
    reservations.push(newReservation);
    localStorage.setItem('reservations', JSON.stringify(reservations));
    
    return { success: true, message: 'Reserva creada exitosamente', reservation: newReservation };
}

function isRoomAvailable(roomId, checkIn, checkOut) {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    return !reservations.some(reservation => {
        if (reservation.roomId !== roomId || reservation.status !== 'confirmed') {
            return false;
        }
        
        const existingCheckIn = new Date(reservation.checkIn);
        const existingCheckOut = new Date(reservation.checkOut);
        
        // Verificar solapamiento de fechas
        return (checkInDate < existingCheckOut && checkOutDate > existingCheckIn);
    });
}

function cancelReservation(reservationId) {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const reservationIndex = reservations.findIndex(r => r.id === reservationId);
    
    if (reservationIndex !== -1) {
        reservations[reservationIndex].status = 'cancelled';
        localStorage.setItem('reservations', JSON.stringify(reservations));
        return true;
    }
    
    return false;
}

// Funciones de habitaciones
function getRooms() {
    return JSON.parse(localStorage.getItem('rooms')) || [];
}

function getRoom(roomId) {
    const rooms = getRooms();
    return rooms.find(room => room.id === roomId);
}

// Función global para mostrar alertas
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

// Función para asegurar que el admin existe
function ensureAdminExists() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const adminExists = users.some(u => u.email === 'admin@hotel.com');
    
    if (!adminExists) {
        const adminUser = {
            id: 'admin-' + Date.now(),
            fullName: 'Administrador del Hotel',
            identification: '000000000',
            nationality: 'Colombia',
            email: 'admin@hotel.com',
            phone: '+57 301 333 7644',
            password: 'admin123',
            role: 'admin'
        };
        users.push(adminUser);
        localStorage.setItem('users', JSON.stringify(users));
        console.log('Admin creado automáticamente:', adminUser);
    }
}

// Función para actualizar información de habitaciones
function updateRoomsInfo() {
    const existingRooms = JSON.parse(localStorage.getItem('rooms')) || [];
    
    // Eliminar habitaciones que contengan "Suite" en el nombre
    const filteredRooms = existingRooms.filter(room => 
        !room.name.toLowerCase().includes('suite')
    );
    
    const newRoomsData = [
        {
            id: '2',
            name: 'Habitación Superior',
            description: 'Confortable habitación con todas las comodidades modernas. Ideal para viajes de negocios o escapadas de fin de semana.',
            beds: 1,
            maxGuests: 2,
            pricePerNight: 120,
            services: ['WiFi Gratuito', 'Minibar', 'TV 43" Smart', 'Aire Acondicionado', 'Escritorio de Trabajo', 'Caja Fuerte'],
            image: 'https://www.mator.es/wp-content/uploads/2020/09/limpiezahabitaciondehotel.jpg'
        },
        {
            id: '3',
            name: 'Habitación Familiar',
            description: 'Espaciosa habitación con dos camas individuales y una cama matrimonial. Diseñada especialmente para familias con niños.',
            beds: 3,
            maxGuests: 4,
            pricePerNight: 160,
            services: ['WiFi Gratuito', 'Minibar', 'TV 50" Smart', 'Aire Acondicionado', 'Área de Juegos Infantiles', 'Cuna Gratuita', 'Desayuno Familiar'],
            image: 'https://52b85234.delivery.rocketcdn.me/wp-content/uploads/2024/03/Como-decorar-una-habitacion-de-un-hotel.jpg'
        },
        {
            id: '5',
            name: 'Habitación Estándar',
            description: 'Habitación cómoda y funcional con todas las comodidades básicas. Excelente relación calidad-precio para estadías cortas.',
            beds: 1,
            maxGuests: 2,
            pricePerNight: 90,
            services: ['WiFi Gratuito', 'TV 32" Smart', 'Aire Acondicionado', 'Baño Privado', 'Teléfono Directo'],
            image: 'https://cdn0.uncomo.com/es/posts/1/9/2/guia_de_decoracion_para_habitaciones_de_hoteles_47291_orig.jpg'
        },
        {
            id: '6',
            name: 'Habitación Deluxe',
            description: 'Habitación de lujo con decoración elegante y servicios premium. Perfecta para ocasiones especiales.',
            beds: 1,
            maxGuests: 2,
            pricePerNight: 180,
            services: ['WiFi Gratuito', 'Minibar Premium', 'TV 55" Smart', 'Aire Acondicionado', 'Jacuzzi', 'Servicio a la Habitación', 'Caja Fuerte Digital'],
            image: 'https://www.cosemarozono.com/wp-content/uploads/2017/02/eliminar-olores-en-habitaciones-de-hotel-con-ozono.jpg'
        },
        {
            id: '7',
            name: 'Habitación Ejecutiva',
            description: 'Habitación diseñada para ejecutivos con espacio de trabajo y todas las comodidades modernas.',
            beds: 1,
            maxGuests: 2,
            pricePerNight: 150,
            services: ['WiFi Gratuito', 'Minibar', 'TV 43" Smart', 'Aire Acondicionado', 'Escritorio Ejecutivo', 'Impresora', 'Línea Telefónica Directa', 'Caja Fuerte'],
            image: 'https://static1.eskypartners.com/travelguide/vancouver-hotels.jpg'
        }
    ];

    // Actualizar habitaciones existentes manteniendo reservas
    const updatedRooms = filteredRooms.map(existingRoom => {
        const newData = newRoomsData.find(newRoom => newRoom.id === existingRoom.id);
        if (newData) {
            return { ...existingRoom, ...newData };
        }
        return existingRoom;
    });

    // Agregar nuevas habitaciones si no existen
    newRoomsData.forEach(newRoom => {
        const exists = updatedRooms.some(room => room.id === newRoom.id);
        if (!exists) {
            updatedRooms.push(newRoom);
        }
    });

    localStorage.setItem('rooms', JSON.stringify(updatedRooms));
    console.log('Habitaciones actualizadas (5 habitaciones con imágenes diferentes):', updatedRooms);
}

// Función global para mostrar alertas
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1.5rem 2rem;
        border-radius: 12px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #000000, #333333)' : type === 'error' ? 'linear-gradient(135deg, #dc3545, #fd7e14)' : '#17a2b8'};
        color: white;
        font-weight: 600;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.4s ease;
        max-width: 400px;
        font-size: 1.1rem;
        text-align: center;
    `;
    alert.textContent = message;
    document.body.appendChild(alert);
    setTimeout(() => {
        alert.style.animation = 'slideOut 0.4s ease';
        setTimeout(() => alert.remove(), 400);
    }, 4000);
}

// Asegurar que el admin existe
function ensureAdminExists() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const adminExists = users.some(u => u.email === 'admin@hotel.com');
    
    if (!adminExists) {
        const adminUser = {
            id: 'admin-' + Date.now(),
            fullName: 'Administrador del Hotel',
            identification: '000000000',
            nationality: 'Colombia',
            email: 'admin@hotel.com',
            phone: '+57 301 333 7644',
            password: 'admin123',
            role: 'admin'
        };
        
        users.push(adminUser);
        localStorage.setItem('users', JSON.stringify(users));
        console.log('Admin creado automáticamente:', adminUser);
    }
}

// Escuchar cambios en localStorage para actualizar la interfaz
window.addEventListener('storage', (e) => {
    if (e.key === 'currentUser') {
        window.location.reload();
    }
});

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Asegurar que el admin existe
    ensureAdminExists();
    
    // Crear usuario de prueba si no existe
    ensureTestUserExists();
    
    // Crear reserva de prueba si no existe
    createTestReservation();
    
    // Actualizar información de habitaciones
    updateRoomsInfo();
});

// Asegurar que existe un usuario de prueba
function ensureTestUserExists() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const testUserExists = users.some(u => u.email === 'valentina@test.com');
    
    if (!testUserExists) {
        const testUser = {
            id: 'user-test-' + Date.now(),
            fullName: 'valentina mancilla',
            identification: '12345678',
            nationality: 'Colombia',
            email: 'valentina@test.com',
            phone: '3001234567',
            password: 'test123',
            role: 'user'
        };
        
        users.push(testUser);
        localStorage.setItem('users', JSON.stringify(users));
        console.log('Usuario de prueba creado:', testUser);
    }
}

// Función para crear una reserva de prueba
function createTestReservation() {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const testUser = JSON.parse(localStorage.getItem('users') || '[]').find(u => u.email === 'valentina@test.com');
    
    if (testUser && reservations.length === 0) {
        const testReservation = {
            id: 'reservation-test-' + Date.now(),
            userId: testUser.id,
            roomId: '2',
            checkIn: '2024-02-15',
            checkOut: '2024-02-18',
            guests: 2,
            totalPrice: 360,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };
        
        reservations.push(testReservation);
        localStorage.setItem('reservations', JSON.stringify(reservations));
        console.log('Reserva de prueba creada:', testReservation);
    }
}