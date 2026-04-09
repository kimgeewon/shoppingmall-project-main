/**
 * ScrollToTop - 라우트가 바뀔 때마다 페이지 최상단으로 스크롤
 *
 * 사용처: App.jsx
 *
 * 예: 장바구니 페이지 하단에 있다가 "상품" 클릭 → 상품 목록 페이지 상단부터 보임
 */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation(); // 현재 URL 경로 (예: /products, /cart)
  useEffect(() => {
    window.scrollTo(0, 0); // pathname이 바뀔 때마다 스크롤 맨 위로
  }, [pathname]);
  return null; // 화면에 아무것도 렌더링하지 않음
}
