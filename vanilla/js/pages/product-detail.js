/**
 * @fileoverview 상품 상세 페이지: 갤러리, 수량, 장바구니 담기, 탭(상세정보/리뷰), 관련 상품.
 * @module pages/product-detail
 */

/** @type {Object|null} 현재 상품 객체 */
var currentProduct = null;
/** @type {number} 선택 수량 */
var quantity = 1;

/**
 * 상품 상세 페이지 초기화
 */
export function init() {
 App.updateCartCount();
 loadProduct();
 setupTabs();
 setupQuantity();
 setupAddToCart();
 setupRelatedProducts();
 setupSearch();
}

/** URL id 파라미터로 상품 로드 및 렌더 */
function loadProduct() {
 var params = new URLSearchParams(window.location.search);
 var id = params.get("id");
 if (!id) {
  document.getElementById("productDetailLayout").innerHTML = "<p>상품을 찾을 수 없습니다.</p>";
  return;
 }

 currentProduct = App.PRODUCTS.find(function (p) {
  return String(p.id) === id;
 });
 if (!currentProduct) {
  currentProduct = App.PRODUCTS[0];
 }

 renderProduct();
}

function renderProduct() {
 var p = currentProduct;

 // 갤러리
 var mainImg = document.getElementById("mainImage");
 if (mainImg) {
  mainImg.src = p.image;
  mainImg.alt = p.name;
 }

 var soldOutOverlay = document.getElementById("soldOutOverlay");
 if (soldOutOverlay) {
  soldOutOverlay.style.display = p.isSoldOut ? "flex" : "none";
 }

 // 썸네일
 var thumbsContainer = document.getElementById("thumbnails");
 if (thumbsContainer) {
  var imgs = [p.image, p.image, p.image, p.image];
  thumbsContainer.innerHTML = imgs
   .map(function (img, i) {
    var active = i === 0 ? " active" : "";
    return `<button type="button" class="${active}" data-img="${img}"><img src="${img}" alt="썸네일 ${i + 1}"></button>`;
   })
   .join("");
 }

 document.getElementById("productName").textContent = p.name;

 // 별점
 var starsHtml = "";
 for (var i = 0; i < 5; i++) {
  var cls = i < Math.floor(p.rating) ? "fill" : "";
  starsHtml += `<span class="${cls}">★</span>`;
 }
 var starsEl = document.getElementById("productStars");
 if (starsEl) starsEl.innerHTML = starsHtml;

 var reviewLink = document.getElementById("reviewLink");
 if (reviewLink) reviewLink.textContent = p.rating + " (" + p.reviewCount + "개 리뷰)";

 // 가격
 var discountRate = 0;
 if (p.originalPrice) {
  discountRate = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
 }

 var discountEl = document.getElementById("discountRate");
 var origEl = document.getElementById("originalPrice");
 var currEl = document.getElementById("currentPrice");

 if (discountEl) {
  discountEl.textContent = discountRate + "%";
  discountEl.style.display = p.originalPrice ? "inline" : "none";
 }
 if (origEl) {
  origEl.textContent = App.formatPrice(p.originalPrice || 0);
  origEl.style.display = p.originalPrice ? "inline" : "none";
 }
 if (currEl) currEl.textContent = App.formatPrice(p.price);

 // 수량 섹션
 var qtySection = document.getElementById("quantitySection");
 if (qtySection) qtySection.style.display = p.isSoldOut ? "none" : "flex";

 var addBtn = document.getElementById("addToCartBtn");
 var buyBtn = document.getElementById("buyNowBtn");
 if (p.isSoldOut) {
  if (addBtn) {
   addBtn.textContent = "품절된 상품입니다";
   addBtn.disabled = true;
  }
  if (buyBtn) buyBtn.style.display = "none";
 } else {
  if (addBtn) {
   addBtn.textContent = "장바구니 담기";
   addBtn.disabled = false;
  }
  if (buyBtn) buyBtn.style.display = "inline-flex";
 }

 document.getElementById("detailImage").src = p.image;
 document.getElementById("detailProductName").textContent = p.name;

 document.getElementById("reviewCount").textContent = p.reviewCount;
 document.getElementById("reviewScoreNum").textContent = p.rating;
 document.getElementById("reviewCountText").textContent = p.reviewCount + "개의 리뷰";

 var reviewStars = document.getElementById("reviewStars");
 if (reviewStars) {
  reviewStars.innerHTML = "";
  var filledCount = Math.floor(p.rating);
  for (var j = 0; j < 5; j++) {
   var s = document.createElement("span");
   s.textContent = "★";
   if (j < filledCount) s.classList.add("fill");
   reviewStars.appendChild(s);
  }
 }

 // 썸네일 클릭
 if (thumbsContainer) {
  thumbsContainer.querySelectorAll("button").forEach(function (btn) {
   btn.addEventListener("click", function () {
    thumbsContainer.querySelectorAll("button").forEach(function (b) {
     b.classList.remove("active");
    });
    btn.classList.add("active");
    mainImg.src = btn.getAttribute("data-img");
   });
  });
 }
}

function setupTabs() {
 document.querySelectorAll(".tab-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
   var tab = btn.getAttribute("data-tab");
   document.querySelectorAll(".tab-btn").forEach(function (b) {
    b.classList.remove("active");
   });
   btn.classList.add("active");
   document.getElementById("tabDetail").style.display = tab === "detail" ? "block" : "none";
   document.getElementById("tabReview").style.display = tab === "review" ? "block" : "none";
  });
 });
}

function setupQuantity() {
 var minus = document.getElementById("qtyMinus");
 var plus = document.getElementById("qtyPlus");
 var val = document.getElementById("qtyValue");

 if (minus)
  minus.addEventListener("click", function () {
   if (quantity > 1) {
    quantity--;
    val.textContent = quantity;
   }
  });

 if (plus)
  plus.addEventListener("click", function () {
   quantity++;
   val.textContent = quantity;
  });
}

function setupAddToCart() {
 var addBtn = document.getElementById("addToCartBtn");
 var buyBtn = document.getElementById("buyNowBtn");

 if (addBtn) {
  addBtn.addEventListener("click", function () {
   if (!currentProduct || currentProduct.isSoldOut) return;
   App.addToCart(currentProduct, quantity);
   App.showCartModal(currentProduct.name, currentProduct.image, currentProduct.price);
  });
 }

 if (buyBtn) {
  buyBtn.addEventListener("click", function (e) {
   if (!currentProduct || currentProduct.isSoldOut) return;
   e.preventDefault();
   App.addToCart(currentProduct, quantity);
   window.location.href = "cart.html";
  });
 }
}

function setupRelatedProducts() {
 var container = document.getElementById("relatedProducts");
 if (!container || !currentProduct) return;

 var related = App.PRODUCTS.filter(function (p) {
  return p.id !== currentProduct.id;
 }).slice(0, 4);
 container.innerHTML = related.map(App.createProductCard).join("");

 container.addEventListener("click", function (e) {
  var addBtn = e.target.closest('[data-action="add-to-cart"]');
  if (addBtn) {
   e.preventDefault();
   e.stopPropagation();
   var productId = addBtn.getAttribute("data-id");
   var product = App.PRODUCTS.find(function (p) {
    return String(p.id) === productId;
   });
   if (product) {
    App.addToCart(product, 1);
    App.showCartModal(product.name, product.image, product.price);
    return;
   }
   return;
  }
  var card = e.target.closest(".product-card");
  if (card) {
   window.location.href = "product-detail.html?id=" + card.getAttribute("data-id");
  }
 });
}

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
