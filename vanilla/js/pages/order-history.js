/**
 * @fileoverview 주문 내역 페이지: 주문 목록 렌더, 검색.
 * @module pages/order-history
 */

/**
 * 주문 내역 페이지 초기화
 */
export function init() {
 App.updateCartCount();
 renderOrderHistory();
 setupSearch();
}

var MOCK_ORDERS = [
 {
  id: "ORD-20240115-001",
  date: "2024.01.15",
  status: "배송중",
  items: [
   {
    name: App.PRODUCTS[0].name,
    image: App.PRODUCTS[0].image,
    price: App.PRODUCTS[0].price,
    quantity: 1,
   },
   {
    name: App.PRODUCTS[1].name,
    image: App.PRODUCTS[1].image,
    price: App.PRODUCTS[1].price,
    quantity: 2,
   },
  ],
  total: 357000,
 },
 {
  id: "ORD-20231220-045",
  date: "2023.12.20",
  status: "배송완료",
  items: [
   {
    name: App.PRODUCTS[2].name,
    image: App.PRODUCTS[2].image,
    price: App.PRODUCTS[2].price,
    quantity: 1,
   },
  ],
  total: 35000,
 },
];

function renderOrderHistory() {
 var container = document.getElementById("orderHistoryList");
 if (!container) return;

 if (MOCK_ORDERS.length === 0) {
  container.innerHTML =
   '<div class="order-history-empty"><div class="empty-icon">📦</div><p>주문 내역이 없습니다.</p></div>';
  return;
 }

 container.innerHTML = MOCK_ORDERS.map(function (order) {
  var statusClass = order.status === "배송중" ? "badge-hot" : "badge-default";
  var itemsHtml = order.items
   .map(function (item) {
    return `<div class="order-history-item">
     <div class="order-history-item-image"><img src="${item.image}" alt="${item.name}"></div>
     <div>
       <span class="badge ${statusClass}">${order.status}</span>
       <p class="order-history-item-name">${item.name}</p>
       <p class="order-history-item-detail">${App.formatPrice(item.price)} / ${item.quantity}개</p>
     </div>
   </div>`;
   })
   .join("");

  return `<div class="order-history-card">
   <div class="order-history-header">
     <div><span class="order-history-date">${
      order.date
     }</span> <span class="order-history-id">${order.id}</span></div>
     <a href="coming-soon.html?from=order-history" class="order-history-link">상세보기 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline-chevron"><path d="m9 18 6-6-6-6"/></svg></a>
   </div>
   <div class="order-history-body">
     <div class="order-history-items">${itemsHtml}</div>
     <div class="order-history-summary">
       <span>총 주문금액</span>
       <span class="order-history-total">${App.formatPrice(order.total)}</span>
       <a href="coming-soon.html?from=order-history" class="btn btn-outline btn-sm btn-full">배송조회</a>
       <a href="coming-soon.html?from=order-history" class="btn btn-outline btn-sm btn-full">교환/반품</a>
     </div>
   </div>
  </div>`;
 }).join("");
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
