/**
 * OrderCompletePage - 주문 완료 페이지
 *
 * 사용처: App.jsx (path="/order-complete") | CheckoutPage 주문 성공 후 navigate로 진입
 */
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, ShoppingBag, FileText } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Breadcrumb } from "../components/layout/Breadcrumb";

export const OrderCompletePage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const orderId = state?.orderId || "-";
  const total = state?.total ?? 0;
  const address = state?.address || "-";

  return (
    <div className="page-container">
      <Breadcrumb items={[{ to: "/", label: "홈" }, { to: "/cart", label: "장바구니" }, { label: "주문완료" }]} />
      <div className="order-complete-layout">
      <div className="mb-8 text-black animate-in zoom-in duration-300">
        <CheckCircle className="h-24 w-24" />
      </div>

      <h1 className="page-title mb-4">주문이 완료되었습니다!</h1>
      <p className="text-body mb-8">
        주문해주셔서 감사합니다.
        <br />
        상품 배송은 2-3일 내로 시작될 예정입니다.
      </p>

      <div className="order-summary-box">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-500 text-sm">주문번호</span>
          <span className="font-mono font-medium">{orderId}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-500 text-sm">결제금액</span>
          <span className="font-bold text-lg">{total.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm">배송지</span>
          <span className="text-sm truncate max-w-[200px]">{address}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Button variant="outline" fullWidth onClick={() => navigate("/mypage")}>
          <FileText className="mr-2 h-4 w-4" /> 주문 내역 보기
        </Button>
        <Button variant="primary" fullWidth onClick={() => navigate("/products")}>
          <ShoppingBag className="mr-2 h-4 w-4" /> 쇼핑 계속하기
        </Button>
      </div>
      </div>
    </div>
  );
};
