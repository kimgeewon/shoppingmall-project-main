# 8단계: 메인 페이지 기능

`js/app.js`(data-page 진입점), `js/modules/modal.js`, `js/components/ProductCard.js`, `js/pages/main.js`를 작성하여 메인 페이지에서 데이터 초기화, 히어로 Swiper, 인기 상품·시즌 추천 렌더링, 장바구니 담기 이벤트를 구현합니다.

---

## 학습 목표

- app.js: data-page에 따른 페이지 초기화(initializePage), detectCurrentPage
- modal.js: 장바구니 담기 모달 표시, placeholder 링크 처리
- ProductCard.js: renderProductCard(product), renderProductCardsAsSlides(products)
- main.js: initMainPage — renderPopularProducts, renderSeasonalProducts, renderMagazinePreview, setupHeroSwiper, setupProductSliders, setupProductEvents(이벤트 위임으로 장바구니 담기)

---

## 실습 방향

1. **app.js**: data-page 값을 읽고 **공통 스크립트(icons/utils/header)**를 먼저 로드한 뒤, 페이지 스크립트(main.js 등)를 순서대로 로드합니다.
2. **index.html**: `<script type="module" src="js/app.js" data-page="main"></script>`
3. **main.js**: getProducts()로 상품 목록 조회 → 인기순/역순으로 슬라이드 렌더링, 매거진 영역 채우기, Swiper 초기화, product-card 클릭·add-to-cart 버튼 클릭 시 addToCart + showCartModal.
4. **ProductCard**: 상품 카드 HTML 문자열 생성(이미지, 배지, 가격, 평점, 장바구니 담기 버튼 data-id).

---

## 체크리스트

- [ ] app.js data-page="main" 시 initMainPage() 실행
- [ ] 인기 상품·시즌 추천 Swiper 표시
- [ ] 매거진 미리보기 표시
- [ ] 장바구니 담기 클릭 시 모달 표시

---

**다음**: [10-step9-more-pages.md](./10-step9-more-pages.md) - 추가 페이지 작성
