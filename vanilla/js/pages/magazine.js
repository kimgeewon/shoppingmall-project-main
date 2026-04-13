/**
 * @fileoverview 매거진 페이지: 기사 그리드 렌더, 검색.
 * @module pages/magazine
 */

/**
 * 매거진 페이지 초기화
 */
export function init() {
 App.updateCartCount();
 renderMagazine();
 setupSearch();
}

function renderMagazine() {
 var articles = App.MAGAZINE_ARTICLES || [];
 var container = document.getElementById("magazineGrid");
 if (!container) return;

 container.innerHTML = articles
  .map(function (article) {
   return `<a href="coming-soon.html?from=magazine" class="magazine-card">
    <div class="magazine-card-image">
      <img src="${article.image}" alt="${article.title}" onerror="this.src='https://via.placeholder.com/400x500?text=No+Image'">
      <span class="magazine-card-badge">${article.category}</span>
    </div>
    <div class="magazine-card-info">
      <span class="magazine-card-date">${article.date}</span>
      <h3>${article.title}</h3>
      <p class="line-clamp-2">${article.description}</p>
      <span class="magazine-card-readmore">READ MORE</span>
    </div>
   </a>`;
  })
  .join("");
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
