/**
 * CartModal - 장바구니 담기 완료 알림
 *
 * 사용처: ProductCard, ProductDetailPage
 *
 * ProductCard에서 "장바구니 담기" 클릭 후 표시
 * createPortal: 모달을 #root가 아닌 document.body에 렌더링 (z-index로 다른 요소 위에 표시)
 */
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowRight, X } from "lucide-react";
import { Button } from "../ui/Button";
import { ImageWithFallback } from "../ui/ImageWithFallback";

export const CartModal = ({ isOpen, onClose, productName, productImage, productPrice }) => {
  const navigate = useNavigate();

  /** 모달 열리면 스크롤 방지 (뒤 페이지가 움직이지 않도록) */
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

  const handleGoToCart = () => {
    onClose();
    navigate("/cart");
  };

  return createPortal( // document.body에 렌더링
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 z-10">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div className="bg-green-100 text-green-600 p-1.5 rounded-full">
                <ShoppingCart className="h-4 w-4" />
              </div>
              장바구니에 상품을 담았습니다
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex gap-4 py-4 border-t border-b border-gray-100 my-4">
            <div className="h-20 w-20 shrink-0 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
              <ImageWithFallback src={productImage} alt={productName} className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col justify-center">
              <p className="font-medium text-gray-900 line-clamp-2 mb-1">{productName}</p>
              <p className="text-sm font-bold text-gray-900">{productPrice.toLocaleString()}원</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <Button variant="outline" onClick={onClose} size="lg">
              쇼핑 계속하기
            </Button>
            <Button variant="primary" onClick={handleGoToCart} size="lg">
              장바구니 이동 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
