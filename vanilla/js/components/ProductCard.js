/**
 * @fileoverview 상품 카드 HTML 생성 (ProductCard 스타일)
 * @module components/ProductCard
 */

/**
 * 상품 카드 HTML 문자열 생성
 * @param {Object} product - 상품 객체
 * @param {string|number} product.id - 상품 ID
 * @param {string} product.name - 상품명
 * @param {number} product.price - 가격
 * @param {number} [product.originalPrice] - 정가
 * @param {string} product.image - 이미지 URL
 * @param {number} [product.rating] - 평점
 * @param {number} [product.reviewCount] - 리뷰 수
 * @param {boolean} [product.isSoldOut] - 품절 여부
 * @param {string[]} [product.badges] - 배지 (SALE, HOT, NEW, 품절 등)
 * @returns {string} HTML 문자열
 */
function renderProductCard(product) {
 if (!product) return "";

 var discountRate = product.originalPrice
  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
  : 0;

 var badgesHtml = (product.badges || [])
  .filter(function (badge) {
   return badge !== "품절";
  })
  .map(function (badge) {
   return `<span class="badge ${getBadgeClass(badge)}">${badge}</span>`;
  })
  .join("");

 var priceHtml = product.originalPrice
  ? `<span class="current">${App.formatPrice(
     product.price
    )}</span><span class="original">${App.formatPrice(
     product.originalPrice
    )}</span><span class="discount">${discountRate}%</span>`
  : `<span class="current">${App.formatPrice(product.price)}</span>`;

 var soldoutHtml = product.isSoldOut
  ? '<div class="product-card-soldout"><span class="badge badge-soldout">품절</span></div>'
  : "";

 var cartIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>';

 var addBtnHtml = !product.isSoldOut
  ? `<div class="product-card-add-btn"><button type="button" class="btn btn-primary btn-full add-to-cart" data-action="add-to-cart" data-id="${product.id}">${cartIcon} 장바구니 담기</button></div>`
  : "";

 return `
<div class="product-card" data-id="${product.id}">
  <div class="product-card-image">
    <img src="${product.image}" alt="${
  product.name
 }" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
    ${badgesHtml ? `<div class="product-card-badges">${badgesHtml}</div>` : ""}
    ${soldoutHtml}
    ${addBtnHtml}
  </div>
  <div class="product-card-info">
    <h3>${product.name}</h3>
    <div class="product-card-price">${priceHtml}</div>
    <div class="product-card-rating">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="product-card-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
      <span>${product.rating}</span>
      <span>(${product.reviewCount || 0})</span>
    </div>
  </div>
</div>`.trim();
}

/**
 * 배지 라벨에 따른 CSS 클래스 반환
 * @param {string} badge - 배지 라벨 (SALE, HOT, NEW, 품절 등)
 * @returns {string} CSS 클래스명
 */
function getBadgeClass(badge) {
 if (badge === "SALE") return "badge-sale";
 if (badge === "HOT") return "badge-hot";
 if (badge === "NEW") return "badge-new";
 if (badge === "품절") return "badge-soldout";
 return "badge-default";
}

if (typeof window !== "undefined") {
 window.ProductCard = { renderProductCard };
 window.App = window.App || {};
 window.App.createProductCard = renderProductCard;
}

export { renderProductCard, getBadgeClass };
