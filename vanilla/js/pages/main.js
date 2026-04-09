/**
 * @fileoverview 메인 페이지: 인기 상품/시즌 추천 렌더링, 히어로 슬라이더, 이벤트 위임.
 * @module pages/main
 */

/**
 * 메인 페이지 초기화
 */
export function init() {
 App.updateCartCount();
 renderPopularProducts();
 renderSeasonalProducts();
 renderMagazinePreview();
 renderEventSection();
 setupHeroSwiper();
 setupProductSliders();
 setupProductEvents();
}

/** 인기 상품 렌더링 (평점 높은 순) */
function renderPopularProducts() {
 var container = document.getElementById("popularProducts");
 if (!container) return;

 var popular = App.PRODUCTS.slice().sort(function (a, b) {
  return b.rating - a.rating;
 });

 container.innerHTML = popular
  .map(function (p) {
   return `<div class="swiper-slide">${App.createProductCard(p)}</div>`;
  })
  .join("");
}

/**
 * 매거진 섹션 (figma-make: Featured Article + Side Articles)
 */
function renderMagazinePreview() {
 var container = document.getElementById("magazinePreview");
 if (!container || !App.MAGAZINE_ARTICLES) return;
 var articles = App.MAGAZINE_ARTICLES;
 var featured = articles[0];
 var sideArticles = articles.slice(1);

 var featuredHtml = featured
  ? `<a href="magazine.html" class="magazine-featured group">
    <div class="magazine-featured-image">
      <img src="${featured.image}" alt="${featured.title}">
      <span class="magazine-featured-badge">${featured.category}</span>
    </div>
    <div class="magazine-featured-content">
      <span class="magazine-featured-date">${featured.date}</span>
      <h3>${featured.title}</h3>
      <p class="line-clamp-2">${featured.description}</p>
    </div>
  </a>`
  : "";

 var sideHtml = sideArticles
  .map(function (a) {
   return `<a href="magazine.html" class="magazine-side-item group">
    <div class="magazine-side-image">
      <img src="${a.image}" alt="${a.title}">
    </div>
    <div class="magazine-side-content">
      <div class="magazine-side-meta">
        <span class="magazine-side-category">${a.category}</span>
        <span class="magazine-side-dot"></span>
        <span class="magazine-side-date">${a.date}</span>
      </div>
      <h3 class="line-clamp-2">${a.title}</h3>
      <p class="line-clamp-2">${a.description}</p>
      <span class="magazine-side-readmore">READ MORE</span>
    </div>
  </a>`;
  })
  .join("");

 container.innerHTML = `<div class="magazine-featured-wrap">${featuredHtml}</div><div class="magazine-side-list">${sideHtml}</div>`;
}

/**
 * 이벤트 & 기획전 섹션 (로컬스토리지 mall_project → App.PROJECT)
 * - 피처드 히어로(첫 번째) + 나머지 이벤트 그리드/가로 스크롤
 */
function getEventTagLabel(tag) {
 var map = {
  sale: "세일",
  premium: "프리미엄",
  beauty: "뷰티",
  sports: "스포츠",
  outlet: "아울렛",
  new: "신규",
  seasonal: "시즌",
 };
 return tag ? map[tag] || tag : "";
}

function getEventHref(p) {
 return "products.html" + (p.tag ? "?tag=" + encodeURIComponent(p.tag) : "");
}

function renderEventSection() {
 var container = document.getElementById("eventSection");
 if (!container) return;

 var list = App.PROJECT || [];
 var items = Array.isArray(list)
  ? list.filter(function (p) {
     return p.status === "active" || p.status === "scheduled";
    })
  : [];
 if (items.length === 0) {
  container.innerHTML = '<p class="events-empty">진행 중인 이벤트가 없습니다.</p>';
  return;
 }

 var featured = items[0];
 var others = items.slice(1);
 var tagLabel = getEventTagLabel(featured.tag);
 var href = getEventHref(featured);
 var statusLabel = featured.status === "scheduled" ? "예정" : "진행중";

 var featuredHtml = `<a href="${href}" class="events-featured">
  <div class="events-featured-bg">
    <img src="${
     featured.image || ""
    }" alt="" loading="eager" onerror="this.src='https://via.placeholder.com/1200x400?text=Event'">
    <span class="events-featured-overlay"></span>
  </div>
  <div class="events-featured-content">
    ${tagLabel ? `<span class="events-featured-tag">${tagLabel}</span>` : ""}
    <span class="events-featured-status">${statusLabel}</span>
    <h3 class="events-featured-title">${featured.title || ""}</h3>
    <p class="events-featured-desc">${featured.description || ""}</p>
    ${featured.endDate ? `<span class="events-featured-date">~ ${featured.endDate}</span>` : ""}
    <span class="events-featured-cta">자세히 보기</span>
  </div>
</a>`;

 var cardsHtml = others
  .map(function (p) {
   var pl = getEventTagLabel(p.tag);
   var link = getEventHref(p);
   var scheduled = p.status === "scheduled" ? " event-card--scheduled" : "";
   return `<a href="${link}" class="event-card${scheduled}">
  <div class="event-card-image">
    <img src="${
     p.image || ""
    }" alt="${p.title || ""}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x240?text=Event'">
    ${pl ? `<span class="event-card-tag">${pl}</span>` : ""}
  </div>
  <div class="event-card-body">
    <h3>${p.title || ""}</h3>
    ${p.endDate ? `<span class="event-card-date">~ ${p.endDate}</span>` : ""}
  </div>
</a>`;
  })
  .join("");

 var othersHtml =
  others.length === 0
   ? ""
   : `<div class="events-others">
     <h3 class="events-others-title">다른 이벤트</h3>
     <div class="events-marquee" aria-label="이벤트 목록 롤링">
       <div class="events-track">
         <div class="events-track-part">${cardsHtml}</div>
         <div class="events-track-part">${cardsHtml}</div>
       </div>
     </div>
   </div>`;

 container.innerHTML = `<div class="events-block">${featuredHtml}${othersHtml}</div>`;
}

/**
 * 시즌 추천 렌더링 - 역순으로 다른 상품 표시 (figma-make: seasonalProducts)
 */
function renderSeasonalProducts() {
 var container = document.getElementById("seasonalProducts");
 if (!container) return;

 var seasonal = App.PRODUCTS.slice().reverse();
 container.innerHTML = seasonal
  .map(function (p) {
   return `<div class="swiper-slide">${App.createProductCard(p)}</div>`;
  })
  .join("");
}

/**
 * 히어로 배너 Swiper (figma-make: react-slick과 동일 - autoplay 5s, speed 500, prev/next/play)
 */
function setupHeroSwiper() {
 if (typeof Swiper === "undefined") return;
 var heroEl = document.getElementById("heroSwiper");
 if (!heroEl) return;

 var heroSwiper = new Swiper("#heroSwiper", {
  loop: true,
  speed: 500,
  autoplay: { delay: 5000, disableOnInteraction: false },
  allowTouchMove: true,
 });

 var prevBtn = document.getElementById("heroPrev");
 var nextBtn = document.getElementById("heroNext");
 var playBtn = document.getElementById("heroPlay");
 var iconPlay = playBtn ? playBtn.querySelector(".icon-play") : null;
 var iconPause = playBtn ? playBtn.querySelector(".icon-pause") : null;

 if (prevBtn)
  prevBtn.addEventListener("click", function () {
   heroSwiper.slidePrev();
  });
 if (nextBtn)
  nextBtn.addEventListener("click", function () {
   heroSwiper.slideNext();
  });
 if (playBtn) {
  playBtn.addEventListener("click", function () {
   if (heroSwiper.autoplay.running) {
    heroSwiper.autoplay.stop();
    if (iconPlay) iconPlay.style.display = "none";
    if (iconPause) iconPause.style.display = "";
   } else {
    heroSwiper.autoplay.start();
    if (iconPlay) iconPlay.style.display = "";
    if (iconPause) iconPause.style.display = "none";
   }
  });
 }
}

/**
 * Swiper 슬라이더 초기화 (figma-make react-slick과 동일: 4/3/2/1 slides, speed 500)
 */
function setupProductSliders() {
 if (typeof Swiper === "undefined") return;

 var popularSwiperEl = document.getElementById("popularSwiper");
 var seasonalSwiperEl = document.getElementById("seasonalSwiper");

 var swiperConfig = {
  slidesPerView: 1,
  spaceBetween: 16,
  speed: 500,
  slidesPerGroup: 1,
  loop: true,
  grabCursor: true,
  breakpoints: {
   480: { slidesPerView: 1 },
   768: { slidesPerView: 2 },
   1024: { slidesPerView: 3 },
   1280: { slidesPerView: 4 },
  },
 };

 var popularSwiper = null;
 var seasonalSwiper = null;

 if (popularSwiperEl) {
  popularSwiper = new Swiper("#popularSwiper", swiperConfig);
 }
 if (seasonalSwiperEl) {
  seasonalSwiper = new Swiper("#seasonalSwiper", swiperConfig);
 }

 var popularPrev = document.getElementById("popularPrev");
 var popularNext = document.getElementById("popularNext");
 var seasonalPrev = document.getElementById("seasonalPrev");
 var seasonalNext = document.getElementById("seasonalNext");

 if (popularPrev)
  popularPrev.addEventListener("click", function () {
   popularSwiper && popularSwiper.slidePrev();
  });
 if (popularNext)
  popularNext.addEventListener("click", function () {
   popularSwiper && popularSwiper.slideNext();
  });
 if (seasonalPrev)
  seasonalPrev.addEventListener("click", function () {
   seasonalSwiper && seasonalSwiper.slidePrev();
  });
 if (seasonalNext)
  seasonalNext.addEventListener("click", function () {
   seasonalSwiper && seasonalSwiper.slideNext();
  });
}

function setupProductEvents() {
 var popularContainer = document.getElementById("popularProducts");
 var seasonalContainer = document.getElementById("seasonalProducts");

 function handleContainerClick(container) {
  if (!container) return;
  container.addEventListener("click", function (e) {
   // 장바구니 버튼 클릭
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

   // 카드 클릭 - 상세 페이지
   var card = e.target.closest(".product-card");
   if (card) {
    var id = card.getAttribute("data-id");
    window.location.href = "product-detail.html?id=" + id;
   }
  });
 }

 handleContainerClick(popularContainer);
 handleContainerClick(seasonalContainer);
}
