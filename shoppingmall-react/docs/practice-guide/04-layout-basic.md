# 04. 레이아웃 보강 (Header, Footer)

> **목표**: Header에 검색창, 모바일 햄버거 메뉴를 추가하고, Footer를 완성합니다.

## 1. Header 보강

### 1-1. src/app/components/ui/Input.jsx 확인

03에서 생성한 Input이 있으면 그대로 사용합니다. 없으면 03을 먼저 진행합니다.

### 1-2. src/app/components/layout/Header.jsx 전체 교체

```jsx
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { Input } from "../ui/Input";
import { useStore } from "../../context/StoreContext";

export function Header() {
  const navigate = useNavigate();
  const { cartCount, isLoggedIn, user } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-24 flex items-center justify-between gap-4">
        <Link to="/" className="text-2xl font-bold text-black shrink-0">
          MALL
        </Link>

        <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-md mx-4">
          <div className="relative">
            <Input
              placeholder="상품을 검색해보세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </form>

        <div className="flex items-center gap-2 shrink-0">
          <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full">
            <ShoppingCart className="h-6 w-6 text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-secondary text-white text-xs font-bold flex items-center justify-center ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </Link>

          <div className="hidden md:flex items-center gap-4 ml-2">
            {isLoggedIn && user ? (
              <Link to="/mypage" className="text-sm font-medium text-gray-700 hover:text-black">
                {user.name}님
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-black">
                  로그인
                </Link>
                <Link to="/signup" className="text-sm font-medium text-gray-700 hover:text-black">
                  회원가입
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-full"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-4 shadow-lg">
          <form onSubmit={handleSearch} className="mb-4">
            <Input
              placeholder="검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <nav className="flex flex-col gap-4 text-base font-medium">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>홈</Link>
            <Link to="/products" onClick={() => setIsMenuOpen(false)}>상품</Link>
            <Link to="/cart" onClick={() => setIsMenuOpen(false)}>장바구니</Link>
            {isLoggedIn ? (
              <Link to="/mypage" onClick={() => setIsMenuOpen(false)}>마이페이지</Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>로그인</Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>회원가입</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
```

---

## 2. Footer 보강

### 2-1. src/app/components/layout/Footer.jsx 전체 교체

```jsx
import { Link, useLocation } from "react-router-dom";

export function Footer() {
  const location = useLocation();

  return (
    <footer className="border-t border-border bg-bg-muted py-12 text-sm text-text-muted">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="mb-4 text-lg font-bold text-primary">MALL</h3>
          <p className="leading-relaxed">
            고객의 행복을 최우선으로 생각하는<br />온라인 쇼핑몰입니다.
          </p>
        </div>
        <div>
          <h4 className="mb-4 font-bold text-primary">회사 정보</h4>
          <ul className="space-y-2">
            <li><Link to="/about" state={{ from: location.pathname }} className="hover:text-primary">회사 소개</Link></li>
            <li><Link to="/terms" state={{ from: location.pathname }} className="hover:text-primary">이용약관</Link></li>
            <li><Link to="/privacy" state={{ from: location.pathname }} className="hover:text-primary">개인정보처리방침</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-bold text-primary">고객센터</h4>
          <ul className="space-y-2">
            <li><Link to="/notice" state={{ from: location.pathname }} className="hover:text-primary">공지사항</Link></li>
            <li><Link to="/faq" state={{ from: location.pathname }} className="hover:text-primary">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-bold text-primary">연락처</h4>
          <p>1544-0000</p>
          <p>help@mall.com</p>
        </div>
      </div>
      <div className="container mx-auto mt-12 px-4 border-t border-border pt-8 text-center text-xs text-text-subtle">
        © 2024 MALL Corp. All rights reserved.
      </div>
    </footer>
  );
}
```

---

## 3. 확인

`pnpm dev` 실행 후:

1. 데스크톱: 중앙 검색창 입력 후 Enter → `/products?search=키워드` 이동
2. 모바일(또는 창 축소): 햄버거 메뉴 클릭 → 드롭다운 메뉴 표시
3. Footer 링크 클릭 시 ComingSoon 페이지 표시 (해당 라우트 없음)

---

## 4. 다음 단계

[05-homepage-slider.md](./05-homepage-slider.md)에서 api.js, JSON 데이터, HomePage를 구현합니다.

---

## 📖 강의 시 참고 – 핵심 개념

### 반응형 클래스 (md:, hidden, md:block)

- **breakpoint**: `md`는 보통 768px. `md:block` = 768px 이상에서 `display: block`.
- **hidden md:block**: 모바일에서는 숨김, 데스크톱에서 표시 (검색창·네비 등).
- **md:hidden**: 데스크톱에서는 숨김 (햄버거 버튼).

### useNavigate와 form submit

```jsx
const navigate = useNavigate();
const handleSearch = (e) => {
  e.preventDefault();
  if (searchQuery.trim()) {
    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
  }
};
```

- **encodeURIComponent**: 검색어에 특수문자(+, 공백 등)가 있어도 URL 안전하게 처리.
- **e.preventDefault()**: form 기본 제출(페이지 새로고침) 방지.

### Link의 state prop

```jsx
<Link to="/about" state={{ from: location.pathname }}>회사 소개</Link>
```

- **의미**: 이동 시 `location.state`로 데이터 전달. 돌아가기 시 `from` 경로 활용 가능.
- **useLocation()**: 현재 pathname, search, state 등 접근.

### sticky + z-50

- **sticky top-0**: 스크롤해도 상단에 고정.
- **z-50**: 다른 요소보다 위에 표시 (모달·드롭다운과의 레이어 순서).
