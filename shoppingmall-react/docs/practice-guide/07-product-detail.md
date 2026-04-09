# 07. 상품 상세 페이지

> **목표**: ProductDetailPage에 이미지 갤러리, 상품 정보, 장바구니 담기, CartModal을 구현합니다.

## 1. CartModal

### 1-1. src/app/components/modal/CartModal.jsx 생성

```jsx
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowRight, X } from "lucide-react";
import { Button } from "../ui/Button";
import { ImageWithFallback } from "../ui/ImageWithFallback";

export function CartModal({ isOpen, onClose, productName, productImage, productPrice }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoToCart = () => {
    onClose();
    navigate("/cart");
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden z-10 p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-green-600" />
            장바구니에 담았습니다
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-black">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex gap-4 py-4 border-y border-gray-100 my-4">
          <div className="h-20 w-20 shrink-0 rounded-md overflow-hidden bg-gray-100">
            <ImageWithFallback src={productImage} alt={productName} className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="font-medium line-clamp-2">{productName}</p>
            <p className="text-sm font-bold mt-1">{productPrice?.toLocaleString()}원</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={onClose}>쇼핑 계속하기</Button>
          <Button variant="primary" onClick={handleGoToCart}>장바구니 이동 <ArrowRight className="ml-2 h-4 w-4 inline" /></Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
```

---

## 2. ProductDetailPage

### 2-1. src/app/pages/ProductDetailPage.jsx 전체 교체

프로젝트의 `src/app/pages/ProductDetailPage.jsx`를 복사해 사용하거나, 아래 축약 버전을 사용합니다.

```jsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Star, Plus, Minus } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { CartModal } from "../components/modal/CartModal";
import { ImageWithFallback } from "../components/ui/ImageWithFallback";
import { getProductById, getProducts } from "@/lib/api";
import { useStore } from "../../context/StoreContext";

const CATEGORY_NAMES = { electronics: "전자제품", clothing: "의류", food: "식품", other: "기타" };

export function ProductDetailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useStore();
  const productId = searchParams.get("id");

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("detail");

  useEffect(() => {
    if (!productId) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    async function load() {
      const [found, all] = await Promise.all([getProductById(productId), getProducts()]);
      if (!cancelled) {
        if (found) {
          setProduct(found);
          setSelectedImage(found.image);
        }
        setRelatedProducts((all || []).filter((p) => p.id !== productId).slice(0, 4));
      }
      setIsLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [productId]);

  const addAndOpenModal = () => {
    addToCart({
      id: `cart_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      option: "기본",
    });
    setIsModalOpen(true);
  };

  const discountRate = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const categoryName = product?.category ? CATEGORY_NAMES[product.category] || product.category : null;
  const productsUrl = categoryName ? `/products?category=${product.category}` : "/products";
  const breadcrumbItems = categoryName
    ? [{ to: "/", label: "홈" }, { to: "/products", label: "상품" }, { to: productsUrl, label: categoryName }, { label: product?.name }]
    : [{ to: "/", label: "홈" }, { to: "/products", label: "상품" }, { label: product?.name }];

  if (isLoading) {
    return (
      <div className="page-container max-w-6xl mx-auto">
        <Skeleton className="h-6 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-video rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-container">
        <p className="text-center py-20 text-gray-500">상품을 찾을 수 없습니다.</p>
        <div className="text-center">
          <Button onClick={() => navigate("/products")}>상품 목록</Button>
        </div>
      </div>
    );
  }

  const galleryImages = [product.image, product.image, product.image];

  return (
    <div className="page-container max-w-6xl mx-auto">
      <Breadcrumb items={breadcrumbItems} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
            <ImageWithFallback
              src={selectedImage}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {galleryImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(img)}
                className={`aspect-video rounded-md overflow-hidden border-2 ${selectedImage === img ? "border-primary" : "border-transparent"}`}
              >
                <ImageWithFallback src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-bold">{product.price.toLocaleString()}원</span>
            {product.originalPrice && (
              <>
                <span className="text-gray-400 line-through">{product.originalPrice.toLocaleString()}원</span>
                <span className="text-secondary font-bold">{discountRate}%</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 text-gray-600 mb-6">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{product.rating}</span>
            <span>({product.reviewCount})</span>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-label">수량</span>
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-3 hover:bg-gray-100"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-3 hover:bg-gray-100"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="primary" size="lg" className="flex-1" onClick={addAndOpenModal} disabled={product.isSoldOut}>
              장바구니 담기
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="flex-1"
              onClick={() => {
                addAndOpenModal();
                navigate("/cart");
              }}
              disabled={product.isSoldOut}
            >
              바로 구매
            </Button>
          </div>
        </div>
      </div>

      {/* 탭 */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("detail")}
            className={`py-4 font-medium border-b-2 -mb-px ${activeTab === "detail" ? "border-primary text-primary" : "border-transparent text-gray-500"}`}
          >
            상품 상세
          </button>
        </div>
      </div>
      <div className="prose max-w-none">
        {activeTab === "detail" && (
          <div className="space-y-4">
            <p>{product.name} 상품 상세 정보입니다.</p>
            <p className="text-gray-600">상세 이미지와 스펙은 추후 추가할 수 있습니다.</p>
          </div>
        )}
      </div>

      <CartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={product.name}
        productImage={product.image}
        productPrice={product.price}
      />
    </div>
  );
}
```

---

## 3. 확인

`pnpm dev` 실행 후:

1. 홈 또는 상품 목록에서 상품 클릭 → `/product-detail?id=1` 등으로 이동
2. 상품 이미지, 가격, 수량 선택, 장바구니 담기 동작 확인
3. "장바구니 담기" 클릭 시 CartModal 표시
4. "장바구니 이동" 클릭 시 장바구니 페이지로 이동 (08에서 구현)

---

## 4. 다음 단계

[08-cart-checkout.md](./08-cart-checkout.md)에서 장바구니·주문 플로우와 api.js 연동을 구현합니다.

---

## 📖 강의 시 참고 – 핵심 개념

### createPortal

```jsx
return createPortal(
  <div className="fixed inset-0 ...">...</div>,
  document.body
);
```

- **개념**: React 컴포넌트를 DOM의 다른 위치(body, 별도 div)에 렌더링.
- **이유**: 모달이 부모의 `overflow: hidden`이나 `z-index`에 영향받지 않도록.
- **패턴**: 포털 없이 렌더하면 부모 스타일에 의해 모달이 잘릴 수 있음.

### 모달 열림 시 body 스크롤 금지

```jsx
useEffect(() => {
  if (isOpen) document.body.style.overflow = "hidden";
  else document.body.style.overflow = "unset";
  return () => { document.body.style.overflow = "unset"; };
}, [isOpen]);
```

- **이유**: 모달 위에서 뒷 배경이 스크롤되는 것을 막아 UX 개선.
- **cleanup**: 모달 닫힐 때 반드시 원복. 안 하면 다른 페이지에서도 스크롤 안 됨.

### useSearchParams로 id 파싱

```jsx
const productId = searchParams.get("id");
```

- **URL**: `/product-detail?id=1`. query string에서 id 추출.
- **대안**: React Router `:id` 동적 세그먼트(`/product-detail/1`)도 가능. 이 프로젝트는 query 방식 사용.

### 탭 UI 패턴

- **상태**: `activeTab`으로 "detail", "review" 등 구분.
- **스타일**: 선택 탭에 `border-b-2 border-primary`, 비선택은 `border-transparent`.
