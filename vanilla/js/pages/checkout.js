/**
 * @fileoverview 주문/결제 페이지: 주문 목록 렌더, 결제 수단 탭, 주소 검색, 주문 제출.
 * @module pages/checkout
 */

/**
 * 주문/결제 페이지 초기화
 */
export function init() {
 App.updateCartCount();
 renderCheckoutItems();
 updateCheckoutSummary();
 setupPaymentTabs();
 setupAddressSearch();
 setupSubmit();
}

function renderCheckoutItems() {
 var cart = App.getCart();
 var container = document.getElementById("checkoutItems");
 if (!container) return;

 if (cart.length === 0) {
  container.innerHTML = '<p>장바구니가 비어있습니다. <a href="products.html">쇼핑하러 가기</a></p>';
  return;
 }

 container.innerHTML = cart
  .map(function (item) {
   return `<div class="checkout-item">
    <div class="checkout-item-image"><img src="${
     item.image
    }" alt="${item.name}" onerror="this.src='https://via.placeholder.com/64?text=No+Image'"></div>
    <div class="checkout-item-info">
      <p class="checkout-item-name">${item.name}</p>
      <p class="checkout-item-option">옵션: ${item.option || "기본"} / ${item.quantity}개</p>
      <p class="checkout-item-price">${App.formatPrice(item.price * item.quantity)}</p>
    </div>
   </div>`;
  })
  .join("");
}

function updateCheckoutSummary() {
 var cart = App.getCart();
 var subtotal = cart.reduce(function (sum, item) {
  return sum + item.price * item.quantity;
 }, 0);
 var shippingFee = subtotal >= 50000 ? 0 : 3000;
 var total = subtotal + shippingFee;

 var st = document.getElementById("checkoutSubtotal");
 var sh = document.getElementById("checkoutShipping");
 var tot = document.getElementById("checkoutTotal");
 if (st) st.textContent = App.formatPrice(subtotal);
 if (sh) sh.textContent = shippingFee === 0 ? "0원" : App.formatPrice(shippingFee);
 if (tot) tot.textContent = App.formatPrice(total);
 tot.style.color = "var(--orange-600)";
}

function setupPaymentTabs() {
 var tabs = document.querySelectorAll('input[name="paymentMethod"]');
 var cardOpt = document.getElementById("cardOptions");
 var bankOpt = document.getElementById("bankOptions");
 var transferOpt = document.getElementById("transferOptions");

 function showOptions() {
  var val = document.querySelector('input[name="paymentMethod"]:checked').value;
  cardOpt.style.display = val === "card" ? "block" : "none";
  bankOpt.style.display = val === "bank" ? "block" : "none";
  transferOpt.style.display = val === "transfer" ? "block" : "none";
 }

 tabs.forEach(function (t) {
  t.addEventListener("change", showOptions);
 });
}

function setupAddressSearch() {
 var btn = document.getElementById("addressSearch");
 if (btn) {
  btn.addEventListener("click", function () {
   document.getElementById("modalTitle").textContent = "준비 중입니다";
   document.getElementById("modalDesc").textContent = "주소 검색 기능은 아직 구현되지 않았습니다.";
   document.getElementById("modalIcon").className = "modal-icon info";
   document.getElementById("messageModal").style.display = "flex";
  });
 }
}

function setupSubmit() {
 var form = document.getElementById("checkout-form");
 var submitBtn = document.getElementById("submitBtn");
 var modal = document.getElementById("messageModal");
 var modalClose = document.getElementById("modalClose");
 var modalConfirm = document.getElementById("modalConfirm");

 function closeModal() {
  modal.style.display = "none";
  document.body.style.overflow = "";
 }

 function showSuccess() {
  document.getElementById("modalTitle").textContent = "주문이 완료되었습니다!";
  document.getElementById("modalDesc").textContent = "";
  document.getElementById("modalIcon").className = "modal-icon success";
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
  modalConfirm.onclick = function () {
   closeModal();
   window.location.href = "order-complete.html";
  };
 }

 if (modalClose) modalClose.addEventListener("click", closeModal);
 modal.addEventListener("click", function (e) {
  if (e.target === modal) closeModal();
 });

 if (form) {
  form.addEventListener("submit", function (e) {
   e.preventDefault();
   var name = document.getElementById("name").value.trim();
   var phone = document.getElementById("phone").value.trim();
   var address = document.getElementById("address").value.trim();
   var detailAddress = document.getElementById("detailAddress").value.trim();

   if (!name) {
    alert("이름을 입력해주세요.");
    return;
   }
   if (!phone) {
    alert("연락처를 입력해주세요.");
    return;
   }
   if (!address) {
    alert("주소를 입력해주세요.");
    return;
   }
   if (!detailAddress) {
    alert("상세 주소를 입력해주세요.");
    return;
   }

   submitBtn.textContent = "결제 중...";
   submitBtn.disabled = true;

   setTimeout(function () {
    submitBtn.textContent = "결제하기";
    submitBtn.disabled = false;
    var total = document.getElementById("checkoutTotal").textContent;
    try {
     sessionStorage.setItem("lastOrderTotal", total);
    } catch (x) {}
    App.clearCart();
    App.updateCartCount();
    showSuccess();
   }, 1500);
  });
 }
}

/* 검색은 AppHeader에서 처리 */
