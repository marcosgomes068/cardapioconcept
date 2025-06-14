let cart = [];

function addToCart(name, price) {
    const item = cart.find(i => i.name === name);
    if (item) {
        item.qty += 1;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    updateCartCount();
}

function updateCartCount() {
    document.getElementById('cart-count').innerText = cart.reduce((sum, i) => sum + i.qty, 0);
}

function openCart() {
    renderCart();
    document.getElementById('cart-modal').style.display = 'block';
}

function closeCart() {
    document.getElementById('cart-modal').style.display = 'none';
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach((item, idx) => {
        total += item.price * item.qty;
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item.name} x${item.qty} - R$ ${(item.price * item.qty).toFixed(2).replace('.', ',')}</span>
            <button onclick="removeFromCart(${idx})">Remover</button>
        `;
        cartItems.appendChild(li);
    });
    document.getElementById('cart-total-value').innerText = 'R$ ' + total.toFixed(2).replace('.', ',');
    updateWhatsappLink();
}

function removeFromCart(idx) {
    cart.splice(idx, 1);
    renderCart();
    updateCartCount();
}

function updateWhatsappLink() {
    const phone = '556892272523'; // Número do WhatsApp com DDD e país
    let msg = '🍖 *PEDIDO - ESPETINHOS* 🍖%0A%0A';
    msg += 'Olá! Gostaria de fazer o seguinte pedido:%0A%0A';
    msg += '*📋 Itens do Pedido:*%0A';
    cart.forEach(item => {
        msg += `• ${item.name}%0A`;
        msg += `  Quantidade: ${item.qty}%0A`;
        msg += `  Valor Unitário: R$ ${item.price.toFixed(2).replace('.', ',')}%0A`;
        msg += `  Subtotal: R$ ${(item.price * item.qty).toFixed(2).replace('.', ',')}%0A%0A`;
    });
    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    msg += '*💰 Resumo do Pedido*%0A';
    msg += `Total de Itens: ${cart.reduce((sum, i) => sum + i.qty, 0)}%0A`;
    msg += `Valor Total: R$ ${total.toFixed(2).replace('.', ',')}%0A%0A`;
    msg += 'Aguardo a confirmação do pedido. Obrigado! 🙏';
    document.getElementById('whatsapp-link').href = `https://wa.me/${phone}?text=${msg}`;
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('cart-modal');
    if (event.target === modal) {
        closeCart();
    }
} 