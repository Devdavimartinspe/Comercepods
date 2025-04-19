document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".product button");

  // Clique no botão "Adicionar ao Carrinho"
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const productCard = button.closest(".product");
      const name = productCard.querySelector("h3").textContent;
      const priceText = productCard.querySelector("span").textContent;
      const price = parseFloat(priceText.replace("R$ ", "").replace(",", "."));
      
      // Corrigir caminho da imagem para funcionar em qualquer página
      let imgSrc = productCard.querySelector("img").src;
      imgSrc = new URL(imgSrc).pathname; // resultado: "/Images/pod-limao.png"

      addToCart(name, price, imgSrc);
      mostrarNotificacao("Produto adicionado ao carrinho!");
      atualizarContadorCarrinho();
    });
  });

  // ✅ Função separada para adicionar ao carrinho
  function addToCart(name, price, imgSrc) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1, img: imgSrc });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // Atualizar contador no ícone do carrinho
  function atualizarContadorCarrinho() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const countEl = document.getElementById("cart-count");
    if (countEl) countEl.textContent = count;
  }

  atualizarContadorCarrinho();

  // Menu responsivo
  const toggleBtn = document.getElementById("menu-toggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      document.querySelector("nav.menu").classList.toggle("active");
    });
  }

  // Notificação
  function mostrarNotificacao(msg) {
    const noti = document.getElementById("notification");
    if (!noti) return;
    noti.textContent = msg;
    noti.style.display = "block";
    setTimeout(() => {
      noti.style.display = "none";
    }, 2000);
  }

  // Renderizar carrinho (se estiver na página do carrinho)
  const cartItemsContainer = document.getElementById("cart-items");
  const totalEl = document.getElementById("total");

  if (cartItemsContainer && totalEl) {
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
          <div class="item-controls">
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

    renderCart();
  }
});
