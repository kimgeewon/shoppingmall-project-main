/**
 * AlertModal - 확인/취소 버튼이 있는 확인 모달
 *
 * 사용처: CartPage (상품 삭제, 장바구니 비우기 확인)
 *
 * props: isOpen, onClose, title, message, onConfirm, confirmText, cancelText
 * variant: success | error | warning | info (아이콘 종류)
 */
import { useEffect } from "react";
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { Button } from "../ui/Button";

export const AlertModal = ({
  isOpen,
  onClose,
  title,
  message,
  variant = "success",
  onConfirm,
  confirmText = "확인",
  cancelText,
}) => {
  // 모달 열릴 때 body 스크롤 방지
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
    switch (variant) {
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "error":
        return <AlertCircle className="h-6 w-6 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-amber-500" />;
      case "info":
        return <Info className="h-6 w-6 text-blue-500" />;
      default:
        return <Info className="h-6 w-6 text-blue-500" />;
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
            {getIcon()}
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500 mb-6">{message}</p>

          <div className="flex gap-2 justify-center">
            {cancelText && (
              <Button variant="outline" onClick={onClose} fullWidth>
                {cancelText}
              </Button>
            )}
            <Button variant="primary" onClick={handleConfirm} fullWidth>
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
