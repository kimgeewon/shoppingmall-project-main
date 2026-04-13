# 7단계: JavaScript 기초

데이터 구조를 정의하고, `data/products.json`, `data/users.json`과 `js/modules/storage.js`, `utils.js`, `api.js`를 작성합니다.

---

## 학습 목표

- 상품·사용자 데이터 스키마 이해
- data/products.json, data/users.json 작성
- storage.js: localStorage (getCart, setCart, getRecentSearches, getUser 등)
- utils.js: formatPrice, escapeHtml, showToast, getBadgeClass
- api.js: initializeData, loadProductsData, getProducts, getProductById

---

## 실습 단계

### 1단계: 폴더 구조

- `js/modules/` — storage, utils, api
- `js/components/` — (8단계에서 ProductCard 등)
- `js/pages/` — main, products, product-detail, cart, checkout, auth, mypage, order-history 등

### 2단계: data/products.json

상품 배열: id, name, price, originalPrice, rating, reviewCount, image, category, badges, isSoldOut 등.  
기존 `App.PRODUCTS` 구조를 JSON으로 옮깁니다.

### 3단계: data/users.json

사용자 배열: id, name, email, password 등. (로그인/회원가입용)

### 4단계: storage.js

- getCart / setCart
- getRecentSearches / setRecentSearches
- getUser / setUser (로그인 상태)
- addToCart, removeFromCart, updateQuantity, clearCart

### 5단계: utils.js

- formatPrice(value)
- escapeHtml(str)
- showToast(message)
- getBadgeClass(badge) (SALE, HOT, NEW, 품절 등)

### 6단계: api.js

- initializeData(): fetch로 products.json, users.json 로드 후 localStorage에 세팅
- getProducts(), getProductById(id)
- (선택) getMagazineArticles()

---

## 체크리스트

- [ ] data/products.json, users.json 작성
- [ ] storage.js, utils.js, api.js 작성
- [ ] app.js에서 initializeData() 호출 시 데이터 로드 확인

---

**다음**: [09-step8-js-main.md](./09-step8-js-main.md) - 메인 페이지 기능
