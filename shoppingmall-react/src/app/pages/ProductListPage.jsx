/**
 * ProductListPage - 상품 목록 페이지
 *
 * 사용처: App.jsx (path="/products")
 *
 * URL 파라미터: ?category= | ?search= | ?tag= | ?sort= | ?page=
 * - useSearchParams(): URL 쿼리 읽기/쓰기
 * - 필터: 카테고리(체크박스), 브랜드(Mock), 가격 범위(Slider)
 * - productsWithBrands: 상품 데이터에 브랜드 없으므로 Mock으로 추가 (필터용)
 */
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, X, ChevronDown, Check } from "lucide-react";
import { ProductCard } from "../components/product/ProductCard";
import { Button } from "../components/ui/Button";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { Slider } from "../components/ui/Slider";
import { Badge } from "../components/ui/Badge";
import { Skeleton } from "../components/ui/Skeleton";
import { getProducts, getCategories } from "@/lib/api";
import * as Checkbox from "@radix-ui/react-checkbox";

/** Radix UI Checkbox 기반 필터 체크박스 (카테고리/브랜드) */
const CheckboxItem = ({ label, checked, onChange }) => (
  <div className="flex items-center space-x-2">
    <Checkbox.Root
      className="flex h-5 w-5 appearance-none items-center justify-center rounded border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-black"
      checked={checked}
      onCheckedChange={(c) => onChange(c)}
      id={label}
    >
      <Checkbox.Indicator className="text-black">
        <Check className="h-3.5 w-3.5" />
      </Checkbox.Indicator>
    </Checkbox.Root>
    <label htmlFor={label} className="text-sm text-gray-700 cursor-pointer select-none">
      {label}
    </label>
  </div>
);

/** 상품 데이터에 없으므로 프로토타입용 Mock 브랜드 */
const BRANDS = ["Brand A", "Brand B", "Brand C"];
const ITEMS_PER_PAGE = 12;

export const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const currentPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const sortBy = searchParams.get("sort") || "popular";
  const categoryParam = searchParams.get("category") || "";

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let cancelled = false; // 언마운트 시 setState 방지
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

  /** URL ?category= 파라미터 → 카테고리 필터 동기화 (브레드크럼 등에서 진입 시) */
  useEffect(() => {
    const cats = categoryParam ? categoryParam.split(",").filter(Boolean) : [];
    const validIds = (categories || []).map((c) => c.id);
    const synced = cats.filter((id) => validIds.includes(id) && id !== "all");
    setSelectedCategories(synced);
  }, [categoryParam, categories.length]);

  /** 상품에 Mock 브랜드 추가 (필터용) */
  const productsWithBrands = useMemo(() => {
    return (products || []).map((p, i) => ({
      ...p,
      brand: BRANDS[i % BRANDS.length],
    }));
  }, [products]);

  // Note: ProductCard handles the add-to-cart logic and modal display internally.
  // We don't need to pass an onAddToCart handler that shows a toast anymore.

  const toggleCategory = (catId) => {
    const newCats = selectedCategories.includes(catId)
      ? selectedCategories.filter((id) => id !== catId)
      : [...selectedCategories, catId];
    setSelectedCategories(newCats);
    const next = new URLSearchParams(searchParams);
    if (newCats.length === 0) {
      next.delete("category");
    } else {
      next.set("category", newCats.join(","));
    }
    next.set("page", "1");
    setSearchParams(next);
  };

  const toggleBrand = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };


  // Filter Logic
  const filteredProducts = useMemo(() => {
    let result = productsWithBrands.filter((product) => {
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false;
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;
      return true;
    });
    // Sort
    const sorted = [...result].sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "newest") return (b.id || 0) - (a.id || 0);
      return (b.reviewCount || 0) - (a.reviewCount || 0); // popular (기본)
    });
    return sorted;
  }, [productsWithBrands, searchQuery, selectedCategories, selectedBrands, priceRange, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const setPage = (page) => {
    const next = Math.max(1, Math.min(page, totalPages));
    searchParams.set("page", String(next));
    setSearchParams(searchParams);
  };

  const setSort = (value) => {
    searchParams.set("sort", value);
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  };

  // 필터 변경 시 현재 페이지가 총 페이지를 초과하면 1페이지로
  useEffect(() => {
    if (currentPage > totalPages && totalPages >= 1) {
      const next = new URLSearchParams(searchParams);
      next.set("page", "1");
      setSearchParams(next);
    }
  }, [currentPage, totalPages, searchParams, setSearchParams]);

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 1000000]);
    const next = new URLSearchParams(searchParams);
    next.delete("search");
    next.delete("category");
    next.set("page", "1");
    setSearchParams(next);
  };

  const categoryNames = { electronics: "전자제품", clothing: "의류", food: "식품", other: "기타" };
  const firstCategoryId = categoryParam ? categoryParam.split(",")[0] : "";
  const categoryLabel = firstCategoryId ? categoryNames[firstCategoryId] || firstCategoryId : null;
  const breadcrumbItems = categoryLabel
    ? [
        { to: "/", label: "홈" },
        { to: "/products", label: "상품" },
        { label: categoryLabel },
      ]
    : [{ to: "/", label: "홈" }, { label: "상품" }];

  return (
    <div className="page-container">
      <Breadcrumb items={breadcrumbItems} />
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {searchQuery ? `'${searchQuery}' 검색 결과` : "전체 상품"}
            <span className="text-base font-normal text-gray-500 ml-2">
              ({filteredProducts.length}개)
            </span>
          </h1>
          {searchQuery && (
            <button
              onClick={() => {
                searchParams.delete("search");
                setSearchParams(searchParams);
              }}
              className="text-sm text-black hover:underline mt-1"
            >
              전체 상품 보기
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="md:hidden"
            onClick={() => setIsMobileFilterOpen(true)}
          >
            <Filter className="mr-2 h-4 w-4" /> 필터
          </Button>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-4 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="popular">인기순</option>
              <option value="price_asc">가격 낮은순</option>
              <option value="price_desc">가격 높은순</option>
              <option value="newest">최신순</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filter (Desktop) */}
        <aside className="hidden md:block w-64 shrink-0 space-y-8">
          {/* Category Filter */}
          <div>
            <h3 className="font-bold mb-4">카테고리</h3>
            <div className="space-y-3">
              {categories.slice(1).map((cat) => (
                <CheckboxItem
                  key={cat.id}
                  label={cat.name}
                  checked={selectedCategories.includes(cat.id)}
                  onChange={() => toggleCategory(cat.id)}
                />
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <h3 className="font-bold mb-4">가격 범위</h3>
            <div className="px-2">
              <Slider
                defaultValue={[0, 1000000]}
                max={1000000}
                step={10000}
                value={priceRange}
                onValueChange={setPriceRange}
                className="mb-4"
              />
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{priceRange[0].toLocaleString()}원</span>
              <span>{priceRange[1].toLocaleString()}원</span>
            </div>
          </div>

          {/* Brands Filter */}
          <div>
            <h3 className="font-bold mb-4">브랜드</h3>
            <div className="space-y-3">
              {BRANDS.map((brand) => (
                <CheckboxItem
                  key={brand}
                  label={brand}
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                />
              ))}
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCategories.length > 0 ||
            selectedBrands.length > 0 ||
            priceRange[0] > 0 ||
            priceRange[1] < 1000000 ||
            searchQuery) && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">적용 중:</span>
                <button className="text-xs text-gray-500 underline" onClick={clearAllFilters}>
                  초기화
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map((catId) => {
                  const cat = categories.find((c) => c.id === catId);
                  return (
                    <Badge key={catId} variant="default" className="flex items-center gap-1">
                      {cat?.name}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => toggleCategory(catId)} />
                    </Badge>
                  );
                })}
                {selectedBrands.map((brand) => (
                  <Badge
                    key={brand}
                    variant="secondary"
                    className="flex items-center gap-1 bg-gray-100 text-gray-800"
                  >
                    {brand}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => toggleBrand(brand)} />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-5 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center mt-12 gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  이전
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    if (totalPages <= 5) return true;
                    if (p === 1 || p === totalPages) return true;
                    if (Math.abs(p - currentPage) <= 1) return true;
                    return false;
                  })
                  .map((p, idx, arr) => {
                    const prev = arr[idx - 1];
                    const showEllipsis = prev !== undefined && p - prev > 1;
                    return (
                      <span key={p} className="flex items-center gap-1">
                        {showEllipsis && <span className="px-1 text-gray-400">…</span>}
                        <Button
                          variant={p === currentPage ? "primary" : "ghost"}
                          size="sm"
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </Button>
                      </span>
                    );
                  })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  다음
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <p className="text-lg">조건에 맞는 상품이 없습니다.</p>
              <Button variant="outline" className="mt-4" onClick={clearAllFilters}>
                필터 초기화
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4 sm:p-0">
          <div className="w-full max-w-sm bg-white rounded-t-xl sm:rounded-xl p-6 animate-in slide-in-from-bottom-10 fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">필터</h2>
              <button onClick={() => setIsMobileFilterOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6 overflow-y-auto max-h-[60vh]">
              <div>
                <h3 className="font-bold mb-4">카테고리</h3>
                <div className="space-y-3">
                  {categories.slice(1).map((cat) => (
                    <CheckboxItem
                      key={cat.id}
                      label={cat.name}
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() => toggleCategory(cat.id)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-4">가격 범위</h3>
                <div className="px-2">
                  <Slider
                    defaultValue={[0, 1000000]}
                    max={1000000}
                    step={10000}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mb-4"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-4">브랜드</h3>
                <div className="space-y-3">
                  {BRANDS.map((brand) => (
                    <CheckboxItem
                      key={brand}
                      label={brand}
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  clearAllFilters();
                  setIsMobileFilterOpen(false);
                }}
              >
                초기화
              </Button>
              <Button fullWidth onClick={() => setIsMobileFilterOpen(false)}>
                결과 보기 ({filteredProducts.length}개)
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
