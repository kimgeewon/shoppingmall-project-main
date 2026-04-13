/**
 * @fileoverview 상품 목록 페이지: 필터, 정렬, 검색, 페이지네이션.
 * @module pages/products
 */

/** @type {Object[]} 현재 필터/정렬된 상품 목록 */
var currentProducts = [];
/** @type {number} 현재 페이지 (1부터) */
var currentPage = 1;
/** @type {number} 페이지당 상품 수 */
var ITEMS_PER_PAGE = 12;

/**
 * 상품 목록 페이지 초기화
 */
export function init() {
 App.updateCartCount();
 applyQueryFilters();
 currentPage = getPageFromUrl();
 renderProducts(currentProducts);
 setupFilters();
 setupSort();
 setupProductGridEvents();
 setupPaginationEvents();
}

function getPageFromUrl() {
 var params = new URLSearchParams(window.location.search);
 var p = parseInt(params.get("page"), 10);
 return p >= 1 ? p : 1;
}

function setPageInUrl(page) {
 var url = new URL(window.location.href);
 url.searchParams.set("page", String(page));
 if (page === 1) url.searchParams.delete("page");
 window.history.replaceState({}, "", url.toString());
}

/**
 * 상품 렌더링 (페이지네이션 적용)
 */
function renderProducts(list) {
 var container = document.getElementById("productsGrid");
 if (!container) return;

 var countEl = document.getElementById("productsCount");
 if (countEl) countEl.textContent = `(${list.length}개)`;

 if (list.length === 0) {
  container.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding:5rem; color:var(--gray-500);">조건에 맞는 상품이 없습니다.</p>`;
  renderPagination(0);
  return;
 }

 var totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);
 if (currentPage > totalPages) currentPage = totalPages || 1;
 setPageInUrl(currentPage);

 var start = (currentPage - 1) * ITEMS_PER_PAGE;
 var slice = list.slice(start, start + ITEMS_PER_PAGE);
 container.innerHTML = slice.map(App.createProductCard).join("");
 renderPagination(list.length);
}

/**
 * 페이지네이션 UI 렌더 (prev, 1 2 3 ... 10, next)
 */
function renderPagination(totalItems) {
 var wrap = document.getElementById("paginationWrap");
 var container = document.getElementById("pagination");
 if (!wrap || !container) return;

 var totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
 if (totalPages <= 1) {
  wrap.style.display = "none";
  return;
 }
 wrap.style.display = "flex";

 var prevDisabled = currentPage === 1 ? " disabled" : "";
 var nextDisabled = currentPage === totalPages ? " disabled" : "";
 var html = `<button type="button" class="pagination-btn pagination-prev" data-page="prev" aria-label="이전 페이지"${prevDisabled}>이전</button>`;

 var showPages = getPageNumbers(currentPage, totalPages);
 for (var i = 0; i < showPages.length; i++) {
  var p = showPages[i];
  if (p === "...") {
   html += '<span class="pagination-ellipsis">…</span>';
  } else {
   var activeClass = p === currentPage ? " active" : "";
   html += `<button type="button" class="pagination-btn${activeClass}" data-page="${p}" aria-label="${p}페이지">${p}</button>`;
  }
 }

 html += `<button type="button" class="pagination-btn pagination-next" data-page="next" aria-label="다음 페이지"${nextDisabled}>다음</button>`;
 container.innerHTML = html;
}

function getPageNumbers(current, total) {
 if (total <= 7) {
  var a = [];
  for (var i = 1; i <= total; i++) a.push(i);
  return a;
 }
 if (current <= 3) return [1, 2, 3, 4, "...", total];
 if (current >= total - 2) return [1, "...", total - 3, total - 2, total - 1, total];
 return [1, "...", current - 1, current, current + 1, "...", total];
}

function setupPaginationEvents() {
 var container = document.getElementById("pagination");
 if (!container) return;
 container.addEventListener("click", function (e) {
  var btn = e.target.closest(".pagination-btn");
  if (!btn || btn.disabled || btn.classList.contains("active")) return;
  var page = btn.getAttribute("data-page");
  var totalPages = Math.ceil(currentProducts.length / ITEMS_PER_PAGE);
  if (page === "prev") currentPage = Math.max(1, currentPage - 1);
  else if (page === "next") currentPage = Math.min(totalPages, currentPage + 1);
  else currentPage = parseInt(page, 10);
  setPageInUrl(currentPage);
  renderProducts(currentProducts);
  document.querySelector(".products-top")?.scrollIntoView({ behavior: "smooth", block: "start" });
 });
}

/**
 * 상품 그리드 이벤트 위임
 */
function setupProductGridEvents() {
 var container = document.getElementById("productsGrid");
 if (!container) return;

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
   }
   return;
  }

  var card = e.target.closest(".product-card");
  if (card) {
   var id = card.getAttribute("data-id");
   window.location.href = "product-detail.html?id=" + id;
  }
 });
}

/**
 * URL 파라미터 반영 (search, category)
 */
function applyQueryFilters() {
 var params = new URLSearchParams(window.location.search);
 var search = params.get("search");
 var category = params.get("category");

 var filtered = App.PRODUCTS.slice();

 if (category && category !== "all") {
  filtered = filtered.filter(function (p) {
   return p.category === category;
  });
  var titleEl = document.getElementById("productsTitle");
  if (titleEl) {
   var cat = App.CATEGORIES.find(function (c) {
    return c.id === category;
   });
   titleEl.textContent = cat ? cat.name : "카테고리: " + category;
  }
 }

 if (search) {
  var keyword = search.toLowerCase();
  filtered = filtered.filter(function (p) {
   return p.name.toLowerCase().indexOf(keyword) >= 0;
  });
  var titleEl = document.getElementById("productsTitle");
  if (titleEl) titleEl.textContent = "'" + search + "' 검색 결과";
  var clearEl = document.getElementById("searchClear");
  if (clearEl) clearEl.style.display = "block";
 }

 currentProducts = filtered;
}

/**
 * 필터 설정
 */
function setupFilters() {
 var checkboxes = document.querySelectorAll('.filter-group input[type="checkbox"]');
 checkboxes.forEach(function (cb) {
  cb.addEventListener("change", applyFilters);
 });

 var priceRange = document.getElementById("priceRange");
 if (priceRange) {
  priceRange.addEventListener("input", function () {
   var val = parseInt(priceRange.value, 10);
   var priceVal = document.getElementById("priceValue");
   if (priceVal) priceVal.textContent = val.toLocaleString() + "원";
   applyFilters();
  });
 }

 var clearFiltersBtn = document.getElementById("clearFiltersBtn");
 if (clearFiltersBtn) {
  clearFiltersBtn.addEventListener("click", clearAllFilters);
 }

 var clearSearchBtn = document.getElementById("clearSearchBtn");
 if (clearSearchBtn) {
  clearSearchBtn.addEventListener("click", function () {
   window.location.href = "products.html";
  });
 }
}

function applyFilters() {
 var selectedCats = [];
 document.querySelectorAll('.filter-group input[type="checkbox"]:checked').forEach(function (cb) {
  selectedCats.push(cb.value);
 });

 var maxPrice = parseInt(document.getElementById("priceRange").value, 10) || 500000;

 var filtered = App.PRODUCTS.filter(function (p) {
  if (selectedCats.length > 0 && selectedCats.indexOf(p.category) < 0) return false;
  if (p.price > maxPrice) return false;
  return true;
 });

 // URL search 유지
 var params = new URLSearchParams(window.location.search);
 var search = params.get("search");
 if (search) {
  var keyword = search.toLowerCase();
  filtered = filtered.filter(function (p) {
   return p.name.toLowerCase().indexOf(keyword) >= 0;
  });
 }

 currentProducts = filtered;
 currentPage = 1;
 setPageInUrl(1);
 renderProducts(currentProducts);
}

function clearAllFilters() {
 document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(function (cb) {
  cb.checked = false;
 });
 var priceRange = document.getElementById("priceRange");
 if (priceRange) {
  priceRange.value = 500000;
  var priceVal = document.getElementById("priceValue");
  if (priceVal) priceVal.textContent = "500,000원";
 }
 currentProducts = App.PRODUCTS.slice();
 currentPage = 1;
 applyQueryFilters();
 setPageInUrl(1);
 renderProducts(currentProducts);
}

/**
 * 정렬
 */
function setupSort() {
 var sortSelect = document.getElementById("sortSelect");
 if (!sortSelect) return;

 sortSelect.addEventListener("change", function () {
  var val = sortSelect.value;
  var sorted = currentProducts.slice();

  switch (val) {
   case "price-low":
    sorted.sort(function (a, b) {
     return a.price - b.price;
    });
    break;
   case "price-high":
    sorted.sort(function (a, b) {
     return b.price - a.price;
    });
    break;
   case "popular":
    sorted.sort(function (a, b) {
     return b.rating - a.rating;
    });
    break;
   case "newest":
    sorted.sort(function (a, b) {
     return parseInt(b.id, 10) - parseInt(a.id, 10);
    });
    break;
  }

  currentProducts = sorted;
  currentPage = 1;
  setPageInUrl(1);
  renderProducts(currentProducts);
 });
}

/* 검색은 AppHeader에서 처리 */
