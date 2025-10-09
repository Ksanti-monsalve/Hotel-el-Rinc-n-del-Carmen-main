// Lógica de inicio de sesión
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (login(email, password)) {
        window.dispatchEvent(new Event('userLoggedIn'));
        const user = getCurrentUser();
        
        // Mostrar mensaje de bienvenida personalizado
        const welcomeMessage = user.role === 'admin' 
            ? `¡Bienvenido, Administrador ${user.fullName}!` 
            : `¡Hola, ${user.fullName}! Bienvenido al Hotel el Rincón del Carmen`;
        
        showAlert(welcomeMessage, 'success');
        
        // Redirigir según el rol
        setTimeout(() => {
            if (user.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'disponibilidad.html';
            }
        }, 2000);
    } else {
        showAlert('Email o contraseña incorrectos. Por favor, intenta de nuevo.', 'error');
    }
});

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

function createAdminNow() {
    try {
        // Crear usuario admin
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
        
        // Obtener usuarios existentes
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Remover admin existente si existe
        users = users.filter(u => u.email !== 'admin@hotel.com');
        
        // Agregar nuevo admin
        users.push(adminUser);
        
        // Guardar
        localStorage.setItem('users', JSON.stringify(users));
        
        showAlert('✅ Admin creado exitosamente! Ahora puedes iniciar sesión.', 'success');
        
    } catch (error) {
        showAlert('❌ Error al crear admin: ' + error.message, 'error');
    }
}
