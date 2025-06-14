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
            <span>${item.name} x${item.qty} - R$ ${(item.price * item.qty).toFixed(2)}</span>
            <button onclick="removeFromCart(${idx})">Remover</button>
        `;
        cartItems.appendChild(li);
    });
    document.getElementById('cart-total').textContent = total.toFixed(2);
    updateWhatsappLink();
}

function removeFromCart(idx) {
    cart.splice(idx, 1);
    renderCart();
    updateCartCount();
}

// Mostrar/esconder campo de troco baseado na forma de pagamento
document.getElementById('payment-method').addEventListener('change', function() {
    const changeGroup = document.getElementById('change-group');
    changeGroup.style.display = this.value === 'dinheiro' ? 'block' : 'none';
});

function updateWhatsappLink() {
    const phone = '556892088865'; // Número do WhatsApp com DDD e país
    let msg = '🍖 *PEDIDO - ESPETINHOS* 🍖%0A%0A';
    
    // Informações do cliente
    const name = document.getElementById('customer-name').value;
    const address = document.getElementById('customer-address').value;
    const paymentMethod = document.getElementById('payment-method').value;
    const change = document.getElementById('payment-change').value;
    
    if (!name || !address || !paymentMethod) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return false;
    }
    
    msg += `*Nome:* ${name}%0A`;
    msg += `*Endereço:* ${address}%0A`;
    msg += `*Forma de Pagamento:* ${paymentMethod}%0A`;
    
    if (paymentMethod === 'dinheiro' && change) {
        msg += `*Troco para:* R$ ${change}%0A`;
    }
    
    msg += '%0A*Itens do Pedido:*%0A';
    
    cart.forEach(item => {
        msg += `- ${item.name} x${item.qty} - R$ ${(item.price * item.qty).toFixed(2)}%0A`;
    });
    
    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    msg += '%0A*Total:* R$ ' + total.toFixed(2);
    
    const whatsappLink = document.getElementById('whatsapp-link');
    whatsappLink.href = `https://wa.me/${phone}?text=${msg}`;
    return true;
}

// Adicionar evento de clique para o botão do WhatsApp
document.getElementById('whatsapp-link').addEventListener('click', function(e) {
    if (!updateWhatsappLink()) {
        e.preventDefault(); // Previne a abertura do link se a validação falhar
    }
});

// Atualizar o link do WhatsApp quando o carrinho mudar
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${item.name} x${item.qty} - R$ ${(item.price * item.qty).toFixed(2)}
            <button onclick="removeFromCart(${index})">Remover</button>
        `;
        cartItems.appendChild(li);
        total += item.price * item.qty;
    });
    
    document.getElementById('cart-total').textContent = total.toFixed(2);
    updateWhatsappLink();
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('cart-modal');
    if (event.target === modal) {
        closeCart();
    }
} 