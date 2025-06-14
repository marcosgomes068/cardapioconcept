let cart = [];
let orderInfo = {
    name: '',
    address: '',
    payment: '',
    notes: ''
};

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
    
    // Renderizar formulário de pedido
    const orderForm = document.getElementById('order-form');
    if (!orderForm.innerHTML) {
        orderForm.innerHTML = `
            <h3>Informações do Pedido</h3>
            <div class="form-group">
                <label for="customer-name">Nome:</label>
                <input type="text" id="customer-name" required placeholder="Seu nome completo">
            </div>
            <div class="form-group">
                <label for="customer-address">Endereço:</label>
                <input type="text" id="customer-address" required placeholder="Rua, número, bairro">
            </div>
            <div class="form-group">
                <label for="payment-method">Forma de Pagamento:</label>
                <select id="payment-method" required>
                    <option value="">Selecione...</option>
                    <option value="dinheiro">Dinheiro</option>
                    <option value="pix">PIX</option>
                    <option value="cartao">Cartão de Crédito/Débito</option>
                </select>
            </div>
            <div class="form-group">
                <label for="order-notes">Observações:</label>
                <textarea id="order-notes" placeholder="Alguma observação especial?"></textarea>
            </div>
        `;
    }
    updateWhatsappLink();
}

function removeFromCart(idx) {
    cart.splice(idx, 1);
    renderCart();
    updateCartCount();
}

function updateOrderInfo() {
    orderInfo.name = document.getElementById('customer-name').value;
    orderInfo.address = document.getElementById('customer-address').value;
    orderInfo.payment = document.getElementById('payment-method').value;
    orderInfo.notes = document.getElementById('order-notes').value;
    updateWhatsappLink();
}

function updateWhatsappLink() {
    const phone = '556892088865'; // Número do WhatsApp com DDD e país
    let msg = '🍖 *PEDIDO - ESPETINHOS* 🍖%0A%0A';
    
    // Informações do cliente
    if (orderInfo.name) {
        msg += `*👤 Nome:* ${orderInfo.name}%0A`;
    }
    if (orderInfo.address) {
        msg += `*📍 Endereço:* ${orderInfo.address}%0A`;
    }
    if (orderInfo.payment) {
        msg += `*💳 Forma de Pagamento:* ${orderInfo.payment}%0A`;
    }
    if (orderInfo.notes) {
        msg += `*📝 Observações:* ${orderInfo.notes}%0A`;
    }
    
    msg += '%0A*📋 Itens do Pedido:*%0A';
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
    msg += '*📱 Instruções:*%0A';
    msg += 'Após enviar o pedido, você receberá uma mensagem de confirmação.%0A';
    msg += 'Use os comandos para gerenciar seu pedido:%0A';
    msg += '/confirmar - Para confirmar o pedido%0A';
    msg += '/cancelar - Para cancelar o pedido%0A';
    msg += '/status - Para verificar o status%0A%0A';
    msg += 'Obrigado pela preferência! 🙏';
    
    document.getElementById('whatsapp-link').href = `https://wa.me/${phone}?text=${msg}`;
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('cart-modal');
    if (event.target === modal) {
        closeCart();
    }
} 