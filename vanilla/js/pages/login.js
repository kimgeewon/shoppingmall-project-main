/**
 * @fileoverview 로그인 페이지: 로컬스토리지(mall_users)에 등록된 사용자만 이메일/비밀번호 일치 시 로그인.
 * @module pages/login
 */

/**
 * 로그인 페이지 초기화
 */
export function init() {
 App.updateCartCount();
 setupLoginForm();
 setupModal();
}

function setupLoginForm() {
 var form = document.getElementById("loginForm");
 var btn = document.getElementById("loginBtn");

 if (form) {
  form.addEventListener("submit", function (e) {
   e.preventDefault();
   var email = document.getElementById("email").value.trim();
   var password = document.getElementById("password").value;

   document.getElementById("emailError").textContent = "";
   document.getElementById("passwordError").textContent = "";

   if (!email) {
    document.getElementById("emailError").textContent = "이메일을 입력해주세요.";
    return;
   }
   if (!password) {
    document.getElementById("passwordError").textContent = "비밀번호를 입력해주세요.";
    return;
   }

   btn.textContent = "로그인 중...";
   btn.disabled = true;

   var users = App.getUsers ? App.getUsers() : [];
   var matched =
    Array.isArray(users) &&
    users.find(function (u) {
     return (
      String(u.email).toLowerCase() === email.toLowerCase() && String(u.password) === password
     );
    });

   btn.textContent = "로그인";
   btn.disabled = false;

   if (!matched) {
    document.getElementById("passwordError").textContent =
     "이메일 또는 비밀번호가 일치하지 않습니다.";
    return;
   }

   var user = { id: String(matched.id), email: matched.email, name: matched.name };
   if (App.setCurrentUser) App.setCurrentUser(user);

   document.getElementById("messageModal").style.display = "flex";
   document.body.style.overflow = "hidden";
  });
 }
}

function setupModal() {
 var modal = document.getElementById("messageModal");
 var close = document.getElementById("modalClose");
 var confirm = document.getElementById("modalConfirm");

 function closeModal() {
  modal.style.display = "none";
  document.body.style.overflow = "";
  window.location.href = "index.html";
 }

 if (close) close.addEventListener("click", closeModal);
 if (confirm) confirm.addEventListener("click", closeModal);
 modal.addEventListener("click", function (e) {
  if (e.target === modal) closeModal();
 });
}
