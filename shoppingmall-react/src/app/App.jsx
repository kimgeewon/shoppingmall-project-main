/**
 * App.jsx - 라우팅 설정
 *
 * 사용처: main.jsx
 *
 * 구조:
 *   BrowserRouter: URL에 따라 어떤 컴포넌트를 보여줄지 관리
 *   └─ StoreProvider: 로그인/장바구니 상태를 전체 앱에서 공유
 *      └─ Layout: Header + 본문(Outlet) + Footer
 *         └─ 각 Route: path에 맞는 페이지 컴포넌트가 Outlet 자리에 렌더링됨
 *
 * path="*": 위의 어떤 경로에도 매칭되지 않으면 ComingSoonPage(404) 표시
 */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { ScrollToTop } from "./components/layout/ScrollToTop";
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
import { StoreProvider } from "./context/StoreContext";

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {/* StoreProvider는 Router 내부에 있어야 useLocation으로 라우트 변경 시 user 동기화 가능 */}
      <StoreProvider>
        {/* 라우트가 바뀔 때마다 페이지 상단으로 스크롤 */}
        <ScrollToTop />
        <Routes>
          {/* Layout 안에 모든 페이지가 Outlet 위치에 렌더링됨 */}
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
            <Route path="*" element={<ComingSoonPage />} /> {/* 매칭 안 되는 모든 경로 */}
          </Route>
        </Routes>
      </StoreProvider>
    </BrowserRouter>
  );
}
