# 02. 프로젝트 구조 및 라우팅

> **목표**: App 구조를 잡고, 라우팅을 설정하여 페이지 간 이동이 가능한 기본 뼈대를 만듭니다.

## 1. StoreContext (최소 버전)

먼저 전역 상태를 위한 Context를 만듭니다. 이 단계에서는 더미 값만 제공합니다.

### 1-1. src/app/context/StoreContext.jsx 생성

```jsx
import { createContext, useState, useContext, useMemo } from "react";

const StoreContext = createContext(undefined);

const defaultContext = {
  user: null,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  cart: [],
  cartCount: 0,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
};

export function StoreProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  const cartCount = cart.reduce((acc, item) => acc + (item.quantity || 0), 0);

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: !!user,
      login: (u) => setUser(u),
      logout: () => setUser(null),
      cart,
      cartCount,
      addToCart: (item) => setCart((prev) => [...prev, { ...item, id: `cart_${Date.now()}` }]),
      removeFromCart: (id) => setCart((prev) => prev.filter((i) => i.id !== id)),
      updateQuantity: (id, delta) => {
        setCart((prev) =>
          prev.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, (i.quantity || 1) + delta) } : i
          )
        );
      },
      clearCart: () => setCart([]),
    }),
    [user, cart, cartCount]
  );

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  return ctx ?? defaultContext;
}
```

---

## 2. ScrollToTop

### 2-1. src/app/components/layout/ScrollToTop.jsx 생성

```jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
```

---

## 3. Layout

### 3-1. src/app/components/layout/Layout.jsx 생성

```jsx
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-white">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
```

---

## 4. Header (최소 버전)

### 4-1. src/app/components/layout/Header.jsx 생성

```jsx
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useStore } from "../../context/StoreContext";

export function Header() {
  const { cartCount, isLoggedIn } = useStore();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-black">
          MALL
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-600 hover:text-black">홈</Link>
          <Link to="/products" className="text-gray-600 hover:text-black">상품</Link>
          <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full">
            <ShoppingCart className="h-5 w-5 text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          {isLoggedIn ? (
            <Link to="/mypage" className="text-gray-600 hover:text-black">마이페이지</Link>
          ) : (
            <Link to="/login" className="text-gray-600 hover:text-black">로그인</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
```

---

## 5. Footer (최소 버전)

### 5-1. src/app/components/layout/Footer.jsx 생성

```jsx
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 py-8 text-sm text-gray-500">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap gap-6 mb-4">
          <Link to="/" className="hover:text-black">홈</Link>
          <Link to="/products" className="hover:text-black">상품</Link>
          <Link to="/cart" className="hover:text-black">장바구니</Link>
        </div>
        <p className="text-xs text-gray-400">© 2024 MALL Corp.</p>
      </div>
    </footer>
  );
}
```

---

## 6. 플레이스홀더 페이지 생성

각 페이지는 나중에 구현하므로, 일단 제목만 표시합니다.

### 6-1. src/app/pages/HomePage.jsx

```jsx
export function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">홈</h1>
      <p className="text-gray-600 mt-2">홈 페이지 (05에서 구현)</p>
    </div>
  );
}
```

### 6-2. src/app/pages/ProductListPage.jsx

```jsx
export function ProductListPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">상품 목록</h1>
      <p className="text-gray-600 mt-2">상품 목록 페이지 (06에서 구현)</p>
    </div>
  );
}
```

### 6-3. src/app/pages/ProductDetailPage.jsx

```jsx
export function ProductDetailPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">상품 상세</h1>
      <p className="text-gray-600 mt-2">상품 상세 페이지 (07에서 구현)</p>
    </div>
  );
}
```

### 6-4. src/app/pages/CartPage.jsx

```jsx
export function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">장바구니</h1>
      <p className="text-gray-600 mt-2">장바구니 페이지 (08에서 구현)</p>
    </div>
  );
}
```

### 6-5. src/app/pages/CheckoutPage.jsx

```jsx
export function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">주문/결제</h1>
      <p className="text-gray-600 mt-2">주문/결제 페이지 (08에서 구현)</p>
    </div>
  );
}
```

### 6-6. src/app/pages/OrderCompletePage.jsx

```jsx
export function OrderCompletePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">주문 완료</h1>
      <p className="text-gray-600 mt-2">주문 완료 페이지 (08에서 구현)</p>
    </div>
  );
}
```

### 6-7. src/app/pages/LoginPage.jsx

```jsx
export function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">로그인</h1>
      <p className="text-gray-600 mt-2">로그인 페이지 (10에서 구현)</p>
    </div>
  );
}
```

### 6-8. src/app/pages/SignupPage.jsx

```jsx
export function SignupPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">회원가입</h1>
      <p className="text-gray-600 mt-2">회원가입 페이지 (10에서 구현)</p>
    </div>
  );
}
```

### 6-9. src/app/pages/MyPage.jsx

```jsx
export function MyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">마이페이지</h1>
      <p className="text-gray-600 mt-2">마이페이지 (10에서 구현)</p>
    </div>
  );
}
```

### 6-10. src/app/pages/OrderHistoryPage.jsx

```jsx
export function OrderHistoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">주문 내역</h1>
      <p className="text-gray-600 mt-2">주문 내역 페이지 (10에서 구현)</p>
    </div>
  );
}
```

### 6-11. src/app/pages/MagazinePage.jsx

```jsx
export function MagazinePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">매거진</h1>
      <p className="text-gray-600 mt-2">매거진 페이지 (05에서 구현)</p>
    </div>
  );
}
```

### 6-12. src/app/pages/ComingSoonPage.jsx

```jsx
import { Link } from "react-router-dom";

export function ComingSoonPage() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-bold mb-4">준비 중입니다</h1>
      <p className="text-gray-600 mb-8">해당 페이지는 아직 준비 중입니다.</p>
      <Link to="/" className="text-orange-500 hover:underline">홈으로 돌아가기</Link>
    </div>
  );
}
```

---

## 7. App.jsx 수정

### 7-1. src/app/App.jsx 전체 교체

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { ScrollToTop } from "./components/layout/ScrollToTop";
import { StoreProvider } from "./context/StoreContext";

import { HomePage } from "./pages/HomePage";
import { ProductListPage } from "./pages/ProductListPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { OrderCompletePage } from "./pages/OrderCompletePage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { MyPage } from "./pages/MyPage";
import { OrderHistoryPage } from "./pages/OrderHistoryPage";
import { MagazinePage } from "./pages/MagazinePage";
import { ComingSoonPage } from "./pages/ComingSoonPage";

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/product-detail" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-complete" element={<OrderCompletePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/my/orders" element={<OrderHistoryPage />} />
            <Route path="/magazine" element={<MagazinePage />} />
            <Route path="*" element={<ComingSoonPage />} />
          </Route>
        </Routes>
      </StoreProvider>
    </BrowserRouter>
  );
}
```

---

## 8. 확인

`pnpm dev` 실행 후:

1. **홈**(/) 접속 시 "홈" 페이지 표시
2. 상단 **MALL** 로고 클릭 시 홈으로 이동
3. **상품** 링크 클릭 시 상품 목록 페이지로 이동
4. **장바구니** 아이콘 클릭 시 장바구니 페이지로 이동
5. `/abcdef` 등 존재하지 않는 경로 접속 시 "준비 중입니다" 표시

---

## 9. 다음 단계

[03-design-system.md](./03-design-system.md)에서 테마, 컬러, Button·Input 컴포넌트를 추가합니다.

---

## 📖 강의 시 참고 – 핵심 개념

### React Context란?

- **개념**: 컴포넌트 트리 어디서든 값과 함수를 전달하는 React 내장 기능.
- **패턴**: `createContext` → `Provider`로 감싸기 → `useContext`로 소비.
- **강의 시**: "장바구니, 로그인 정보처럼 여러 페이지에서 공유하는 값은 Context에 넣습니다."

### useMemo와 Context value

```jsx
const value = useMemo(
  () => ({ user, cart, addToCart, ... }),
  [user, cart, cartCount]
);
```

- **이유**: value를 매 렌더마다 새 객체로 만들면, Consumer가 매번 리렌더됨.
- **useMemo**: user, cart 등이 바뀔 때만 새 value 생성 → 불필요한 리렌더 감소.

### Outlet (Nested Routes)

- **역할**: 부모 Route의 `element`가 `<Layout />`일 때, 자식 Route 내용이 `Outlet` 자리에 렌더됨.
- **구조**: `Route element={<Layout />}` 안에 `<Route path="/" element={<HomePage />} />` 등.

### ScrollToTop과 useEffect

```jsx
useEffect(() => {
  window.scrollTo(0, 0);
}, [pathname]);
```

- **의미**: `pathname`이 바뀔 때(페이지 전환 시) 스크롤을 맨 위로 이동.
- **이유**: SPA에서는 새로고침이 없어서, 이전 페이지 스크롤 위치가 유지됨. 사용자 경험을 위해 초기화 필요.

### ⚠️ 주의사항

- **defaultContext**: `useStore()`가 Provider 밖에서 호출되면 undefined. `?? defaultContext`로 폴백 처리.
