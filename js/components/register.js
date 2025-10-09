// Lógica de registro de usuarios
document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const userData = {
        fullName: document.getElementById('fullName').value,
        identification: document.getElementById('identification').value,
        nationality: document.getElementById('nationality').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        password: document.getElementById('password').value
    };
    
    const result = register(userData);
    
    if (result.success) {
        showAlert('¡Registro exitoso! Ahora puedes iniciar sesión.', 'success');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    } else {
        showAlert(result.message, 'error');
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
