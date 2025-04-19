document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items");
  const totalEl = document.getElementById("total");
  const finalizarBtn = document.getElementById("finalizar-btn");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function renderCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      const itemEl = document.createElement("div");
      itemEl.className = "cart-item";

      itemEl.innerHTML = `
        <div class="item-info" style="display: flex; align-items: center; gap: 10px;">
          <img src="${item.img}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
          <div>
            <strong>${item.name}</strong><br>
            R$ ${item.price.toFixed(2).replace('.', ',')}
          </div>
        </div>
        <div class="item-controls" style="margin-top: 10px;">
          <button onclick="updateQuantity(${index}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity(${index}, 1)">+</button>
          <button class="remove-btn" onclick="removeItem(${index})">Remover</button>
        </div>
      `;

      cartItemsContainer.appendChild(itemEl);
      total += item.price * item.quantity;
    });

    totalEl.textContent = total.toFixed(2).replace('.', ',');
  }

  window.updateQuantity = (index, change) => {
    if (cart[index].quantity + change <= 0) return;
    cart[index].quantity += change;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  };

  window.removeItem = (index) => {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  };

  // ✅ Enviar pedido via WhatsApp
  if (finalizarBtn) {
    finalizarBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
      }

      let mensagem = "*Novo pedido via PODY!*\n\n";

      cart.forEach(item => {
        mensagem += `🛍️ *${item.name}* - Quantidade: ${item.quantity} - Preço unitário: R$ ${item.price.toFixed(2).replace('.', ',')}\n`;
      });

      let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      mensagem += `\n💰 *Total*: R$ ${total.toFixed(2).replace('.', ',')}`;

      // Coloque seu número com DDI + DDD e número (exemplo: 5511999999999)
      const numeroDono = "5511974796323";
      const url = `https://wa.me/${numeroDono}?text=${encodeURIComponent(mensagem)}`;

      window.open(url, "_blank");
    });
  }

  renderCart();
});
