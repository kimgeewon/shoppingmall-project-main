# 08. 장바구니와 주문 플로우

> **목표**: api.js에 장바구니·로그인·주문 API를 추가하고, StoreContext를 api와 연동한 뒤 CartPage, CheckoutPage, OrderCompletePage를 구현합니다.

## 1. api.js 완성

프로젝트의 `src/lib/api.js`를 그대로 복사해 사용합니다. 05에서 만든 최소 버전에 아래 함수들이 추가되어 있어야 합니다.

- **장바구니**: `getCart`, `addToCart`, `updateCartQuantity`, `removeFromCart`, `clearCart`
- **인증**: `login`, `logout`, `getCurrentUser`, `signup`, `mergeGuestCartIntoUser`
- **주문**: `createOrder`, `getOrders`

> **참고**: `src/lib/api.js` 파일 전체를 프로젝트에서 복사하면 됩니다.

## 2. StoreContext 연동

프로젝트의 `src/app/context/StoreContext.jsx`를 그대로 복사합니다.

- `api.getCurrentUser()`, `api.getCart()`로 초기 상태 복원
- `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`에서 `api.*` 호출 후 `flushSync`로 state 업데이트
- `login`, `logout`에서 `api.login`, `api.logout` 사용

## 3. 모달: AlertModal, MessageModal

프로젝트의 `src/app/components/modal/AlertModal.jsx`, `MessageModal.jsx`를 복사합니다.

## 4. CartPage, CheckoutPage, OrderCompletePage

프로젝트의 `src/app/pages/CartPage.jsx`, `CheckoutPage.jsx`, `OrderCompletePage.jsx`를 그대로 복사합니다.

## 5. 확인

1. 상품에서 장바구니 담기 → CartPage에 항목 표시
2. 수량 변경, 삭제 동작
3. 비로그인 시 주문하기 → `/login?redirect=/checkout` 이동
4. 로그인(test@test.com / test1234) 후 주문 진행 → 주문 완료

## 6. 다음 단계

[09-navigation-patterns.md](./09-navigation-patterns.md)에서 브레드크럼 적용과 검색 UX 보강을 진행합니다.

---

## 📖 강의 시 참고 – 핵심 개념

### flushSync

```jsx
import { flushSync } from "react-dom";

flushSync(() => {
  setCart(updatedCart);
});
navigate("/checkout");
```

- **개념**: `flushSync`는 state 업데이트를 즉시 DOM에 반영(동기 처리).
- **이유**: 주문 완료 후 `navigate("/order-complete")`로 이동할 때, `setCart([])`가 아직 반영되지 않으면 새 페이지에서 이전 장바구니가 보일 수 있음. flushSync로 확실히 반영 후 이동.
- **주의**: 성능 영향 있음. 꼭 필요한 경우(라우팅 직전 등)에만 사용.

### api와 StoreContext 연동

- **초기화**: `useEffect`에서 `getCurrentUser()`, `getCart()` 호출 후 state 설정.
- **흐름**: `addToCart` → api.addToCart → api.getCart() → setCart. 단일 진실 공급원(Single Source of Truth) 유지.

### redirect 처리

```jsx
const [searchParams] = useSearchParams();
const redirect = searchParams.get("redirect") || "/";

// 로그인 성공 후
navigate(redirect);
```

- **의미**: 장바구니에서 "주문하기" 클릭 시 비로그인이면 `/login?redirect=/checkout`으로 이동. 로그인 후 `/checkout`으로 복귀.

### mergeGuestCartIntoUser

- **개념**: 비로그인 시 localStorage에 담긴 장바구니(게스트 장바구니)와 로그인한 사용자 장바구니를 합침.
- **흐름**: 로그인 성공 시 api.mergeGuestCartIntoUser() → 통합 장바구니를 store에 반영.
