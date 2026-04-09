/**
 * @fileoverview 앱 헤더 컴포넌트 (검색, 장바구니, 로그인/로그아웃, 모바일 메뉴)
 * @module components/AppHeader
 */

const RECOMMENDED_TERMS = ["노트북", "가을 자켓", "영양제", "캠핑용품", "기계식 키보드"];

/**
 * 앱 헤더 커스텀 엘리먼트
 * @extends HTMLElement
 */
class AppHeader extends HTMLElement {
 /** @override */
 connectedCallback() {
  if (this._initialized) return;
  this._initialized = true;
  this.render();
  this.cacheElements();
  this.bindEvents();
  this.refreshAuthState();
  this.updateCartCount();
 }

 /** @override */
 disconnectedCallback() {
  if (this._handleDocumentClick) {
   document.removeEventListener("mousedown", this._handleDocumentClick);
  }
 }

 /** 헤더 HTML 렌더링 */
 render() {
  this.innerHTML = `
      <header class="header">
        <div class="container header-inner">
          <div class="logo">
            <a href="index.html">MALL</a>
          </div>
          <div class="header-search-wrap">
            <form id="headerSearchForm" class="header-search-form">
              <div class="header-search-input-wrap">
                <label class="sr-only" for="headerSearchInput">상품 검색</label>
                <input id="headerSearchInput" type="text" placeholder="상품을 검색해보세요" autocomplete="off" class="header-search-input" />
                <button type="submit" class="header-search-btn" aria-label="검색">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </button>
              </div>
              <div id="searchDropdown" class="search-dropdown">
                <div class="search-dropdown-inner">
                  <div class="search-dropdown-section">
                    <div class="search-dropdown-header">
                      <span class="search-dropdown-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        최근 검색어
                      </span>
                      <button type="button" id="clearRecentSearches" class="search-dropdown-clear">전체 삭제</button>
                    </div>
                    <ul id="recentSearchesList" class="search-dropdown-list"></ul>
                  </div>
                  <div class="search-dropdown-section search-dropdown-recommended">
                    <div class="search-dropdown-header">
                      <span class="search-dropdown-title recommended">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                          <polyline points="16 7 22 7 22 13" />
                        </svg>
                        추천 검색어
                      </span>
                    </div>
                    <div id="recommendedSearches" class="recommended-terms"></div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="header-right">
            <a href="cart.html" class="cart-icon" aria-label="장바구니로 이동">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              <span class="cart-count">0</span>
            </a>
            <div id="headerAuth" class="header-auth">
              <div id="headerLoginLinks" class="header-login-links">
                <a href="login.html" class="header-link">로그인</a>
                <a href="signup.html" class="header-link">회원가입</a>
              </div>
              <div id="headerUserSection" class="header-user-section" style="display:none">
                <a href="mypage.html" class="header-user-link">
                  <div class="header-user-avatar"><span>홍</span></div>
                  <span class="header-user-name">홍길동님</span>
                </a>
                <button type="button" id="headerLogoutBtn" class="header-logout-btn" title="로그아웃">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" x2="9" y1="12" y2="12" />
                  </svg>
                </button>
              </div>
            </div>
            <button type="button" id="mobileMenuBtn" class="mobile-menu-btn" aria-label="메뉴">
              <span class="icon-menu">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              </span>
              <span class="icon-close" style="display:none">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </span>
            </button>
          </div>
        </div>
        <div id="mobileMenu" class="mobile-menu">
          <form id="mobileSearchForm" class="mobile-search-form">
            <input type="text" placeholder="검색" autocomplete="off" />
            <button type="submit" class="mobile-search-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
          </form>
          <nav class="mobile-nav">
            <a href="index.html">홈</a>
            <a href="products.html">상품</a>
            <a href="products.html?category=all">카테고리</a>
            <a href="products.html?tag=sale">이벤트</a>
            <a href="magazine.html">매거진</a>
            <hr />
            <a href="login.html">로그인</a>
            <a href="signup.html">회원가입</a>
          </nav>
        </div>
      </header>
    `;
 }

 /** DOM 요소 캐시 */
 cacheElements() {
  this.searchForm = this.querySelector("#headerSearchForm");
  this.searchInput = this.querySelector("#headerSearchInput");
  this.searchDropdown = this.querySelector("#searchDropdown");
  this.searchWrap = this.querySelector(".header-search-wrap");
  this.searchInputWrap = this.querySelector(".header-search-input-wrap");
  this.recentList = this.querySelector("#recentSearchesList");
  this.clearRecentBtn = this.querySelector("#clearRecentSearches");
  this.recommendedArea = this.querySelector("#recommendedSearches");
  this.mobileMenuBtn = this.querySelector("#mobileMenuBtn");
  this.mobileMenu = this.querySelector("#mobileMenu");
  this.authSection = this.querySelector("#headerAuth");
  this.loginLinks = this.querySelector("#headerLoginLinks");
  this.userSection = this.querySelector("#headerUserSection");
  this.logoutBtn = this.querySelector("#headerLogoutBtn");
  this.cartBadgeEls = this.querySelectorAll(".cart-count");
  this.mobileSearchForm = this.querySelector("#mobileSearchForm");
 }

 /** 이벤트 바인딩 */
 bindEvents() {
  this._handleDocumentClick = this.handleDocumentClick.bind(this);
  document.addEventListener("mousedown", this._handleDocumentClick);

  if (this.logoutBtn) {
   this.logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    (window.AppStorage && AppStorage.logoutCurrentUser()) || sessionStorage.removeItem("user");
    this.refreshAuthState();
    if (this.mobileMenu) this.mobileMenu.classList.remove("open");
    window.location.href = "index.html";
   });
  }

  if (this.searchInput) {
   this.searchInput.addEventListener("focus", () => this.showSearchDropdown());
  }

  if (this.searchForm) {
   this.searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const term = this.searchInput ? this.searchInput.value.trim() : "";
    if (!term) return;
    this.saveRecentSearch(term);
    window.location.href = "products.html?search=" + encodeURIComponent(term);
    this.hideSearchDropdown();
   });
  }

  if (this.clearRecentBtn) {
   this.clearRecentBtn.addEventListener("click", () => {
    this.clearRecentSearches();
    this.renderRecentSearches();
    this.clearRecentBtn.style.display = "none";
   });
  }

  if (this.mobileMenuBtn && this.mobileMenu) {
   this.mobileMenuBtn.addEventListener("click", () => {
    const isOpen = this.mobileMenu.classList.toggle("open");
    const iconMenu = this.mobileMenuBtn.querySelector(".icon-menu");
    const iconClose = this.mobileMenuBtn.querySelector(".icon-close");
    if (iconMenu) iconMenu.style.display = isOpen ? "none" : "";
    if (iconClose) iconClose.style.display = isOpen ? "" : "none";
   });

   this.mobileMenu.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("click", () => {
     this.mobileMenu.classList.remove("open");
     const iconMenu = this.mobileMenuBtn.querySelector(".icon-menu");
     const iconClose = this.mobileMenuBtn.querySelector(".icon-close");
     if (iconMenu) iconMenu.style.display = "";
     if (iconClose) iconClose.style.display = "none";
    });
   });
  }

  if (this.mobileSearchForm) {
   this.mobileSearchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = this.mobileSearchForm.querySelector("input");
    const term = input ? input.value.trim() : "";
    if (!term) return;
    this.saveRecentSearch(term);
    window.location.href = "products.html?search=" + encodeURIComponent(term);
    this.mobileMenu?.classList.remove("open");
   });
  }
 }

 handleDocumentClick(event) {
  if (!this.contains(event.target)) {
   this.hideSearchDropdown();
  }
 }

 showSearchDropdown() {
  if (this.searchDropdown) this.searchDropdown.classList.add("open");
  if (this.searchWrap) this.searchWrap.classList.add("search-focused");
  if (this.searchInputWrap) this.searchInputWrap.classList.add("search-focused");
  this.renderRecentSearches();
  this.renderRecommendedSearches();
 }

 hideSearchDropdown() {
  if (this.searchDropdown) this.searchDropdown.classList.remove("open");
  if (this.searchWrap) this.searchWrap.classList.remove("search-focused");
  if (this.searchInputWrap) this.searchInputWrap.classList.remove("search-focused");
 }

 refreshAuthState() {
  const user =
   (window.AppStorage && AppStorage.getCurrentUser && AppStorage.getCurrentUser()) ||
   this.readUserFallback();

  if (!this.authSection) return;
  if (user) {
   if (this.loginLinks) this.loginLinks.style.display = "none";
   if (this.userSection) {
    this.userSection.style.display = "flex";
    const nameEl = this.userSection.querySelector(".header-user-name");
    const avatarEl = this.userSection.querySelector(".header-user-avatar span");
    if (nameEl) nameEl.textContent = user.name + "님";
    if (avatarEl) avatarEl.textContent = user.name.charAt(0);
   }
  } else {
   if (this.loginLinks) this.loginLinks.style.display = "flex";
   if (this.userSection) this.userSection.style.display = "none";
  }
 }

 readUserFallback() {
  try {
   return JSON.parse(sessionStorage.getItem("user") || "null");
  } catch (error) {
   return null;
  }
 }

 renderRecentSearches() {
  if (!this.recentList) return;
  const recent =
   (window.AppStorage && AppStorage.getRecentSearches && AppStorage.getRecentSearches()) ||
   this.readRecentFallback();

  if (recent.length === 0) {
   this.recentList.innerHTML = '<li class="search-empty">최근 검색 내역이 없습니다.</li>';
  } else {
   this.recentList.innerHTML = recent
    .map(function (term) {
     const safe = term.replace(/"/g, "&quot;");
     return `<li class="search-item">
          <button type="button" class="search-term-btn" data-term="${safe}">${term}</button>
          <button type="button" class="search-remove-btn" data-term="${safe}" title="삭제">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </li>`;
    })
    .join("");

   this.recentList.querySelectorAll(".search-term-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
     const term = btn.dataset.term;
     if (this.searchInput) this.searchInput.value = term;
     window.location.href = "products.html?search=" + encodeURIComponent(term);
     this.hideSearchDropdown();
    });
   });

   this.recentList.querySelectorAll(".search-remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
     e.stopPropagation();
     const term = btn.dataset.term;
     this.removeRecentSearch(term);
     this.renderRecentSearches();
    });
   });
  }

  if (this.clearRecentBtn) {
   this.clearRecentBtn.style.display = recent.length > 0 ? "block" : "none";
  }
 }

 renderRecommendedSearches() {
  if (!this.recommendedArea) return;
  this.recommendedArea.innerHTML = RECOMMENDED_TERMS.map(function (term) {
   return `<button type="button" class="recommended-term" data-term="${term}">#${term}</button>`;
  }).join("");

  this.recommendedArea.querySelectorAll(".recommended-term").forEach((btn) => {
   btn.addEventListener("click", () => {
    const term = btn.dataset.term;
    if (this.searchInput) this.searchInput.value = term;
    this.saveRecentSearch(term);
    window.location.href = "products.html?search=" + encodeURIComponent(term);
    this.hideSearchDropdown();
   });
  });
 }

 saveRecentSearch(term) {
  if (window.AppStorage && AppStorage.saveRecentSearch) {
   AppStorage.saveRecentSearch(term);
  } else {
   const arr = this.readRecentFallback().filter((t) => t !== term);
   this.writeRecentFallback([term].concat(arr).slice(0, 10));
  }
 }

 removeRecentSearch(term) {
  if (window.AppStorage && AppStorage.removeRecentSearch) {
   AppStorage.removeRecentSearch(term);
  } else {
   const filtered = this.readRecentFallback().filter((t) => t !== term);
   this.writeRecentFallback(filtered);
  }
 }

 clearRecentSearches() {
  if (window.AppStorage && AppStorage.clearRecentSearches) {
   AppStorage.clearRecentSearches();
  } else {
   this.writeRecentFallback([]);
  }
 }

 readRecentFallback() {
  try {
   return JSON.parse(localStorage.getItem("recentSearches") || "[]");
  } catch (error) {
   return [];
  }
 }

 writeRecentFallback(arr) {
  writeStorageSafe("recentSearches", arr);
 }

 /**
  * 장바구니 개수 배지 갱신
  * @param {number} [totalItems] - 총 수량 (미지정 시 스토리지에서 계산)
  */
 updateCartCount(totalItems) {
  const total =
   typeof totalItems === "number"
    ? totalItems
    : ((window.AppStorage && AppStorage.getCart && AppStorage.getCart()) || []).reduce(
       (sum, item) => sum + (item.quantity || 0),
       0
      );

  this.cartBadgeEls.forEach((badge) => {
   badge.textContent = total;
   badge.classList.toggle("is-visible", total > 0);
  });
 }
}

/**
 * 로컬 스토리지 안전 저장
 * @param {string} key - 키
 * @param {*} value - 저장할 값 (JSON 직렬화)
 */
function writeStorageSafe(key, value) {
 try {
  localStorage.setItem(key, JSON.stringify(value));
 } catch (error) {
  console.error("[AppHeader] 로컬 스토리지 저장 실패:", error);
 }
}

customElements.define("app-header", AppHeader);

export {};
