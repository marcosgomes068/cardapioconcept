let cart = [];
let orderInfo = {
    name: '',
    address: '',
    payment: '',
    notes: '',
    change: ''
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
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.innerText = cart.reduce((sum, i) => sum + i.qty, 0);
    }
}

function openCart() {
    const modal = document.getElementById('cart-modal');
    if (!modal) return;
    
    renderCart();
    modal.style.display = 'block';
}

function closeCart() {
    const modal = document.getElementById('cart-modal');
    if (!modal) return;
    
    modal.style.display = 'none';
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const orderForm = document.getElementById('order-form');
    
    if (!cartItems || !cartTotal || !orderForm) return;
    
    // Limpar e atualizar itens do carrinho
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
    
    cartTotal.textContent = total.toFixed(2);
    
    // Renderizar formulário de pedido
    orderForm.innerHTML = `
        <h3>Informações do Pedido</h3>
        <div class="form-group">
            <label for="customer-name">Nome: <span class="required">*</span></label>
            <input type="text" id="customer-name" required placeholder="Seu nome completo">
        </div>
        <div class="form-group">
            <label for="customer-address">Endereço: <span class="required">*</span></label>
            <textarea id="customer-address" required placeholder="Rua, número, bairro, complemento..."></textarea>
        </div>
        <div class="form-group">
            <label for="payment-method">Forma de Pagamento: <span class="required">*</span></label>
            <select id="payment-method" required>
                <option value="">Selecione...</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="pix">PIX</option>
                <option value="cartao">Cartão de Crédito/Débito</option>
            </select>
        </div>
        <div class="form-group" id="change-group" style="display: none;">
            <label for="payment-change">Troco para quanto?</label>
            <input type="number" id="payment-change" placeholder="Valor em reais" step="0.01">
        </div>
        <div class="form-group">
            <label for="order-notes">Observações:</label>
            <textarea id="order-notes" placeholder="Alguma observação especial?"></textarea>
        </div>
        <p class="required-fields-note"><span class="required">*</span> Campos obrigatórios</p>
    `;

    // Adicionar evento para mostrar/esconder campo de troco
    const paymentMethod = document.getElementById('payment-method');
    if (paymentMethod) {
        paymentMethod.addEventListener('change', function() {
            const changeGroup = document.getElementById('change-group');
            if (changeGroup) {
                changeGroup.style.display = this.value === 'dinheiro' ? 'block' : 'none';
            }
        });
    }
    
    updateWhatsappLink();
}

function removeFromCart(idx) {
    cart.splice(idx, 1);
    renderCart();
    updateCartCount();
}

function updateOrderInfo() {
    const nameInput = document.getElementById('customer-name');
    const addressInput = document.getElementById('customer-address');
    const paymentSelect = document.getElementById('payment-method');
    const notesTextarea = document.getElementById('order-notes');
    const changeInput = document.getElementById('payment-change');
    
    if (!nameInput || !addressInput || !paymentSelect || !notesTextarea) return;
    
    orderInfo.name = nameInput.value;
    orderInfo.address = addressInput.value;
    orderInfo.payment = paymentSelect.value;
    orderInfo.notes = notesTextarea.value;
    orderInfo.change = changeInput ? changeInput.value : '';
    
    updateWhatsappLink();
}

function updateWhatsappLink() {
    const whatsappLink = document.getElementById('whatsapp-link');
    if (!whatsappLink) return;
    
    const phone = ''; // Número do WhatsApp com DDD e país
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
    if (orderInfo.change && orderInfo.payment === 'dinheiro') {
        msg += `*💰 Troco para:* R$ ${orderInfo.change}%0A`;
    }
    if (orderInfo.notes) {
        msg += `*📝 Observações:* ${orderInfo.notes}%0A`;
    }
    
    msg += '%0A*📋 Itens do Pedido:*%0A';
    cart.forEach(item => {
        msg += `- ${item.name} x${item.qty} - R$ ${(item.price * item.qty).toFixed(2)}%0A`;
    });
    
    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    msg += '%0A*💰 Resumo do Pedido*%0A';
    msg += `Total de Itens: ${cart.reduce((sum, i) => sum + i.qty, 0)}%0A`;
    msg += `Valor Total: R$ ${total.toFixed(2)}%0A%0A`;
    msg += 'Obrigado pela preferência! 🙏';
    
    whatsappLink.href = `https://wa.me/${phone}?text=${msg}`;
}

// Adicionar evento de clique para o botão do WhatsApp
document.addEventListener('DOMContentLoaded', function() {
    const whatsappLink = document.getElementById('whatsapp-link');
    if (whatsappLink) {
        whatsappLink.addEventListener('click', function(e) {
            const name = document.getElementById('customer-name').value.trim();
            const address = document.getElementById('customer-address').value.trim();
            const payment = document.getElementById('payment-method').value;
            
            if (!name || !address || !payment) {
                e.preventDefault();
                alert('Por favor, preencha todos os campos obrigatórios!');
                
                // Destacar campos não preenchidos
                if (!name) document.getElementById('customer-name').classList.add('error');
                if (!address) document.getElementById('customer-address').classList.add('error');
                if (!payment) document.getElementById('payment-method').classList.add('error');
                
                return;
            }
            
            // Remover classes de erro se todos os campos estiverem preenchidos
            document.getElementById('customer-name').classList.remove('error');
            document.getElementById('customer-address').classList.remove('error');
            document.getElementById('payment-method').classList.remove('error');
            
            updateOrderInfo();
        });
    }
});

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('cart-modal');
    if (event.target === modal) {
        closeCart();
    }
} 
