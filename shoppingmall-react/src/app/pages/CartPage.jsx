/**
 * CartPage - 장바구니 페이지
 *
 * 사용처: App.jsx (path="/cart") | Header 장바구니 아이콘, CartModal "장바구니 이동" 클릭 시
 *
 * useStore(): cart, updateQuantity, removeFromCart, clearCart, isLoggedIn
 * 비로그인: 상단 배너 + 주문하기 시 /login?redirect=/checkout
 * confirmModal: 삭제/전체비우기 확인용 AlertModal
 */
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, LogIn } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { useStore } from "../context/StoreContext";
import { MessageModal } from "../components/modal/MessageModal";
import { AlertModal } from "../components/modal/AlertModal";

export const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart, isLoggedIn } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  /** 삭제/전체비우기 확인용 AlertModal 상태 */
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "remove",
    targetId: null,
  });

  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    title: "",
  });

  /** 데모용 스켈레톤 표시 (실제 데이터는 StoreContext에서 즉시 사용 가능) */
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = (id) => {
    setConfirmModal({
      isOpen: true,
      title: "상품 삭제",
      message: "정말 삭제하시겠습니까?",
      type: "remove",
      targetId: id,
    });
  };

  const handleClear = () => {
    setConfirmModal({
      isOpen: true,
      title: "장바구니 비우기",
      message: "장바구니를 비우시겠습니까?",
      type: "clear",
      targetId: null,
    });
  };

  const handleConfirmDelete = () => {
    if (confirmModal.type === "remove" && confirmModal.targetId) {
      removeFromCart(confirmModal.targetId);
      setSuccessModal({ isOpen: true, title: "상품이 삭제되었습니다" });
    } else if (confirmModal.type === "clear") {
      clearCart();
      setSuccessModal({ isOpen: true, title: "장바구니가 비워졌습니다" });
    }
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleCloseConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleCloseSuccessModal = () => {
    setSuccessModal((prev) => ({ ...prev, isOpen: false }));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = subtotal >= 50000 ? 0 : 3000;
  const total = subtotal + shippingFee;

  if (isLoading) {
    return (
      <div className="page-container">
        <Breadcrumb items={[{ to: "/", label: "홈" }, { label: "장바구니" }]} />
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="flex-1 space-y-6">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-16" />
            </div>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex gap-4 md:gap-6 py-6 border-b border-gray-100 last:border-0"
              >
                <Skeleton className="h-24 w-24 md:h-32 md:w-32 rounded-md" />
                <div className="flex-1 flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                  <div className="flex gap-4 items-center">
                    <Skeleton className="h-8 w-24 rounded-md" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:w-80 shrink-0">
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <>
        <div className="page-container">
          <Breadcrumb items={[{ to: "/", label: "홈" }, { label: "장바구니" }]} />
          <div className="page-centered flex flex-col text-center">
          <div className="mb-6 h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
            <Trash2 className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">장바구니가 비어있습니다</h2>
          <p className="text-gray-500 mb-8">원하는 상품을 장바구니에 담아보세요.</p>
          <Button size="lg" onClick={() => navigate("/products")}>
            쇼핑하러 가기
          </Button>
          </div>
        </div>

        <MessageModal
          isOpen={successModal.isOpen}
          onClose={handleCloseSuccessModal}
          title={successModal.title}
          icon="success"
        />
      </>
    );
  }

  const handleCheckout = () => {
    if (!isLoggedIn) {
      navigate("/login?redirect=/checkout");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="page-container">
      <Breadcrumb items={[{ to: "/", label: "홈" }, { label: "장바구니" }]} />
      <h1 className="page-title mb-8">장바구니</h1>

      {!isLoggedIn && (
        <div className="mb-8 p-5 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <LogIn className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="font-medium text-amber-900">주문을 진행하려면 로그인이 필요합니다</p>
              <p className="text-sm text-amber-700 mt-0.5">로그인 후 장바구니 상품을 결제할 수 있습니다.</p>
            </div>
          </div>
          <div className="flex gap-3 shrink-0">
            <Button variant="outline" size="sm" onClick={() => navigate("/signup")}>
              회원가입
            </Button>
            <Button size="sm" onClick={() => navigate("/login?redirect=/checkout")}>
              로그인
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Cart List */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
            <span className="text-sm text-gray-600">전체 {cart.length}개</span>
            <button
              onClick={handleClear}
              className="text-sm text-text-muted hover:text-destructive underline"
            >
              전체 삭제
            </button>
          </div>

          <ul className="divide-y divide-gray-100">
            {cart.map((item) => (
              <li key={item.id} className="py-6 flex gap-4 md:gap-6">
                <Link to={`/product-detail?id=${item.productId}`} className="shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-24 md:h-32 md:w-32 object-cover rounded-md border border-gray-100"
                  />
                </Link>

                <div className="flex-1 flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <Link
                      to={`/product-detail?id=${item.productId}`}
                      className="font-medium text-gray-900 hover:text-black line-clamp-2 mb-1"
                    >
                      {item.name}
                    </Link>
                    {item.option && (
                      <p className="text-sm text-gray-500 mb-2">옵션: {item.option}</p>
                    )}
                    <p className="font-bold text-lg md:hidden">
                      {(item.price * item.quantity).toLocaleString()}원
                    </p>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 md:w-auto">
                    <div className="flex items-center border border-gray-300 rounded-md h-8">
                      <button
                        className="px-2 hover:bg-gray-50 h-full flex items-center"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        className="px-2 hover:bg-gray-50 h-full flex items-center"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="hidden md:block font-bold text-lg w-24 text-right">
                      {(item.price * item.quantity).toLocaleString()}원
                    </div>

                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-text-subtle hover:text-destructive p-1"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Order Summary */}
        <div className="lg:w-80 shrink-0">
          <div className="card-summary">
            <h3 className="font-bold text-lg mb-6">주문 예정 금액</h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>상품 합계</span>
                <span>{subtotal.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>배송비</span>
                <span>{shippingFee === 0 ? "0원" : `+${shippingFee.toLocaleString()}원`}</span>
              </div>
              {shippingFee > 0 && (
                <p className="text-xs text-secondary text-right">
                  {(50000 - subtotal).toLocaleString()}원 더 담으면 무료배송!
                </p>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-bold">총 주문 금액</span>
                <span className="text-2xl font-bold text-secondary">
                  {total.toLocaleString()}원
                </span>
              </div>
            </div>

            <Button fullWidth size="lg" onClick={handleCheckout}>
              {isLoggedIn ? "주문하기" : "로그인 후 주문하기"}
            </Button>

            <div className="mt-4 text-center">
              <Link
                to="/products"
                className="text-sm text-gray-500 hover:underline inline-flex items-center"
              >
                쇼핑 계속하기 <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <AlertModal
        isOpen={confirmModal.isOpen}
        onClose={handleCloseConfirmModal}
        title={confirmModal.title}
        message={confirmModal.message}
        variant="warning"
        cancelText="취소"
        confirmText={confirmModal.type === "clear" ? "전체 삭제" : "삭제"}
        onConfirm={handleConfirmDelete}
      />

      <MessageModal
        isOpen={successModal.isOpen}
        onClose={handleCloseSuccessModal}
        title={successModal.title}
        icon="success"
      />
    </div>
  );
};
