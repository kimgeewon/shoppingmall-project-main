/**
 * CheckoutPage - 주문/결제 페이지
 *
 * 사용처: App.jsx (path="/checkout") | CartPage "주문하기" 클릭 시 진입
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Skeleton } from "../components/ui/Skeleton";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { MessageModal } from "../components/modal/MessageModal";
import { useStore } from "../context/StoreContext";
import { createOrder } from "@/lib/api";

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, isLoggedIn, isHydrated } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    description: undefined,
    type: "info",
    action: undefined,
  });

  const subtotal = cart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);
  const shippingFee = subtotal >= 50000 ? 0 : 3000; // 5만원 이상 무료배송
  const total = subtotal + shippingFee;

  // 로그인·장바구니 체크 후 페이지 진입 허용 (보호 페이지)
  useEffect(() => {
    if (!isHydrated) return;
    if (!isLoggedIn) {
      navigate("/login?redirect=/checkout");
      return;
    }
    if (cart.length === 0) {
      navigate("/cart");
      return;
    }
    setIsLoading(false);
  }, [isHydrated, isLoggedIn, cart.length, navigate]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      paymentMethod: "card",
      cardInstallment: "0",
    },
  });

  const paymentMethod = watch("paymentMethod");

  if (isLoading || !isHydrated || cart.length === 0) {
    return (
      <div className="page-container">
        <Breadcrumb items={[{ to: "/", label: "홈" }, { to: "/cart", label: "장바구니" }, { label: "주문/결제" }]} />
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="flex-1 space-y-10">
            <div className="space-y-4">
              <Skeleton className="h-6 w-24" />
              <div className="space-y-4">
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-24 w-full rounded-lg" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-24" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="lg:w-80 shrink-0">
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const onSubmit = async (data) => {
    const result = await createOrder({
      total,
      shippingInfo: {
        name: data.name,
        phone: data.phone,
        address: `${data.address} ${data.detailAddress || ""}`.trim(),
        memo: data.memo,
      },
      paymentMethod: data.paymentMethod,
    });

    if (result.success) {
      setModalState({
        isOpen: true,
        title: "주문이 완료되었습니다!",
        type: "success",
        action: () =>
          navigate("/order-complete", {
            state: {
              orderId: result.order.id,
              total: result.order.total,
              address: result.order.shippingInfo?.address,
            },
          }),
      });
    } else {
      setModalState({
        isOpen: true,
        title: "주문 실패",
        description: result.error || "주문 처리 중 오류가 발생했습니다.",
        type: "info",
      });
    }
  };

  const handleAddressSearch = () => {
    setModalState({
      isOpen: true,
      title: "준비 중입니다",
      description: "주소 검색 기능은 아직 구현되지 않았습니다.",
      type: "info",
    });
  };

  /** 모달 닫을 때 action이 있으면(주문완료 등) 해당 콜백 실행 후 페이지 이동 */
  const handleCloseModal = () => {
    const action = modalState.action;
    setModalState((prev) => ({ ...prev, isOpen: false, action: undefined }));
    if (action) action();
  };

  return (
    <div className="page-container">
      <Breadcrumb items={[{ to: "/", label: "홈" }, { to: "/cart", label: "장바구니" }, { label: "주문/결제" }]} />
      <h1 className="page-title mb-8">주문/결제</h1>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left: Form */}
        <div className="flex-1 space-y-10">
          {/* 1. Order Items (Read Only) */}
          <section>
            <h2 className="text-lg font-bold mb-4 border-b border-gray-200 pb-2">주문 상품</h2>
            <div className="rounded-lg border border-gray-200 p-4 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="h-16 w-16 bg-gray-100 rounded overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      옵션: {item.option || "기본"} / {item.quantity}개
                    </p>
                    <p className="font-bold text-sm mt-1">
                      {((item.price || 0) * (item.quantity || 1)).toLocaleString()}원
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {/* 2. Shipping Info */}
            <section>
              <h2 className="text-lg font-bold mb-4 border-b border-gray-200 pb-2">배송 정보</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">받는 분 *</label>
                    <Input
                      {...register("name", { required: "이름을 입력해주세요" })}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      placeholder="이름"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">연락처 *</label>
                    <Input
                      {...register("phone", {
                        required: "연락처를 입력해주세요",
                        pattern: { value: /^[0-9-]+$/, message: "숫자만 입력해주세요" },
                      })}
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      placeholder="010-0000-0000"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">주소 *</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      readOnly
                      placeholder="우편번호"
                      className="max-w-[120px]"
                      value="12345"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddressSearch}
                      className="text-[14px] whitespace-nowrap p-[8px]"
                    >
                      주소 검색
                    </Button>
                  </div>
                  <Input
                    {...register("address", { required: "주소를 입력해주세요" })}
                    error={!!errors.address}
                    placeholder="기본 주소"
                    className="mb-2"
                  />
                  <Input
                    {...register("detailAddress", { required: "상세 주소를 입력해주세요" })}
                    error={!!errors.detailAddress}
                    helperText={errors.detailAddress?.message}
                    placeholder="상세 주소를 입력해주세요"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">배송 메모</label>
                  <Input {...register("memo")} placeholder="예: 문 앞에 놓아주세요" />
                </div>
              </div>
            </section>

            {/* 3. Payment Method */}
            <section>
              <h2 className="text-lg font-bold mb-4 border-b border-gray-200 pb-2">결제 방법</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-3">
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      value="card"
                      className="peer sr-only"
                      {...register("paymentMethod")}
                    />
                    <div className="flex items-center justify-center p-4 border border-gray-300 rounded-lg peer-checked:border-black peer-checked:bg-gray-100 peer-checked:text-black transition-all hover:bg-gray-50">
                      신용카드
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      value="bank"
                      className="peer sr-only"
                      {...register("paymentMethod")}
                    />
                    <div className="flex items-center justify-center p-4 border border-gray-300 rounded-lg peer-checked:border-black peer-checked:bg-gray-100 peer-checked:text-black transition-all hover:bg-gray-50">
                      무통장 입금
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      value="transfer"
                      className="peer sr-only"
                      {...register("paymentMethod")}
                    />
                    <div className="flex items-center justify-center p-4 border border-gray-300 rounded-lg peer-checked:border-black peer-checked:bg-gray-100 peer-checked:text-black transition-all hover:bg-gray-50">
                      계좌이체
                    </div>
                  </label>
                </div>

                {paymentMethod === "card" && (
                  <div className="p-5 bg-gray-50 rounded-lg border border-gray-200 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">카드사 선택</label>
                        <select
                          className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
                          {...register("cardCompany")}
                        >
                          <option value="">카드사를 선택해주세요</option>
                          <option value="shinhan">신한카드</option>
                          <option value="hyundai">현대카드</option>
                          <option value="samsung">삼성카드</option>
                          <option value="kb">KB국민카드</option>
                          <option value="lotte">롯데카드</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">할부 기간</label>
                        <select
                          className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
                          {...register("cardInstallment")}
                        >
                          <option value="0">일시불</option>
                          <option value="2">2개월</option>
                          <option value="3">3개월</option>
                          <option value="4">4개월</option>
                          <option value="5">5개월</option>
                          <option value="6">6개월</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "bank" && (
                  <div className="p-5 bg-gray-50 rounded-lg border border-gray-200 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">입금 계좌</label>
                      <select
                        className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
                        {...register("depositBank")}
                      >
                        <option value="">입금하실 계좌를 선택해주세요</option>
                        <option value="woori">우리은행 1002-000-000000 (주)피그마</option>
                        <option value="shinhan">신한은행 110-000-000000 (주)피그마</option>
                        <option value="kb">국민은행 123-0000-0000 (주)피그마</option>
                      </select>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                      * 주문 접수 후 24시간 이내에 입금 확인이 되지 않으면 주문이 자동으로
                      취소됩니다.
                    </div>
                  </div>
                )}

                {paymentMethod === "transfer" && (
                  <div className="p-5 bg-gray-50 rounded-lg border border-gray-200 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">이체하실 은행</label>
                      <select
                        className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
                        {...register("transferBank")}
                      >
                        <option value="">은행을 선택해주세요</option>
                        <option value="kakao">카카오뱅크</option>
                        <option value="toss">토스뱅크</option>
                        <option value="kb">KB국민은행</option>
                        <option value="shinhan">신한은행</option>
                        <option value="woori">우리은행</option>
                        <option value="nh">NH농협</option>
                      </select>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                      * 실시간 계좌이체는 결제 대행사 모듈을 통해 진행됩니다. (현재는 프로토타입
                      동작만 지원)
                    </div>
                  </div>
                )}
              </div>
            </section>
          </form>
        </div>

        {/* Right: Summary Sticky */}
        <div className="lg:w-80 shrink-0">
          <div className="card-summary">
            <h3 className="font-bold text-lg mb-6">최종 결제 금액</h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>상품 합계</span>
                <span>{subtotal.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>배송비</span>
                <span>{shippingFee === 0 ? "0원" : `${shippingFee.toLocaleString()}원`}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>할인</span>
                <span>-0원</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">총 결제 금액</span>
                <span className="text-2xl font-bold text-secondary">
                  {total.toLocaleString()}원
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2 text-xs text-gray-500 mb-4">
                <input type="checkbox" id="terms" className="mt-0.5" required />
                <label htmlFor="terms">주문 내용을 확인하였으며, 정보 제공 등에 동의합니다.</label>
              </div>

              <Button
                fullWidth
                size="lg"
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
              >
                {isSubmitting ? "결제 중..." : "결제하기"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <MessageModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        title={modalState.title}
        description={modalState.description}
        icon={modalState.type === "success" ? "success" : "info"}
      />
    </div>
  );
};
