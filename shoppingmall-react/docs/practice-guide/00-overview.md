# 00. 프로젝트 개요

> **빈 폴더에서 시작**하여 01~10을 순서대로 진행하면, 현재 수준의 쇼핑몰 프로토타입을 완성할 수 있습니다.

## 1. 프로젝트 소개

이 프로젝트는 **이커머스 쇼핑몰 UI/UX 프로토타입**입니다. Figma 디자인을 기반으로 React로 구현되었으며, 실제 서버 없이 `localStorage`/`sessionStorage`와 JSON 데이터를 사용해 프로토타입 수준의 사용자 경험을 제공합니다.

### 핵심 특징

- **SPA(Single Page Application)**: React Router 기반 라우팅
- **반응형 UI**: Tailwind CSS + breakpoint 활용
- **프로토타입 데이터**: `public/data/`의 JSON 파일 활용
- **클라이언트 저장소**: 로그인, 장바구니를 localStorage/sessionStorage로 시뮬레이션

## 2. 기술 스택

| 영역 | 기술 | 용도 |
|------|------|------|
| 프레임워크 | React 19 | UI 컴포넌트 |
| 빌드 | Vite 6 | 개발 서버, 번들링 |
| 스타일 | Tailwind CSS v4 | 유틸리티 클래스, `@theme` |
| 라우팅 | React Router v6 | SPA 네비게이션 |
| 폼 | react-hook-form | 폼 검증, 제출 처리 |
| 아이콘 | lucide-react | 아이콘 컴포넌트 |
| 슬라이더 | react-slick | 배너/상품 캐러셀 |

## 3. 주요 페이지

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | HomePage | 히어로 배너, 퀵 카테고리, 인기 상품, 매거진 |
| `/products` | ProductListPage | 상품 그리드, 카테고리/태그/검색 필터 |
| `/product-detail` | ProductDetailPage | 상품 상세, 이미지, 탭바 |
| `/cart` | CartPage | 장바구니 목록, 수량 변경 |
| `/checkout` | CheckoutPage | 주문/결제 정보 입력 |
| `/order-complete` | OrderCompletePage | 주문 완료 안내 |
| `/login` | LoginPage | 로그인 폼 |
| `/signup` | SignupPage | 회원가입 폼 |
| `/mypage` | MyPage | 마이페이지 대시보드 |
| `/my/orders` | OrderHistoryPage | 주문 내역 |
| `/magazine` | MagazinePage | 매거진 목록 |
| `*` | ComingSoonPage | 404 및 준비 중 페이지 |

## 4. 학습 로드맵

```
00-overview (현재)
    ↓
01-environment-setup  →  프로젝트 실행
    ↓
02-project-structure  →  폴더/파일 구조 이해
    ↓
03-design-system  →  테마, 컬러, 컴포넌트
    ↓
04-layout-basic  →  Header, Footer, Layout
    ↓
05-homepage-slider  →  배너, 슬라이더
    ↓
06-product-card-list  →  상품 카드, 목록
    ↓
07-product-detail  →  상품 상세
    ↓
08-cart-checkout  →  장바구니·주문
    ↓
09-navigation-patterns  →  브레드크럼, 검색
    ↓
10-state-management  →  Context, 전역 상태
```

## 5. Figma 원본

Figma 디자인 파일: [쇼핑몰 Figma](https://www.figma.com/design/qMpQk5FqpK4cVcDpgdlbTQ/%EC%87%BC%ED%95%91%EB%AA%B0)

디자인과 코드를 병행하며 학습하면 UI/UX 프로토타입 제작 흐름을 이해하기 쉽습니다.

---

## 📖 강의 시 참고 – 핵심 개념

### SPA (Single Page Application)

- **개념**: 페이지 전체를 새로고침하지 않고, JavaScript가 DOM을 갱신해 화면을 바꿈.
- **이점**: 빠른 전환, 애플리케이션처럼 자연스러운 UX.
- **구현**: React Router의 `<Link>`, `navigate()`로 경로만 바꾸고, 해당 Route 컴포넌트만 교체.

### 프로토타입 vs 프로덕션

- **프로토타입**: 실제 서버·DB 없이, `localStorage`/`sessionStorage` + JSON으로 동작 시뮬레이션.
- **프로덕션**: REST API, DB, 인증 등 백엔드 연동 필요. 이 실습은 프로토타입 단계.

### 디자인 시스템

- **용어**: 디자인 토큰(컬러, 폰트, 간격 등)을 변수로 정리해, 일관된 UI 유지.
- **Tailwind @theme**: `--color-primary` 같은 CSS 변수를 정의하고, `text-primary` 등으로 사용.
