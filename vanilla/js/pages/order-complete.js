/**
 * @fileoverview 주문 완료 페이지: 주문 번호·총액 표시.
 * @module pages/order-complete
 */

/**
 * 주문 완료 페이지 초기화
 */
export function init() {
 App.updateCartCount();
 var orderNum = document.getElementById("orderNumber");
 if (orderNum) {
  orderNum.textContent =
   "ORD-" +
   new Date().toISOString().slice(0, 10).replace(/-/g, "") +
   "-" +
   Math.floor(Math.random() * 1000);
 }
 var total = document.getElementById("orderTotal");
 if (total) total.textContent = sessionStorage.getItem("lastOrderTotal") || "58,000원";
}
