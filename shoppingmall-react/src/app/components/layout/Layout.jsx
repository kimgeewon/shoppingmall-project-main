/**
 * Layout - 공통 레이아웃 (Header + 본문 + Footer)
 *
 * 사용처: App.jsx (Route element={<Layout />})
 *
 * Outlet: App.jsx의 Route path에 맞는 자식 페이지가 여기 렌더링됨
 * 예: path="/" → HomePage가 <Outlet /> 위치에 표시
 */
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col font-sans text-primary">
      <Header /> {/* 상단: 로고, 검색, 장바구니, 로그인 */}
      <main className="flex-1 bg-white">
        <Outlet /> {/* 현재 경로에 해당하는 페이지(HomePage, CartPage 등) */}
      </main>
      <Footer /> {/* 하단: 링크, 저작권 */}
    </div>
  );
};
