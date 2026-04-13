/**
 * @fileoverview 마이페이지: 사용자 정보, 검색.
 * @module pages/mypage
 */

/**
 * 마이페이지 초기화
 */
export function init() {
 App.updateCartCount();
 renderUserProfile();
 setupSearch();
}

/** 세션 스토리지 로그인 사용자로 프로필(이름·이메일) 표시 */
function renderUserProfile() {
 var user = App.getCurrentUser ? App.getCurrentUser() : null;
 var nameEl = document.getElementById("mypageUserName");
 var emailEl = document.getElementById("mypageUserEmail");
 var avatarEl = document.getElementById("mypageAvatar");

 if (nameEl) {
  nameEl.textContent = user && user.name ? user.name + "님" : "회원님";
 }
 if (emailEl) {
  emailEl.textContent = user && user.email ? user.email : "";
 }
 if (avatarEl && user && user.name) {
  avatarEl.textContent = user.name.charAt(0);
 }
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
