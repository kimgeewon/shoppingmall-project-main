/**
 * ProductDetailPage - 상품 상세 페이지
 *
 * 사용처: App.jsx (path="/product-detail") | ProductCard 클릭 시 진입
 *
 * URL: /product-detail?id=1 또는 /product-detail/1 (paramId)
 * getProductById(id): 상품 정보, getProducts(): 관련 상품용
 * performAddToCart: 장바구니 담기 / 바로 구매 공통 로직
 */
import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Star, Minus, Plus, Heart, Share2, Truck, ShieldCheck } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { getProductById, getProducts } from "@/lib/api";
import { ProductCard } from "../components/product/ProductCard";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { useStore } from "../context/StoreContext";
import { CartModal } from "../components/modal/CartModal";
import { ImageWithFallback } from "../components/ui/ImageWithFallback";

export const ProductDetailPage = () => {
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useStore();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("detail");

  /** URL 파라미터(/product-detail/:id) 또는 쿼리(?id=...)에서 상품 ID */
  const productId = paramId || searchParams.get("id");

  useEffect(() => {
    if (!productId) {
      setIsLoading(false);
      return;
    }
    let cancelled = false; // 언마운트 시 setState 방지 (메모리 누수/경고 방지)
    async function load() {
      setIsLoading(true);
      const [found, allProducts] = await Promise.all([
        getProductById(productId),
        getProducts(),
      ]);
      if (!cancelled) {
        if (found) {
          setProduct(found);
          setSelectedImage(found.image);
        }
        const related = (allProducts || [])
          .filter((p) => p.id !== productId)
          .slice(0, 4);
        setRelatedProducts(related);
      }
      setIsLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [productId]);

  if (isLoading) {
    return (
      <div className="page-container max-w-6xl mx-auto">
        <Breadcrumb items={[{ to: "/", label: "홈" }, { to: "/products", label: "상품" }, { label: "..." }]} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-md" />
            ))}
          </div>
        </div>
        <div className="space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/4" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-14 flex-1 rounded-lg" />
            <Skeleton className="h-14 flex-1 rounded-lg" />
          </div>
        </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-container max-w-6xl mx-auto">
        <Breadcrumb items={[{ to: "/", label: "홈" }, { label: "상품" }]} />
        <div className="text-center py-20">
        <p className="text-lg text-text-muted">상품을 찾을 수 없습니다.</p>
        <Button className="mt-4" onClick={() => navigate("/products")}>
          상품 목록 보기
        </Button>
        </div>
      </div>
    );
  }

  /** 장바구니 담기 공통 로직 (장바구니/바로구매 공유) */
  const performAddToCart = () => {
    addToCart({
      id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
      option: "기본",
    });
  };

  const handleAddToCart = () => {
    performAddToCart();
    setIsModalOpen(true);
  };

  const handleBuyNow = () => {
    performAddToCart();
    navigate("/cart");
  };

  const discountRate = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Mock Gallery Images (Just duplicating main image)
  const galleryImages = [product.image, product.image, product.image, product.image];

  const categoryNames = {
    electronics: "전자제품",
    clothing: "의류",
    food: "식품",
    other: "기타",
  };
  const categoryName = product.category ? categoryNames[product.category] || product.category : null;
  const productsListUrl = categoryName ? `/products?category=${product.category}` : "/products";
  const breadcrumbItems = categoryName
    ? [
        { to: "/", label: "홈" },
        { to: "/products", label: "상품" },
        { to: productsListUrl, label: categoryName },
        { label: product.name },
      ]
    : [
        { to: "/", label: "홈" },
        { to: "/products", label: "상품" },
        { label: product.name },
      ];

  return (
    <div className="page-container max-w-6xl mx-auto">
      <Breadcrumb items={breadcrumbItems} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 mb-12 items-start">
        {/* Left: Gallery - 메인/썸네일 모두 16:9 비율 통일 */}
        <div className="flex flex-col w-full">
          <div className="aspect-video w-full rounded-lg bg-gray-100 overflow-hidden relative group">
            <ImageWithFallback
              src={selectedImage}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-zoom-in rounded-lg"
            />
            {product.isSoldOut && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-3xl font-bold border-4 border-white px-6 py-3">
                  품절
                </span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2 shrink-0 mt-3">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                className={cn(
                  "relative aspect-video rounded-md overflow-hidden bg-gray-50 focus:outline-none transition-opacity",
                  selectedImage === img ? "opacity-100" : "opacity-80 hover:opacity-90"
                )}
                onClick={() => setSelectedImage(img)}
              >
                <ImageWithFallback
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center text-[#FF9900]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-5 w-5 fill-current",
                    i >= Math.floor(product.rating) && "text-gray-300 fill-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 underline cursor-pointer">
              {product.rating} ({product.reviewCount}개 리뷰)
            </span>
          </div>

          <div className="flex items-end gap-3 mb-8 pb-8 border-b border-gray-100">
            {product.originalPrice && (
              <>
                <span className="text-2xl font-bold text-[#FF3333]">{discountRate}%</span>
                <span className="text-lg text-gray-400 line-through decoration-gray-400">
                  {product.originalPrice.toLocaleString()}원
                </span>
              </>
            )}
            <span className="text-4xl font-bold text-gray-900">
              {product.price.toLocaleString()}원
            </span>
          </div>

          <div className="space-y-6 flex-1">
            {/* Delivery Info */}
            <div className="flex gap-4 text-sm">
              <span className="font-bold w-20 shrink-0 text-gray-900">배송 정보</span>
              <div className="space-y-1 text-gray-600">
                <p className="flex items-center gap-1">
                  <Truck className="h-4 w-4" /> 무료배송 (50,000원 이상 구매 시)
                </p>
                <p className="text-xs text-gray-400">도서산간 지역 추가비용 발생 가능</p>
              </div>
            </div>

            {/* Quantity */}
            {!product.isSoldOut && (
              <div className="flex gap-4 items-center">
                <span className="font-bold w-20 shrink-0 text-gray-900">수량</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    className="p-2 hover:bg-gray-50 disabled:opacity-50"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    className="p-2 hover:bg-gray-50"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 flex gap-3">
            {product.isSoldOut ? (
              <Button fullWidth disabled size="lg" className="bg-gray-300 text-gray-500">
                품절된 상품입니다
              </Button>
            ) : (
              <>
                <Button fullWidth variant="outline" size="lg" onClick={handleAddToCart}>
                  장바구니 담기
                </Button>
                <Button fullWidth variant="primary" size="lg" onClick={handleBuyNow}>
                  바로 구매하기
                </Button>
              </>
            )}
            <Button variant="outline" size="icon" className="shrink-0 h-14 w-14">
              <Heart className="h-6 w-6" />
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span>100% 정품 보장</span>
            </div>
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              <span>친구에게 공유하기</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details & Reviews Tabs - 컨테이너와 맞춰 시선 흐름 정렬 */}
      <div className="mt-12 mb-16">
        <div className="flex border-b border-gray-200 sticky top-24 bg-white z-20 -mx-4 px-4 md:mx-0 md:px-0">
          <button
            className={`flex-1 py-4 text-center font-bold text-lg border-b-2 transition-colors ${activeTab === "detail" ? "border-black text-black" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab("detail")}
          >
            상세정보
          </button>
          <button
            className={`flex-1 py-4 text-center font-bold text-lg border-b-2 transition-colors ${activeTab === "review" ? "border-black text-black" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab("review")}
          >
            리뷰 ({product.reviewCount})
          </button>
        </div>

        <div className="py-8 min-h-[320px]">
          {activeTab === "detail" ? (
            <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in">
              {/* 상품 소개 */}
              <section>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">상품 소개</h3>
                <p className="text-gray-700 leading-relaxed">
                  이 상품은 최고의 품질을 자랑합니다. 엄선된 소재와 장인의 손길로 만들어진 프리미엄 제품입니다.
                  일상 생활에서 편안하게 사용할 수 있도록 디자인되었습니다.
                </p>
              </section>

              {/* 상세 이미지 */}
              <section>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">상세 이미지</h3>
                <div className="bg-gray-100 rounded-xl overflow-hidden aspect-[16/9]">
                  <ImageWithFallback src={product.image} alt="상세 이미지" className="w-full h-full object-cover" />
                </div>
              </section>

              {/* 상품 필수 표기정보 (고시정보) */}
              <section>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">상품 필수 표기정보</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <th className="py-4 px-5 bg-gray-50 text-gray-600 font-medium w-36 text-left">제품명</th>
                        <td className="py-4 px-5 text-gray-900">{product.name}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <th className="py-4 px-5 bg-gray-50 text-gray-600 font-medium text-left">제조국</th>
                        <td className="py-4 px-5 text-gray-900">대한민국</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <th className="py-4 px-5 bg-gray-50 text-gray-600 font-medium text-left">소재</th>
                        <td className="py-4 px-5 text-gray-900">상세페이지 참조</td>
                      </tr>
                      <tr>
                        <th className="py-4 px-5 bg-gray-50 text-gray-600 font-medium text-left">취급시 주의사항</th>
                        <td className="py-4 px-5 text-gray-900">세탁 시 단독 세탁 권장</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* 교환/반품 안내 */}
              <section className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">교환/반품 안내</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 배송 완료일로부터 7일 이내 교환/반품 신청 가능합니다.</li>
                  <li>• 상품 하자 시 전액 환불 또는 교환해 드립니다.</li>
                  <li>• 고객 변심 시 반품비는 고객 부담입니다.</li>
                </ul>
              </section>
            </div>
          ) : (
            <div className="animate-in fade-in space-y-6">
              {/* Review Summary */}
              <div className="bg-gray-50 rounded-xl p-8 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-900 mb-2">{product.rating}</div>
                  <div className="flex justify-center text-[#FF9900] mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(product.rating) ? "fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">{product.reviewCount}개의 리뷰</p>
                </div>
                <div className="flex-1 w-full max-w-xs space-y-2">
                  {[5, 4, 3, 2, 1].map((score) => (
                    <div key={score} className="flex items-center gap-2 text-sm">
                      <span className="w-3">{score}</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gray-900 rounded-full"
                          style={{
                            width: score === 5 ? "70%" : score === 4 ? "20%" : "3%",
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review List */}
              <div className="space-y-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="border-b border-gray-100 pb-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                          {["김", "이", "박"][item - 1]}**
                        </div>
                        <div>
                          <p className="text-sm font-medium">아주 만족합니다</p>
                          <div className="flex text-[#FF9900]">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">2023.10.{15 - item}</span>
                    </div>
                    <p className="text-gray-600 text-sm pl-10 mb-3">
                      {item === 1
                        ? "배송도 빠르고 상품 품질이 너무 좋습니다. 재구매 의사 있습니다!"
                        : item === 2
                          ? "화면과 색상이 동일하네요. 사이즈도 딱 맞습니다."
                          : "가성비 최고입니다. 추천해요."}
                    </p>
                    {item === 1 && (
                      <div className="pl-10">
                        <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden cursor-pointer">
                          <ImageWithFallback
                            src={product.image}
                            alt="Review"
                            className="w-full h-full object-cover hover:scale-110 transition-transform"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  onClick={() =>
                    navigate("/product/reviews", {
                    state: { from: location.pathname + location.search },
                  })
                  }
                >
                  리뷰 더보기
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products - 상단 그리드와 동일 정렬 */}
      <section className="mt-12 border-t border-gray-200 pt-8">
        <h2 className="text-xl font-bold mb-6">이 상품과 함께 보면 좋은 상품</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <CartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={product.name}
        productImage={product.image}
        productPrice={product.price}
      />
    </div>
  );
};
