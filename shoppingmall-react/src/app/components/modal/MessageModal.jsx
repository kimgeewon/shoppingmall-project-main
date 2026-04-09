/**
 * MessageModal - 단순 알림 모달 (확인 버튼만)
 *
 * 사용처: Header(로그아웃 완료), CartPage(삭제 완료), LoginPage(로그인 성공),
 *        SignupPage(가입 성공), CheckoutPage(주문 완료 안내)
 * icon: success | error | info
 */
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { Button } from "../ui/Button";

export const MessageModal = ({
  isOpen,
  onClose,
  title,
  description,
  icon = "info",
  actionLabel = "확인",
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (icon) {
      case "success":
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case "error":
        return <AlertCircle className="h-8 w-8 text-destructive" />;
      default:
        return <Info className="h-8 w-8 text-black" />;
    }
  };

  return createPortal( // document.body에 렌더링 (z-index 오버레이용)
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 p-6 text-center z-10">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center justify-center gap-4 py-4">
          <div className="rounded-full bg-gray-50 p-3">{getIcon()}</div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            {description && <p className="text-gray-500">{description}</p>}
          </div>
        </div>

        <div className="mt-4">
          <Button fullWidth onClick={onClose} size="lg">
            {actionLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
