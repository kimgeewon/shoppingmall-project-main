# 10. 로그인·마이페이지 완성

> **목표**: LoginPage, SignupPage, MyPage, OrderHistoryPage, MagazinePage를 구현하여 프로젝트를 완성합니다.

## 1. LoginPage

### 1-1. src/app/pages/LoginPage.jsx 전체 교체

프로젝트의 `src/app/pages/LoginPage.jsx`를 복사합니다.

핵심 동작:

- `react-hook-form`으로 이메일·비밀번호 검증
- `api.login()` 호출 후 성공 시 `useStore().login(user)` 호출
- `?redirect=/checkout` 등 redirect 파라미터 처리
- 실패 시 에러 메시지 표시

테스트 계정: `test@test.com` / `test1234`

---

## 2. SignupPage

### 2-1. src/app/pages/SignupPage.jsx 전체 교체

프로젝트의 `src/app/pages/SignupPage.jsx`를 복사합니다.

핵심 동작:

- `api.signup()` 호출
- 성공 시 `login()` 후 홈 또는 redirect로 이동
- 중복 이메일 시 에러 메시지 표시

---

## 3. MyPage

### 3-1. src/app/pages/MyPage.jsx 전체 교체

프로젝트의 `src/app/pages/MyPage.jsx`를 복사합니다.

핵심 동작:

- `useStore().user`, `isLoggedIn` 확인
- 비로그인 시 로그인 유도 + 로그인 버튼
- 로그인 시: 프로필, 최근 주문(2건), 마이페이지 메뉴(주문/배송 조회 등)

---

## 4. OrderHistoryPage

### 4-1. src/app/pages/OrderHistoryPage.jsx 전체 교체

프로젝트의 `src/app/pages/OrderHistoryPage.jsx`를 복사합니다.

핵심 동작:

- `api.getOrders()`로 주문 내역 조회
- 주문 카드(날짜, 상품, 금액, 상태) 표시

---

## 5. MagazinePage

### 5-1. src/app/pages/MagazinePage.jsx 전체 교체

프로젝트의 `src/app/pages/MagazinePage.jsx`를 복사합니다.

핵심 동작:

- `api.getMagazineArticles()` 호출
- 매거진 목록 그리드 표시
- 클릭 시 `/magazine/:id` (ComingSoon 또는 상세 페이지)

---

## 6. ProductCard - CartModal 연동

05에서 만든 ProductCard에 CartModal을 추가합니다. 프로젝트의 `ProductCard.jsx`를 참고하세요.

```jsx
// ProductCard 내부
const [isModalOpen, setIsModalOpen] = useState(false);

// handleAddToCart 내부에서
addToCart({ ... });
setIsModalOpen(true);

// JSX 하단에
<CartModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  productName={product.name}
  productImage={product.image}
  productPrice={product.price}
/>
```

---

## 7. Header - 로그아웃

프로젝트의 `Header.jsx`에는 로그아웃 버튼과 `MessageModal`이 포함되어 있습니다. 해당 파일을 그대로 사용하거나, 로그아웃 버튼과 모달 처리를 추가합니다.

---

## 8. 확인

`pnpm dev` 실행 후:

1. **로그인**: test@test.com / test1234 로 로그인
2. **회원가입**: 새 계정 생성 후 로그인
3. **마이페이지**: 로그인 후 프로필, 최근 주문 표시
4. **주문 내역**: `/my/orders`에서 주문 목록 확인
5. **매거진**: `/magazine`에서 매거진 목록 확인
6. **로그아웃**: 로그아웃 후 "로그아웃 되었습니다" 모달 표시

---

## 9. 프로젝트 완료

이제 빈 폴더에서 시작해 01~10까지 진행했다면, 현재 수준의 쇼핑몰 프로토타입이 완성되었습니다.

### 구현된 기능 요약

| 영역 | 기능 |
|------|------|
| 홈 | 히어로 배너, 퀵 카테고리, 인기 상품, 시즌 추천, 매거진 |
| 상품 | 목록(필터), 상세, 장바구니 담기 |
| 장바구니 | 수량 변경, 삭제, 주문하기 |
| 주문 | 주문/결제, 주문 완료 |
| 회원 | 로그인, 회원가입, 마이페이지, 주문 내역 |
| 네비게이션 | 브레드크럼, 검색(최근/추천), 모바일 메뉴 |

### 추가 개선 아이디어

- 상품 상세 탭(상세 이미지, 필수 표기정보, 교환/반품)
- ProductListPage 고급 필터(가격 범위, 정렬)
- Magazine 상세 페이지
- Footer 링크 대상 페이지(이용약관, 개인정보처리방침 등)

---

## 📖 강의 시 참고 – 핵심 개념

### react-hook-form

- **역할**: 폼 상태, 유효성 검사, 제출 처리를 한 곳에서 관리.
- **패턴**: `register`, `handleSubmit`, `formState: { errors }` 사용.
- **이점**: `useState`를 여러 개 쓰지 않고, 불필요한 리렌더 감소.

### api.login / api.signup과 StoreContext

- **흐름**: api.login 성공 → `useStore().login(user)` 호출 → Context의 user state 갱신.
- **결과**: Header의 "OO님", MyPage 접근 등 전역에서 로그인 상태 반영.

### 비로그인 시 마이페이지

```jsx
if (!isLoggedIn) {
  return (
    <div>
      <p>로그인이 필요합니다.</p>
      <Link to="/login">로그인</Link>
    </div>
  );
}
```

- **패턴**: 인증 필요 페이지에서 초기에 분기. 로그인 유도 UI 표시.
