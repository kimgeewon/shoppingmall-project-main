# 05. 홈페이지 - API, 데이터, 슬라이더

> **목표**: api.js와 JSON 데이터를 추가하고, HomePage에 히어로 배너와 상품 슬라이더를 구현합니다.

## 1. API 및 데이터

### 1-1. public/data 폴더 생성

```bash
mkdir -p public/data
```

### 1-2. JSON 데이터 파일

이 프로젝트의 `public/data/` 폴더에서 다음 파일을 그대로 복사합니다.

- `products.json` – 상품 데이터 (36개)
- `categories.json` – 카테고리
- `magazine.json` – 매거진
- `users.json` – 테스트 유저 (로그인용)

직접 작성하려면 예시는 아래를 참고합니다.

**public/data/products.json** (최소 예시):

```json
{
  "products": [
    {
      "id": "1",
      "name": "프리미엄 노이즈 캔슬링 헤드폰",
      "price": 299000,
      "originalPrice": 350000,
      "rating": 4.8,
      "reviewCount": 120,
      "image": "https://images.unsplash.com/photo-1695634463848-4db4e47703a4?w=400",
      "category": "electronics",
      "badges": ["HOT", "SALE"]
    },
    {
      "id": "2",
      "name": "베이직 코튼 티셔츠",
      "price": 29000,
      "rating": 4.5,
      "reviewCount": 85,
      "image": "https://images.unsplash.com/photo-1564316800929-be17a69d6966?w=400",
      "category": "clothing",
      "badges": ["NEW"]
    }
  ]
}
```

**public/data/categories.json**:

```json
{
  "categories": [
    {"id": "all", "name": "전체", "icon": "LayoutGrid"},
    {"id": "electronics", "name": "전자제품", "icon": "Monitor"},
    {"id": "clothing", "name": "의류", "icon": "Shirt"},
    {"id": "food", "name": "식품", "icon": "Apple"}
  ]
}
```

**public/data/magazine.json**:

```json
{
  "articles": [
    {
      "id": "1",
      "category": "TREND",
      "title": "2024 S/S 컬러 트렌드",
      "description": "올 봄 핵심 컬러와 스타일링 가이드.",
      "image": "https://images.unsplash.com/photo-1764698192198-4cfb7188c6d5?w=1080",
      "date": "2024.03.15"
    }
  ]
}
```

**public/data/users.json**:

```json
{
  "users": [
    {
      "id": "user_1",
      "email": "test@test.com",
      "password": "test1234",
      "name": "테스트유저",
      "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256"
    }
  ]
}
```

---

## 2. api.js

### 2-1. src/lib/api.js 생성

프로젝트 루트의 `src/lib/api.js`를 참고하여 전체 내용을 복사하거나, 아래 최소 버전을 사용합니다.

```js
const STORAGE_KEYS = {
  USERS: "shopping_users",
  PRODUCTS: "shopping_products",
  CATEGORIES: "shopping_categories",
  MAGAZINE: "shopping_magazine",
  CURRENT_USER: "shopping_current_user",
  CART: "shopping_cart",
  ORDERS: "shopping_orders",
};

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function getStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export async function initData() {
  const list = [
    { key: STORAGE_KEYS.PRODUCTS, url: "/data/products.json", prop: "products" },
    { key: STORAGE_KEYS.CATEGORIES, url: "/data/categories.json", prop: "categories" },
    { key: STORAGE_KEYS.MAGAZINE, url: "/data/magazine.json", prop: "articles" },
  ];
  const seedUsers = { key: STORAGE_KEYS.USERS, url: "/data/users.json", prop: "users" };

  for (const { key, url, prop } of list) {
    try {
      const res = await fetch(url);
      const json = await res.json();
      setStorage(key, json[prop] ?? json);
    } catch (e) {
      console.warn("initData 실패:", url, e);
    }
  }
  if (!getStorage(STORAGE_KEYS.USERS)) {
    try {
      const res = await fetch(seedUsers.url);
      const json = await res.json();
      setStorage(STORAGE_KEYS.USERS, json[seedUsers.prop] ?? json);
    } catch (e) {
      console.warn("users 시드 실패", e);
    }
  }
}

export async function getProducts() {
  await delay(100);
  return getStorage(STORAGE_KEYS.PRODUCTS) || [];
}

export async function getProductById(id) {
  await delay(50);
  const list = getStorage(STORAGE_KEYS.PRODUCTS) || [];
  return list.find((p) => p.id === id) || null;
}

export async function getCategories() {
  await delay(50);
  return getStorage(STORAGE_KEYS.CATEGORIES) || [];
}

export async function getMagazineArticles() {
  await delay(100);
  return getStorage(STORAGE_KEYS.MAGAZINE) || [];
}
```

> **참고**: 장바구니·로그인 관련 함수는 08에서 추가합니다. 이 단계에서는 위 함수만 포함해도 됩니다.

---

## 3. main.jsx 수정

### 3-1. src/main.jsx

```jsx
import { createRoot } from "react-dom/client";
import { initData } from "@/lib/api";
import App from "./app/App";
import "./styles/index.css";

async function bootstrap() {
  await initData();
  createRoot(document.getElementById("root")).render(<App />);
}
bootstrap();
```

---

## 4. 지원 컴포넌트

### 4-1. src/app/components/ui/Skeleton.jsx

```jsx
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }) {
  return (
    <div className={cn("animate-pulse rounded-md bg-gray-200/80", className)} {...props} />
  );
}
```

### 4-2. src/app/components/ui/Badge.jsx

```jsx
import { cn } from "@/lib/utils";

export function Badge({ className, variant = "default", children, ...props }) {
  const variants = {
    default: "bg-bg-muted text-primary",
    sale: "bg-secondary text-white",
    hot: "bg-destructive text-white",
    new: "bg-green-600 text-white",
    soldout: "bg-primary-dark text-white",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
```

### 4-3. src/app/components/ui/ImageWithFallback.jsx

```jsx
import { useState } from "react";
import { cn } from "@/lib/utils";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' fill='%23e5e7eb'%3E%3Crect width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='24' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

export function ImageWithFallback({ src, alt, className, ...props }) {
  const [error, setError] = useState(false);
  return (
    <img
      src={error ? PLACEHOLDER : src}
      alt={alt}
      className={cn(className)}
      onError={() => setError(true)}
      {...props}
    />
  );
}
```

---

## 5. ProductCard (06에서 사용, 여기서 선 생성)

### 5-1. src/app/components/product/ProductCard.jsx 생성

```jsx
import { Star, ShoppingCart } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import { ImageWithFallback } from "../ui/ImageWithFallback";

export function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useStore();

  const handleCardClick = () => {
    navigate(`/product-detail?id=${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({
      id: `cart_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      option: "기본",
    });
  };

  const discountRate = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-lg cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Badge variant="soldout" className="text-lg px-4 py-2">품절</Badge>
          </div>
        )}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.badges?.map((b) => (
            <Badge key={b} variant={b === "SALE" ? "sale" : b === "HOT" ? "hot" : b === "NEW" ? "new" : "default"}>
              {b}
            </Badge>
          ))}
        </div>
        {!product.isSoldOut && (
          <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
            <Button variant="primary" fullWidth onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-4 w-4" /> 장바구니 담기
            </Button>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-base font-medium">{product.name}</h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold">{product.price.toLocaleString()}원</span>
          {product.originalPrice && (
            <>
              <span className="text-sm text-gray-400 line-through">{product.originalPrice.toLocaleString()}원</span>
              <span className="text-sm font-bold text-secondary">{discountRate}%</span>
            </>
          )}
        </div>
        <div className="mt-auto flex items-center gap-1 pt-3 text-sm text-gray-400">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{product.rating}</span>
          <span>({product.reviewCount})</span>
        </div>
      </div>
    </div>
  );
}
```

---

## 6. HomePage 구현

### 6-1. src/app/pages/HomePage.jsx 전체 교체

프로젝트의 `src/app/pages/HomePage.jsx`를 그대로 복사하거나, 아래 축약 버전을 사용합니다.

```jsx
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Menu, ThumbsUp, Percent, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { ProductCard } from "../components/product/ProductCard";
import { getProducts, getMagazineArticles } from "@/lib/api";

const HERO = "https://images.unsplash.com/photo-1703413222048-d24789838246?w=1080";

export function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [magazineArticles, setMagazineArticles] = useState([]);
  const sliderRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [prods, articles] = await Promise.all([getProducts(), getMagazineArticles()]);
      if (!cancelled) {
        setProducts(prods || []);
        setMagazineArticles(articles || []);
      }
      setIsLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const quickCategories = [
    { id: "all", name: "전체", icon: Menu, path: "/products" },
    { id: "sale", name: "세일", icon: Percent, path: "/products?tag=sale" },
    { id: "rec", name: "추천", icon: ThumbsUp, path: "/products?tag=recommended" },
  ];

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
  };

  const productSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-[400px] w-full rounded-xl mb-8" />
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="aspect-video rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-20">
      <section>
        <Slider ref={sliderRef} {...sliderSettings}>
          <div className="relative h-[400px] md:h-[500px] w-full bg-gray-900">
            <img src={HERO} alt="배너" className="h-full w-full object-cover opacity-60" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
              <h1 className="text-2xl md:text-4xl font-bold mb-4">새로운 쇼핑의 시작</h1>
              <p className="text-sm md:text-lg mb-8 opacity-90">매일 업데이트되는 신상품을 만나보세요.</p>
              <Button size="lg" onClick={() => (window.location.href = "/products")}>지금 쇼핑하기</Button>
            </div>
          </div>
        </Slider>
      </section>

      <section className="container mx-auto px-4">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {quickCategories.map(({ name, icon: Icon, path }) => (
            <Link key={path} to={path} className="flex flex-col items-center gap-2 min-w-[64px] shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium">{name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">인기 상품</h2>
          <Link to="/products" className="text-gray-500 hover:text-black flex items-center text-sm">
            더보기 <ChevronRight className="ml-0.5 h-4 w-4" />
          </Link>
        </div>
        <Slider {...productSliderSettings}>
          {products.map((p) => (
            <div key={p.id} className="px-2">
              <ProductCard product={p} />
            </div>
          ))}
        </Slider>
      </section>

      {magazineArticles?.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">매거진</h2>
            <Link to="/magazine" className="text-gray-500 hover:text-black flex items-center text-sm">
              전체보기 <ChevronRight className="ml-0.5 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {magazineArticles.slice(0, 2).map((a) => (
              <Link key={a.id} to={`/magazine/${a.id}`} className="block">
                <img src={a.image} alt={a.title} className="w-full aspect-[4/3] object-cover rounded-xl" />
                <h3 className="mt-2 font-bold">{a.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{a.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
```

---

## 7. 확인

`pnpm dev` 실행 후:

1. 홈에 히어로 배너 슬라이더 표시
2. 퀵 카테고리 클릭 시 `/products`로 이동
3. 인기 상품 슬라이더에 상품 카드 표시
4. 상품 카드 클릭 시 상품 상세로 이동 (07에서 구현)
5. 장바구니 담기 버튼 클릭 시 헤더 장바구니 수 증가 (StoreContext 사용)

---

## 8. 다음 단계

[06-product-card-list.md](./06-product-card-list.md)에서 ProductListPage와 필터를 구현합니다.

---

## 📖 강의 시 참고 – 핵심 개념

### initData와 bootstrap

```jsx
async function bootstrap() {
  await initData();
  createRoot(...).render(<App />);
}
bootstrap();
```

- **의미**: 앱 렌더 전에 JSON을 fetch해 localStorage에 넣어 둠.
- **이유**: 이후 `getProducts()` 등이 localStorage에서 바로 읽어, 네트워크 지연 없이 응답.

### useEffect cleanup (cancelled 플래그)

```jsx
useEffect(() => {
  let cancelled = false;
  async function load() {
    const data = await getProducts();
    if (!cancelled) setProducts(data);
  }
  load();
  return () => { cancelled = true; };
}, []);
```

- **이유**: 컴포넌트 언마운트 후에도 비동기 응답이 오면 `setState`를 호출해 "Can't perform a React state update on unmounted component" 경고 발생.
- **해결**: cleanup에서 `cancelled = true`로 두고, 응답 후 `if (!cancelled)`일 때만 setState.

### e.stopPropagation()

- **위치**: ProductCard의 장바구니 버튼 `onClick` 핸들러.
- **의미**: 카드 전체 `onClick`(상세 페이지 이동)과 버튼 `onClick`이 충돌. 버튼 클릭 시 이벤트가 부모로 전파되지 않게 함.

### ImageWithFallback

- **역할**: `onError` 시 placeholder 이미지(SVG data URL)로 대체.
- **이유**: 외부 이미지 URL이 깨지거나 CORS 제한 시에도 레이아웃이 깨지지 않음.

### react-slick responsive

```js
responsive: [
  { breakpoint: 1024, settings: { slidesToShow: 3 } },
  { breakpoint: 768, settings: { slidesToShow: 2 } },
]
```

- **의미**: 화면 너비에 따라 슬라이드 개수 자동 조정.
