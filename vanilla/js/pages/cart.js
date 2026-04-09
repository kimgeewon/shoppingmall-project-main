/**
 * @fileoverview 장바구니 페이지: 렌더링, 수량 변경, 삭제, 합계 계산. App.getCart/App.setCart 기반.
 * @module pages/cart
 */

/**
 * 장바구니 페이지 초기화
 */
export function init() {
 App.updateCartCount();
 setupCartEvents();
 setupSearch();
 renderCart();
}

/**
 * 헤더 검색 - products.html로 이동
 */
function setupSearch() {
 var searchBtn = document.querySelector(".search-btn");
 var searchInput = document.getElementById("searchInput");
 if (searchBtn && searchInput) {
  searchBtn.addEventListener("click", function () {
   var keyword = searchInput.value.trim();
   if (!keyword) {
    alert("검색어를 입력해주세요.");
    return;
   }
   window.location.href = "products.html?search=" + encodeURIComponent(keyword);
  });
  searchInput.addEventListener("keydown", function (e) {
   if (e.key === "Enter") searchBtn.click();
  });
 }
}

/**
 * 장바구니 이벤트 설정 (한 번만 등록)
 */
function setupCartEvents() {
 var listEl = document.getElementById("cartList");
 if (listEl) {
  listEl.addEventListener("click", handleCartClick);
 }
 var clearBtn = document.getElementById("clearCartBtn");
 if (clearBtn) {
  clearBtn.onclick = function () {
   if (confirm("장바구니를 비우시겠습니까?")) {
    App.clearCart();
    renderCart();
   }
  };
 }
 var orderBtn = document.getElementById("orderBtn");
 if (orderBtn) {
  orderBtn.href = "checkout.html";
  orderBtn.onclick = function (e) {
   if (App.getCart().length === 0) {
    e.preventDefault();
    alert("장바구니가 비어있습니다.");
   }
  };
 }
}

/**
 * 장바구니 렌더링
 */
function renderCart() {
 var cart = App.getCart();

 var emptyEl = document.getElementById("cartEmpty");
 var contentEl = document.getElementById("cartContent");

 if (cart.length === 0) {
  if (emptyEl) emptyEl.style.display = "flex";
  if (contentEl) contentEl.style.display = "none";
  return;
 }

 if (emptyEl) emptyEl.style.display = "none";
 if (contentEl) contentEl.style.display = "block";

 var countEl = document.getElementById("cartItemCount");
 if (countEl) countEl.textContent = `전체 ${cart.length}개`;

 var listEl = document.getElementById("cartList");
 if (listEl) {
  listEl.innerHTML = cart
   .map(function (item) {
    var itemTotal = item.price * item.quantity;
    return `<li class="cart-item" data-id="${item.id}">
     <a href="product-detail.html?id=${item.productId}" class="cart-item-image">
       <img src="${
        item.image
       }" alt="${item.name}" onerror="this.src='https://via.placeholder.com/128x128?text=No+Image'">
     </a>
     <div class="cart-item-info">
       <a href="product-detail.html?id=${item.productId}" class="cart-item-name">${item.name}</a>
       ${item.option ? `<p class="cart-item-option">옵션: ${item.option}</p>` : ""}
       <p class="cart-item-price-mobile">${App.formatPrice(itemTotal)}</p>
     </div>
     <div class="cart-item-controls">
       <div class="quantity-control">
         <button type="button" data-action="decrease" data-id="${item.id}">−</button>
         <span>${item.quantity}</span>
         <button type="button" data-action="increase" data-id="${item.id}">+</button>
       </div>
       <div class="cart-item-total">${App.formatPrice(itemTotal)}</div>
       <button type="button" class="cart-item-remove" data-action="remove" data-id="${
        item.id
       }" aria-label="삭제">
         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
       </button>
     </div>
   </li>`;
   })
   .join("");
 }

 updateTotal();
}

/**
 * 장바구니 아이템 클릭 처리 (수량 증가/감소, 삭제)
 */
function handleCartClick(e) {
 var btn = e.target.closest("button");
 if (!btn) return;

 var action = btn.getAttribute("data-action");
 var itemId = btn.getAttribute("data-id");
 if (!action || !itemId) return;

 var cart = App.getCart();
 var item = cart.find(function (i) {
  return i.id === itemId;
 });
 if (!item) return;

 if (action === "increase") {
  item.quantity += 1;
  App.setCart(cart);
  App.updateCartCount();
  renderCart();
 } else if (action === "decrease") {
  if (item.quantity > 1) {
   item.quantity -= 1;
   App.setCart(cart);
   App.updateCartCount();
   renderCart();
  }
 } else if (action === "remove") {
  if (confirm("정말 삭제하시겠습니까?")) {
   App.removeFromCart(itemId);
   renderCart();
  }
 }
}

/**
 * 주문 합계 업데이트
 * - 50,000원 이상 무료배송
 */
function updateTotal() {
 var cart = App.getCart();
 var subtotal = cart.reduce(function (sum, item) {
  return sum + item.price * item.quantity;
 }, 0);
 var shippingFee = subtotal >= 50000 ? 0 : 3000;
 var total = subtotal + shippingFee;

 var subtotalEl = document.getElementById("subtotal");
 var shippingEl = document.getElementById("shippingFee");
 var totalEl = document.getElementById("cartTotal");
 var freeMsg = document.getElementById("freeShippingMsg");

 if (subtotalEl) subtotalEl.textContent = App.formatPrice(subtotal);
 if (shippingEl)
  shippingEl.textContent = shippingFee === 0 ? "0원" : "+" + App.formatPrice(shippingFee);
 if (totalEl) totalEl.textContent = App.formatPrice(total);

 if (freeMsg) {
  if (shippingFee > 0) {
   freeMsg.style.display = "block";
   freeMsg.textContent = (50000 - subtotal).toLocaleString() + "원 더 담으면 무료배송!";
   freeMsg.style.fontSize = "0.75rem";
   freeMsg.style.color = "var(--orange-600)";
   freeMsg.style.textAlign = "right";
  } else {
   freeMsg.style.display = "none";
  }
 }
}
