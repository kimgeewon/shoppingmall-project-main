# 코드 이해 가이드

이 문서는 프로젝트의 주요 코드를 이해하는 데 도움을 주기 위해 작성되었습니다.

## 1. 앱 구조 (데이터 흐름)

```
main.jsx
  └─ initData()      → public/data/*.json 을 fetch → localStorage에 저장
  └─ <App />         → 라우팅 + StoreProvider

App.jsx
  └─ BrowserRouter   → URL에 따른 페이지 전환
  └─ StoreProvider   → user, cart 등 전역 상태 제공
  └─ Layout          → Header + Outlet(페이지) + Footer
```

## 2. 파일별 역할

### 핵심 (진입점·설정)

| 파일 | 역할 |
|------|------|
| `main.jsx` | 1) initData()로 JSON → localStorage 2) React 앱 마운트 |
| `App.jsx` | 라우트 정의, StoreProvider, Layout |
| `api.js` | localStorage/sessionStorage 기반 CRUD (상품, 장바구니, 로그인, 주문) |
| `utils.js` | `cn()` - Tailwind 클래스 병합 유틸 |

### 전역 상태

| 파일 | 역할 |
|------|------|
| `StoreContext.jsx` | user(로그인), cart(장바구니), login/logout, addToCart 등 제공 |

### 레이아웃

| 파일 | 역할 |
|------|------|
| `Layout.jsx` | Header + Outlet(페이지) + Footer |
| `Header.jsx` | 로고, 검색, 장바구니 아이콘, 로그인/메뉴 |
| `Footer.jsx` | 링크, 저작권 |
| `Breadcrumb.jsx` | 홈 > 상품 > ... 경로 표시 |
| `ScrollToTop.jsx` | 라우트 변경 시 스크롤 상단 이동 |

### UI 컴포넌트

| 파일 | 역할 |
|------|------|
| `Button.jsx` | variant, size에 따른 버튼 스타일 |
| `Input.jsx` | 폼 입력 + error, helperText |
| `Badge.jsx` | SALE, HOT, NEW 등 작은 라벨 |
| `Skeleton.jsx` | 로딩 중 회색 플레이스홀더 |
| `ImageWithFallback.jsx` | 이미지 로드 실패 시 placeholder |
| `Slider.jsx` | Radix UI 가격 범위 슬라이더 |

### 모달

| 파일 | 역할 |
|------|------|
| `CartModal.jsx` | 장바구니 담기 완료 → 쇼핑 계속 / 장바구니 이동 |
| `AlertModal.jsx` | 확인/취소 버튼 (삭제 확인 등) |
| `MessageModal.jsx` | 확인 버튼만 (로그아웃 완료 등) |

### 상품

| 파일 | 역할 |
|------|------|
| `ProductCard.jsx` | 상품 카드 (클릭→상세, 장바구니→CartModal) |

## 3. 핵심 개념 설명

### 3-1. useStore() - 전역 상태 사용

```jsx
const { user, cart, addToCart, isLoggedIn } = useStore();

// 로그인 여부
if (isLoggedIn) { ... }

// 장바구니 담기
addToCart({ productId, name, price, image, quantity: 1, option: "기본" });
```

### 3-2. api.js - 데이터 저장소

- **localStorage**: 상품, 장바구니, 주문 (브라우저에 영구 저장)
- **sessionStorage**: 로그인(user) - 탭 닫으면 삭제됨
- **getCartKey()**: 로그인 시 `shopping_cart_user_1`, 비로그인 시 `shopping_cart`

### 3-3. Outlet - 라우트 콘텐츠

`Layout.jsx`의 `<Outlet />` 위치에, 현재 URL path에 맞는 페이지가 렌더링됩니다.

- `/` → HomePage
- `/products` → ProductListPage
- `/cart` → CartPage
- ...

### 3-4. createPortal - 모달 렌더링

모달을 `#root` 바깥 `document.body`에 렌더링합니다. z-index로 다른 요소 위에 표시하고, 부모 스타일 영향을 받지 않습니다.

### 3-5. flushSync - 즉시 반영

`StoreContext`의 `addToCart` 등에서 `flushSync(() => setCart(updated))`를 사용하는 이유: React가 state를 비동기로 처리하므로, 장바구니 담기 직후 헤더 뱃지가 바로 바뀌도록 강제로 DOM을 갱신합니다.

## 4. 페이지별 데이터 흐름

| 페이지 | 데이터 소스 | 주요 동작 |
|--------|-------------|-----------|
| HomePage | getProducts(), getMagazineArticles() | 배너, 상품 슬라이더 |
| ProductListPage | getProducts(), getCategories() | 필터, 검색 |
| ProductDetailPage | getProductById(id) | 상품 정보, 장바구니 담기 |
| CartPage | useStore().cart | 수량 변경, 삭제, 주문하기 |
| CheckoutPage | useStore().cart, createOrder() | 폼 입력, 주문 생성 |
| LoginPage | api.login() → useStore().login() | 로그인 후 redirect |
| MyPage | useStore().user, getOrders() | 프로필, 최근 주문 |

## 5. 스타일 (Tailwind)

- **theme.css**: `--color-primary`, `--color-secondary` 등 디자인 토큰
- **components.css**: `.page-container`, `.card-form`, `.breadcrumb-nav` 등 공통 클래스
- **cn()**: 조건부 클래스 조합 시 사용

## 6. 더 알아보기

- [practice-guide/](./practice-guide/README.md) - 단계별 실습 가이드
- 각 파일 상단의 JSDoc 주석 - 해당 파일의 역할과 props 설명
