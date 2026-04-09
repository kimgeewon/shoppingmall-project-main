# 06. 상품 목록 페이지

> **목표**: ProductListPage를 구현하고, 카테고리·검색 필터와 상품 그리드를 적용합니다.

## 1. api.js 보완

08에서 장바구니·로그인 API를 StoreContext와 연동할 예정이므로, 05에서 만든 api.js는 그대로 두고, 이 단계에서는 `getProducts`, `getCategories`만 사용합니다.

---

## 2. Breadcrumb 컴포넌트

### 2-1. src/app/components/layout/Breadcrumb.jsx 생성

```jsx
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export function Breadcrumb({ items }) {
  if (!items?.length) return null;

  return (
    <nav className="breadcrumb-nav" aria-label="Breadcrumb">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <span key={idx} className="contents">
            {idx > 0 && <ChevronRight className="w-4 h-4 shrink-0" />}
            {item.to && !isLast ? (
              <Link to={item.to} className="hover:text-black">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-black font-medium" : ""}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
```

---

## 3. ProductListPage (간단 버전)

카테고리·검색 파라미터만 반영하는 기본 버전입니다. 프로젝트 원본은 필터 UI(체크박스, 슬라이더)가 포함되어 있으므로, 완전한 버전이 필요하면 `src/app/pages/ProductListPage.jsx`를 참고하세요.

### 3-1. src/app/pages/ProductListPage.jsx 전체 교체

```jsx
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ProductCard } from "../components/product/ProductCard";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { Skeleton } from "../components/ui/Skeleton";
import { getProducts, getCategories } from "@/lib/api";

export function ProductListPage() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "";
  const searchQuery = searchParams.get("search") || "";

  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      if (!cancelled) {
        setProducts(prods || []);
        setCategories(cats || []);
      }
      setIsLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const filteredProducts = products.filter((p) => {
    if (categoryParam && categoryParam !== "all") {
      if (p.category !== categoryParam) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!p.name?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const categoryName =
    categories.find((c) => c.id === categoryParam)?.name || "전체";

  if (isLoading) {
    return (
      <div className="page-container">
        <Skeleton className="h-6 w-48 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="aspect-video rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Breadcrumb
        items={[
          { to: "/", label: "홈" },
          { to: "/products", label: "상품" },
          { label: categoryName },
        ]}
      />

      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          to="/products"
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            !categoryParam || categoryParam === "all"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          전체
        </Link>
        {categories
          .filter((c) => c.id !== "all")
          .map((c) => (
            <Link
              key={c.id}
              to={`/products?category=${c.id}`}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                categoryParam === c.id
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {c.name}
            </Link>
          ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  );
}
```

---

## 4. 확인

`pnpm dev` 실행 후:

1. `/products` 접속 시 상품 그리드 표시
2. 카테고리 탭 클릭 시 `?category=electronics` 등으로 필터
3. 헤더 검색창에서 "노트북" 검색 시 `/products?search=노트북` 이동 및 필터 적용
4. 브레드크럼 "홈", "상품" 클릭 시 해당 페이지로 이동

---

## 5. 고급 기능 (선택)

프로젝트의 `ProductListPage.jsx`에는 다음이 포함되어 있습니다.

- Radix 체크박스·슬라이더 기반 필터
- 정렬 (인기순, 낮은가격순 등)
- 페이지네이션
- 모바일 필터 드로어

필요하면 해당 파일을 복사해 사용하세요.

---

## 6. 다음 단계

[07-product-detail.md](./07-product-detail.md)에서 ProductDetailPage를 구현합니다.

---

## 📖 강의 시 참고 – 핵심 개념

### useSearchParams

```jsx
const [searchParams] = useSearchParams();
const categoryParam = searchParams.get("category") || "";
const searchQuery = searchParams.get("search") || "";
```

- **역할**: URL의 `?category=electronics&search=노트북` 같은 query string을 읽고 수정.
- **차이**: `useLocation().search`는 문자열 전체. `useSearchParams`는 파싱된 객체 제공.

### 클라이언트 필터링

- **패턴**: 서버에서 전체 데이터를 받고, `products.filter()`로 필터링.
- **프로토타입 적합**: 실제 API 연동 시에는 서버에 `?category=&search=` 요청하는 것이 일반적.

### Breadcrumb의 aria-label

```jsx
<nav aria-label="Breadcrumb">
```

- **의미**: 스크린 리더 사용자를 위한 접근성. "Breadcrumb" 네비게이션임을 알림.
- **구조**: `홈 > 상품 > 전자제품`처럼 계층을 시각·구조적으로 표현.

### 조건부 클래스 (템플릿 리터럴)

```jsx
className={`px-4 py-2 rounded-full ${
  categoryParam === c.id ? "bg-primary text-white" : "bg-gray-100 text-gray-700"
}`}
```

- **패턴**: 선택된 탭과 비선택 탭의 스타일 분기. `cn()`과 조건부 표현식 조합도 가능.
