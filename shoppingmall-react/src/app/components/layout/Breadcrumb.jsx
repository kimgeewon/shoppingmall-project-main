/**
 * Breadcrumb - 경로 표시 (홈 > 상품 > 전자제품 > 상품명)
 *
 * 사용처: ProductDetailPage, CartPage, LoginPage, ProductListPage, ComingSoonPage,
 *        MagazinePage, SignupPage, OrderCompletePage, CheckoutPage, OrderHistoryPage, MyPage
 *
 * items 예시:
 *   [{ to: "/", label: "홈" }, { to: "/products", label: "상품" }, { label: "현재 페이지" }]
 * - to가 있으면 Link(클릭 시 이동), 마지막 항목은 to 없이 현재 페이지 표시
 */
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export function Breadcrumb({ items }) {
  if (!items?.length) return null;

  return (
    <nav className="breadcrumb-nav mb-6" aria-label="Breadcrumb">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <span key={idx} className="contents">
            {idx > 0 && <ChevronRight className="w-4 h-4 shrink-0" />} {/* 항목 사이 > 표시 */}
            {item.to && !isLast ? (
              <Link to={item.to} className="hover:text-black">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-black font-medium" : ""}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
