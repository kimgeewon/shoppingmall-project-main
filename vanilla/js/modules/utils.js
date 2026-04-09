/**
 * @fileoverview 공용 데이터(products, categories 등) 및 유틸 함수(가격 포맷, 카드 생성, 장바구니, 모달).
 * window.App 네임스페이스로 공개.
 * @module modules/utils
 */

/** @typedef {{ id: string, name: string, price: number, originalPrice?: number, rating?: number, reviewCount?: number, image: string, category?: string, badges?: string[], isSoldOut?: boolean }} Product */

window.App = window.App || {};

/* -----------------------------
 * 1) 카테고리·히어로·매거진 (로컬스토리지 없음, 기본값만 사용)
 *    상품·사용자·이벤트(project)는 data/*.json → 로컬스토리지 → App 에서 로드
 * ----------------------------- */
App.CATEGORIES = [
 { id: "all", name: "전체", icon: "LayoutGrid" },
 { id: "electronics", name: "전자제품", icon: "Monitor" },
 { id: "clothing", name: "의류", icon: "Shirt" },
 { id: "food", name: "식품", icon: "Apple" },
 { id: "other", name: "기타", icon: "MoreHorizontal" },
];

/** 상품 목록은 app.js에서 App.getProducts()로 로컬스토리지에서 주입 */
App.PRODUCTS = [];

/* 히어로 배너 이미지 */
App.HERO_BANNER = "https://picsum.photos/id/1/1080/600";

/* 매거진 기사 (figma-make MAGAZINE_ARTICLES) */
App.MAGAZINE_ARTICLES = [
 {
  id: "1",
  category: "TREND REPORT",
  title: "2024 S/S 컬러 트렌드 분석",
  description: "올 봄, 거리를 물들일 핵심 컬러 팔레트와 스타일링 가이드.",
  image: "https://picsum.photos/id/26/800/600",
  date: "2024.03.15",
 },
 {
  id: "2",
  category: "DESIGNER NOTE",
  title: "미니멀리즘의 새로운 해석",
  description: "단순함 속에 숨겨진 디테일, 현대적인 미니멀 룩의 정석.",
  image: "https://picsum.photos/id/268/800/600",
  date: "2024.03.10",
 },
 {
  id: "3",
  category: "STYLE GUIDE",
  title: "액세서리로 완성하는 룩",
  description: "작은 차이가 만드는 큰 변화, 이번 시즌 필수 액세서리.",
  image: "https://picsum.photos/id/182/800/600",
  date: "2024.03.05",
 },
];

/* -----------------------------
 * 2) 공용 유틸 함수
 * ----------------------------- */

/**
 * 가격을 "12,000원" 형식으로 포맷
 * @param {number} value - 가격
 * @returns {string}
 */
App.formatPrice = function (value) {
 return value.toLocaleString() + "원";
};

/**
 * 배지 variant 매핑 (Badge.tsx 기반)
 * @param {string} badge - 배지 라벨 (SALE, HOT, NEW, 품절 등)
 * @returns {string} CSS 클래스명
 */
App.getBadgeClass = function (badge) {
 if (badge === "SALE") return "badge-sale";
 if (badge === "HOT") return "badge-hot";
 if (badge === "NEW") return "badge-new";
 if (badge === "품절") return "badge-soldout";
 return "badge-default";
};

/**
 * 상품 카드 HTML 생성 (ProductCard.tsx 스타일). data-action="add-to-cart"로 버튼/카드 클릭 구분.
 * @param {Product} product - 상품 객체
 * @returns {string} HTML 문자열
 */
App.createProductCard = function (product) {
 const discountRate = product.originalPrice
  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
  : 0;

 const badgesHtml = (product.badges || [])
  .filter(function (b) {
   return b !== "품절";
  })
  .map(function (badge) {
   return `<span class="badge ${App.getBadgeClass(badge)}">${badge}</span>`;
  })
  .join("");

 const priceHtml = product.originalPrice
  ? `<span class="current">${App.formatPrice(
     product.price
    )}</span><span class="original">${App.formatPrice(
     product.originalPrice
    )}</span><span class="discount">${discountRate}%</span>`
  : `<span class="current">${App.formatPrice(product.price)}</span>`;

 const soldoutHtml = product.isSoldOut
  ? '<div class="product-card-soldout"><span class="badge badge-soldout">품절</span></div>'
  : "";

 var cartIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>';
 var starIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="product-card-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>';
 const addBtnHtml = !product.isSoldOut
  ? `<div class="product-card-add-btn"><button type="button" class="btn btn-primary btn-full add-to-cart" data-action="add-to-cart" data-id="${product.id}">${cartIcon} 장바구니 담기</button></div>`
  : "";

 return `
<div class="product-card" data-id="${product.id}">
  <div class="product-card-image">
    <img src="${product.image}" alt="${
  product.name
 }" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
    ${badgesHtml ? `<div class="product-card-badges">${badgesHtml}</div>` : ""}
    ${soldoutHtml}
    ${addBtnHtml}
  </div>
  <div class="product-card-info">
    <h3>${product.name}</h3>
    <div class="product-card-price">${priceHtml}</div>
    <div class="product-card-rating">
      ${starIcon}
      <span class="rating-num">${product.rating}</span>
      <span>(${product.reviewCount})</span>
    </div>
  </div>
</div>`.trim();
};

/* -----------------------------
 * 3) 장바구니 저장소 (localStorage) - storage.js 로드 시 App에 덮어씌워짐
 * ----------------------------- */

/** @returns {Array} 장바구니 아이템 배열 */
App.getCart = function () {
 try {
  return JSON.parse(localStorage.getItem("cart")) || [];
 } catch (e) {
  return [];
 }
};

/**
 * @param {Array} cart - 장바구니 배열
 */
App.setCart = function (cart) {
 localStorage.setItem("cart", JSON.stringify(cart));
};

/**
 * @param {Product|{ id: string }} product - 상품 (id 필수)
 * @param {number} [quantity=1] - 수량
 */
App.addToCart = function (product, quantity) {
 quantity = quantity || 1;
 var products = App.PRODUCTS;
 var cart = App.getCart();
 var found = products.find(function (p) {
  return p.id === product.id || p.id === String(product.id);
 });
 if (!found) return;

 var productId = String(found.id);
 var existing = cart.find(function (item) {
  return item.productId === productId && (!item.option || item.option === "기본");
 });

 if (existing) {
  existing.quantity += quantity;
 } else {
  cart.push({
   id: "cart_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
   productId: productId,
   name: found.name,
   price: found.price,
   image: found.image,
   quantity: quantity,
   option: "기본",
  });
 }

 App.setCart(cart);
 App.updateCartCount();
};

/**
 * @param {string} itemId - 장바구니 아이템 ID
 */
App.removeFromCart = function (itemId) {
 var cart = App.getCart().filter(function (item) {
  return item.id !== itemId;
 });
 App.setCart(cart);
 App.updateCartCount();
};

/**
 * @param {string} itemId - 장바구니 아이템 ID
 * @param {number} delta - 수량 증감
 */
App.updateQuantity = function (itemId, delta) {
 var cart = App.getCart();
 cart = cart.map(function (item) {
  if (item.id === itemId) {
   var newQty = Math.max(1, item.quantity + delta);
   return Object.assign({}, item, { quantity: newQty });
  }
  return item;
 });
 App.setCart(cart);
 App.updateCartCount();
};

App.clearCart = function () {
 App.setCart([]);
 App.updateCartCount();
};

/** 장바구니 개수 표시 (cartCount > 0일 때만 배지 표시) */
App.updateCartCount = function () {
 var cart = App.getCart();
 var totalItems = cart.reduce(function (sum, item) {
  return sum + item.quantity;
 }, 0);
 document.querySelectorAll(".cart-count").forEach(function (el) {
  el.textContent = totalItems;
  el.classList.toggle("is-visible", totalItems > 0);
 });
};

/**
 * 장바구니 담기 모달 표시 (쇼핑 계속하기 / 장바구니 이동)
 * @param {string} productName - 상품명
 * @param {string} productImage - 상품 이미지 URL
 * @param {number} productPrice - 상품 가격
 */
App.showCartModal = function (productName, productImage, productPrice) {
 var existing = document.getElementById("cartModal");
 if (existing) existing.remove();

 var cartIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>';
 var xIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
 var arrowIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
 var modal = document.createElement("div");
 modal.id = "cartModal";
 modal.className = "cart-modal-backdrop";
 modal.innerHTML = `
<div class="cart-modal">
  <div class="cart-modal-content">
    <div class="cart-modal-header">
      <h3 class="cart-modal-title"><span class="cart-modal-title-icon">${cartIcon}</span>장바구니에 상품을 담았습니다</h3>
      <button type="button" class="cart-modal-close">${xIcon}</button>
    </div>
    <div class="cart-modal-body">
      <div class="cart-modal-image"><img src="${productImage}" alt="${productName}" onerror="this.src='https://via.placeholder.com/80?text=No+Image'"></div>
      <div class="cart-modal-info">
        <p class="cart-modal-name">${productName}</p>
        <p class="cart-modal-price">${App.formatPrice(productPrice)}</p>
      </div>
    </div>
    <div class="cart-modal-footer">
      <button type="button" class="btn btn-outline btn-lg cart-modal-continue">쇼핑 계속하기</button>
      <a href="cart.html" class="btn btn-primary btn-lg cart-modal-gocart">장바구니 이동 ${arrowIcon}</a>
    </div>
  </div>
</div>`;

 document.body.appendChild(modal);
 document.body.style.overflow = "hidden";

 function closeModal() {
  modal.remove();
  document.body.style.overflow = "";
 }

 modal.querySelector(".cart-modal-close").addEventListener("click", closeModal);
 modal.querySelector(".cart-modal-continue").addEventListener("click", closeModal);
 modal.addEventListener("click", function (e) {
  if (e.target === modal) closeModal();
 });
};

export {};
