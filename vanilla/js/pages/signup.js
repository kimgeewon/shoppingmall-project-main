/**
 * @fileoverview 회원가입 페이지: 폼 검증 후 로컬스토리지(mall_users)에 새 사용자 추가.
 * @module pages/signup
 */

/**
 * 회원가입 페이지 초기화
 */
export function init() {
 App.updateCartCount();
 setupSignupForm();
 setupModal();
}

function setupSignupForm() {
 var form = document.getElementById("signupForm");
 var btn = document.getElementById("signupBtn");

 if (form) {
  form.addEventListener("submit", function (e) {
   e.preventDefault();
   var name = document.getElementById("name").value.trim();
   var email = document.getElementById("email").value.trim();
   var password = document.getElementById("password").value;
   var passwordConfirm = document.getElementById("passwordConfirm").value;

   document.getElementById("nameError").textContent = "";
   document.getElementById("emailError").textContent = "";
   document.getElementById("passwordError").textContent = "";
   document.getElementById("passwordConfirmError").textContent = "";

   if (!name) {
    document.getElementById("nameError").textContent = "이름을 입력해주세요.";
    return;
   }
   if (!email) {
    document.getElementById("emailError").textContent = "이메일을 입력해주세요.";
    return;
   }
   if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    document.getElementById("emailError").textContent = "올바른 이메일 주소가 아닙니다.";
    return;
   }
   if (!password) {
    document.getElementById("passwordError").textContent = "비밀번호를 입력해주세요.";
    return;
   }
   if (password.length < 4) {
    document.getElementById("passwordError").textContent = "최소 4자 이상 입력해주세요.";
    return;
   }
   if (!passwordConfirm) {
    document.getElementById("passwordConfirmError").textContent = "비밀번호 확인을 입력해주세요.";
    return;
   }
   if (password !== passwordConfirm) {
    document.getElementById("passwordConfirmError").textContent = "비밀번호가 일치하지 않습니다.";
    return;
   }

   var users = App.getUsers ? App.getUsers() : [];
   var emailExists =
    Array.isArray(users) &&
    users.some(function (u) {
     return String(u.email).toLowerCase() === email.toLowerCase();
    });
   if (emailExists) {
    document.getElementById("emailError").textContent = "이미 사용 중인 이메일입니다.";
    return;
   }

   btn.textContent = "가입 중...";
   btn.disabled = true;

   var nextId = 1;
   if (users.length > 0) {
    var maxId = Math.max.apply(
     null,
     users.map(function (u) {
      return typeof u.id === "number" ? u.id : parseInt(u.id, 10) || 0;
     })
    );
    nextId = maxId + 1;
   }
   var newUser = {
    id: nextId,
    name: name,
    email: email,
    password: password,
   };
   if (App.setUsers) App.setUsers(users.concat([newUser]));

   btn.textContent = "회원가입";
   btn.disabled = false;
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
  window.location.href = "login.html";
 }

 if (close) close.addEventListener("click", closeModal);
 if (confirm) confirm.addEventListener("click", closeModal);
 modal.addEventListener("click", function (e) {
  if (e.target === modal) closeModal();
 });
}
