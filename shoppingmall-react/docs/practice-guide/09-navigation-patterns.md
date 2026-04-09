# 09. 네비게이션 패턴

> **목표**: 각 페이지에 브레드크럼을 적용하고, Header 검색에 최근 검색어·추천 검색어를 추가합니다.

## 1. 브레드크럼 적용

06에서 만든 Breadcrumb를 아래 페이지에 적용합니다.

| 페이지 | items 예시 |
|--------|------------|
| CartPage | `[{ to: "/", label: "홈" }, { label: "장바구니" }]` |
| CheckoutPage | `[{ to: "/", label: "홈" }, { to: "/cart", label: "장바구니" }, { label: "주문/결제" }]` |
| OrderCompletePage | `[{ to: "/", label: "홈" }, { to: "/cart", label: "장바구니" }, { label: "주문완료" }]` |
| LoginPage | `[{ to: "/", label: "홈" }, { label: "로그인" }]` |
| SignupPage | `[{ to: "/", label: "홈" }, { to: "/login", label: "로그인" }, { label: "회원가입" }]` |
| MyPage | `[{ to: "/", label: "홈" }, { label: "마이페이지" }]` |
| OrderHistoryPage | `[{ to: "/", label: "홈" }, { to: "/mypage", label: "마이페이지" }, { label: "주문내역" }]` |
| MagazinePage | `[{ to: "/", label: "홈" }, { label: "매거진" }]` |

## 2. Header 검색 UX 보강

프로젝트의 `src/app/components/layout/Header.jsx`를 복사하여 다음을 적용합니다.

- **최근 검색어**: localStorage에 최대 10개 저장, 포커스 시 드롭다운 표시
- **추천 검색어**: 버튼 클릭 시 해당 검색으로 이동
- **외부 클릭 시 드롭다운 닫기**: `useRef` + `mousedown` 이벤트

## 3. Breadcrumb 사용법 참고

### 역할

- 현재 페이지의 계층 구조 표시
- 클릭 시 상위 페이지로 이동 가능

### 사용법

```jsx
import { Breadcrumb } from "../components/layout/Breadcrumb";

<Breadcrumb items={[
  { to: "/", label: "홈" },
  { to: "/products", label: "상품" },
  { to: "/products?category=electronics", label: "전자제품" },
  { label: "상품명" }  // 마지막은 현재 페이지 → 링크 없음
]} />
```

### items 구조

- `to`: 링크가 있으면 `Link`로 렌더링
- `label`: 표시 텍스트
- 마지막 항목은 `to` 없이 현재 페이지 표시

### 적용 페이지 예시

| 페이지 | items |
|--------|-------|
| 마이페이지 | 홈 > 마이페이지 |
| 주문내역 | 홈 > 마이페이지 > 주문내역 |
| 장바구니 | 홈 > 장바구니 |
| 주문/결제 | 홈 > 장바구니 > 주문/결제 |
| 상품상세 | 홈 > 상품 > [카테고리] > [상품명] |
| 로그인 | 홈 > 로그인 |
| 회원가입 | 홈 > 로그인 > 회원가입 |

## 4. 모바일 햄버거 메뉴

### 동작

- `md` breakpoint 미만: 햄버거 버튼 표시
- 클릭 시: 전체 화면 드롭다운 메뉴 (검색, 홈, 상품, 이벤트, 로그인 등)

```jsx
const [isMenuOpen, setIsMenuOpen] = useState(false);

<button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
  {isMenuOpen ? <X /> : <Menu />}
</button>

{isMenuOpen && (
  <div className="md:hidden ...">
    <nav>...</nav>
  </div>
)}
```

### 링크 클릭 시

메뉴를 닫기 위해 `onClick={() => setIsMenuOpen(false)}`를 Link에 추가합니다.

## 5. 검색 UX

### 최근 검색어

- `localStorage`에 최대 10개 저장
- 검색창 포커스 시 드롭다운으로 표시
- 클릭 시 해당 검색어로 이동
- X 버튼으로 개별 삭제, "전체 삭제" 지원

### 검색 실행

```jsx
navigate(`/products?search=${encodeURIComponent(term)}`);
```

### 외부 클릭 시 닫기

```jsx
const searchRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (e) => {
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setIsSearchFocused(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);
```

## 6. ScrollToTop

라우트 변경 시 스크롤을 상단으로 이동합니다.

```jsx
const { pathname } = useLocation();
useEffect(() => {
  window.scrollTo(0, 0);
}, [pathname]);
```

## 7. 확인

`pnpm dev` 실행 후 브레드크럼 링크, 검색 드롭다운, 모바일 메뉴가 정상 동작하는지 확인합니다.

## 8. 다음 단계

[10-state-management.md](./10-state-management.md)에서 로그인·회원가입·마이페이지·주문 내역을 완성합니다.

---

## 📖 강의 시 참고 – 핵심 개념

### 외부 클릭 감지 (click outside)

```jsx
const searchRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (e) => {
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setIsSearchFocused(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);
```

- **이유**: 검색창 밖을 클릭하면 드롭다운을 닫기 위함.
- **mousedown**: `click`보다 먼저 발생. 다른 요소가 클릭을 가로채기 전에 처리 가능.

### ref와 contains()

- **ref.current**: DOM 노드 참조. `ref.current.contains(e.target)` = 클릭한 요소가 ref 안에 있는지 확인.
- **null 체크**: `searchRef.current`가 null일 수 있으므로 반드시 체크.

### 최근 검색어 localStorage 패턴

- **저장**: 배열을 JSON으로 저장. 새 검색 시 앞에 추가, 중복 제거, 최대 10개 유지.
- **읽기**: `JSON.parse(localStorage.getItem("key"))` 후 배열로 사용.

1. `Breadcrumb.jsx`에서 `to`가 있는 항목만 `Link`로 렌더링되는지 확인
2. 모바일 뷰에서 햄버거 메뉴 열기 → 링크 클릭 시 메뉴 닫힘 확인
3. 검색창에 "노트북" 입력 후 검색 → 최근 검색어에 추가되는지 확인
