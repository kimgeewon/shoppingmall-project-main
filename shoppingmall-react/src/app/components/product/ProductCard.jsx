/**
 * ProductCard - 상품 카드 (이미지, 이름, 가격, 할인율, 리뷰, 배지, 장바구니 버튼)
 *
 * 사용처: HomePage, ProductListPage, ProductDetailPage(관련 상품)
 *
 * product: { id, name, price, originalPrice, image, badges, isSoldOut, rating, reviewCount }
 * - 카드 클릭 → 상품 상세 페이지
 * - 장바구니 버튼 클릭 → addToCart 호출, CartModal 표시
 */
import { useState } from "react";
import { Star, ShoppingCart } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import { CartModal } from "../modal/CartModal";
import { ImageWithFallback } from "../ui/ImageWithFallback";

export const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const { addToCart } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  /** 카드 전체 클릭 시 상품 상세 페이지로 이동 */
  const handleCardClick = () => {
    navigate(`/product-detail?id=${product.id}`);
  };

  /** 장바구니 버튼 클릭 - stopPropagation으로 카드 클릭 이벤트와 분리 (상세 이동 안 함) */
  const handleAddToCart = (e) => {
    e.stopPropagation();

    addToCart({
      id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      option: "기본",
    });

    setIsModalOpen(true);

    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  /** 할인율 계산: (정가 - 할인가) / 정가 * 100 */
  const discountRate = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <>
      <div
        className="group/card relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-lg cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Image Area */}
        <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className={cn(
              "h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-105",
              product.isSoldOut && "opacity-60"
            )}
          />
          {product.isSoldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Badge variant="soldout" className="text-lg px-4 py-2">
                품절
              </Badge>
            </div>
          )}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {product.badges?.map((badge) => (
              <Badge
                key={badge}
                variant={
                  badge === "SALE"
                    ? "sale"
                    : badge === "HOT"
                      ? "hot"
                      : badge === "NEW"
                        ? "new"
                        : "default"
                }
              >
                {badge}
              </Badge>
            ))}
          </div>

          {/* Hover Button */}
          {!product.isSoldOut && (
            <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 transition-opacity group-hover/card:opacity-100 hidden md:block">
              <Button variant="primary" fullWidth onClick={handleAddToCart} className="shadow-lg">
                <ShoppingCart className="mr-2 h-4 w-4" />
                장바구니 담기
              </Button>
            </div>
          )}
        </div>

        {/* Info Area */}
        <div className="flex flex-1 flex-col p-4">
          <h3 className="line-clamp-2 text-base font-medium text-primary group-hover/card:text-primary transition-colors">
            {product.name}
          </h3>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">
              {product.price.toLocaleString()}원
            </span>
            {product.originalPrice && (
              <>
                <span className="text-sm text-gray-400 line-through">
                  {product.originalPrice.toLocaleString()}원
                </span>
                <span className="text-sm font-bold text-secondary">{discountRate}%</span>
              </>
            )}
          </div>

          <div className="mt-auto flex items-center gap-1 pt-3 text-sm text-text-subtle">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-primary">{product.rating}</span>
            <span>({product.reviewCount})</span>
          </div>
        </div>
      </div>

      <CartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={product.name}
        productImage={product.image}
        productPrice={product.price}
      />
    </>
  );
};
