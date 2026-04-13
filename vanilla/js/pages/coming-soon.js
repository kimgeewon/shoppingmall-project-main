/**
 * @fileoverview 준비 중 페이지 (404 대체): from 파라미터에 따른 뒤로가기 동작.
 * @module pages/coming-soon
 */

/**
 * 준비 중 페이지 초기화
 */
export function init() {
 App.updateCartCount();
 var params = new URLSearchParams(window.location.search);
 var from = params.get("from");
 var backBtn = document.getElementById("backBtn");

 if (backBtn) {
  backBtn.addEventListener("click", function () {
   if (from) {
    window.location.href = `${from}.html`;
   } else {
    window.history.back();
   }
  });
 }
}
