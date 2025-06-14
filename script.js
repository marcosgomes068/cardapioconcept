// Função para verificar o status da loja
function checkStoreStatus() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    
    // Horário de funcionamento: Segunda a Sábado, das 11h às 22h
    const isOpen = day >= 1 && day <= 6 && hour >= 11 && hour < 22;
    
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.store-status span');
    
    if (isOpen) {
        statusDot.classList.remove('closed');
        statusDot.classList.add('open');
        statusText.textContent = 'Loja Aberta';
    } else {
        statusDot.classList.remove('open');
        statusDot.classList.add('closed');
        statusText.textContent = 'Loja Fechada';
    }
}

// Verificar status inicial
checkStoreStatus();

// Verificar status a cada minuto
setInterval(checkStoreStatus, 60000); 