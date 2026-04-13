# 9단계: 추가 페이지 작성

`products.html`, `product-detail.html`, `cart.html`, `checkout.html`, `login.html`, `signup.html`, `mypage.html`, `order-history.html`, `order-complete.html`, `magazine.html`, `coming-soon.html` 등을 작성하고, 각 페이지용 JS를 `app.js`의 `data-page`에 연결합니다.

---

## 학습 목표

- 각 HTML의 공통 구조(헤더/푸터, app-header 또는 동일 마크업)
- data-page 속성과 app.js의 detectCurrentPage(), initializePage() 동작
- 페이지별 init: products, product-detail, cart, checkout, auth, mypage, order-history, magazine, coming-soon, order-complete

---

## data-page와 페이지 매핑

| HTML 파일           | data-page      | js/pages/         | init 함수               |
| ------------------- | -------------- | ----------------- | ----------------------- |
| index.html          | main           | main.js           | initMainPage()          |
| products.html       | products       | products.js       | initProductsPage()      |
| product-detail.html | product-detail | product-detail.js | initProductDetailPage() |
| cart.html           | cart           | cart.js           | initCartPage()          |
| checkout.html       | checkout       | checkout.js       | initCheckoutPage()      |
| order-complete.html | order-complete | order-complete.js | initOrderCompletePage() |
| order-history.html  | order-history  | order-history.js  | initOrderHistoryPage()  |
| login.html          | login          | auth.js           | initAuthPage()          |
| signup.html         | signup         | auth.js           | initAuthPage()          |
| mypage.html         | mypage         | mypage.js         | initMypagePage()        |
| magazine.html       | magazine       | magazine.js       | initMagazinePage()      |
| coming-soon.html    | coming-soon    | coming-soon.js    | initComingSoonPage()    |

---

## 실습 방향

1. **공통 HTML 골격**: head(CSS 링크), `<app-header>`, main(section), `<app-footer>`, `<script type="module" src="js/app.js" data-page="???"></script>`
2. **products.html**: 상품 목록 그리드, 카테고리 필터, 정렬, ProductCard 렌더링
3. **product-detail.html**: ?id= 상품 1건 표시, 장바구니 담기, 상품 목록으로 돌아가기(브레드크럼)
4. **cart.html**: 장바구니 아이템 목록, 수량 변경/삭제, 합계, 결제하기 링크
5. **checkout.html**: 주문 요약, 결제 정보 입력, 주문 완료 시 order-complete로 이동
6. **login/signup + auth.js**: 폼 검증, getUser/setUser, 리다이렉트
7. **mypage, order-history, magazine, coming-soon**: 각 페이지별 DOM 렌더링
8. **app.js**: switch(pageName)에서 위 페이지별 init 함수 동적 import 후 실행

---

## 체크리스트

- [ ] 모든 HTML에 `<app-header>`, `<app-footer>` 적용 및 data-page 지정
- [ ] 상품 목록·상세·장바구니·결제·로그인·회원가입·마이페이지·주문내역·매거진 플로우 동작

---

**다음**: [11-step10-final.md](./11-step10-final.md) - 최종 완성 및 테스트
