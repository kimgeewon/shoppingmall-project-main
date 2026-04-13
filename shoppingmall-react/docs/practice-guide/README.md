# UI/UX 프로토타입 제작 실습 가이드

이 폴더에는 **빈 폴더에서 시작**하여, 단계별로 따라 하다 보면 현재 수준의 쇼핑몰 프로토타입을 완성할 수 있는 실습 문서가 포함되어 있습니다.

## 학습 경로

| 구분 | 설명 |
|------|------|
| **빈 폴더에서 시작** | 01번부터 순서대로 따라 하면 프로젝트를 처음부터 완성할 수 있습니다. |
| **기존 프로젝트 참고** | 이미 완성된 프로젝트를 열어 두고, 각 문서를 읽으며 구조와 패턴을 이해할 수 있습니다. |

## 학습 목표

- **디자인 시스템** 이해 및 적용 (컬러, 타이포그래피, 컴포넌트)
- **반응형 레이아웃** 구현 (Header, Footer, 모바일 메뉴)
- **사용자 플로우** 설계 및 구현 (홈 → 상품 → 장바구니 → 주문)
- **네비게이션 패턴** (브레드크럼, 검색, 라우팅)
- **전역 상태 관리** (Context)를 활용한 프로토타입 데이터 처리

## 문서 구성

| 단계 | 문서 | 실습 내용 | 완료 시 결과 |
|------|------|----------|--------------|
| 0 | [00-overview.md](./00-overview.md) | 프로젝트 개요 | - |
| 1 | [01-environment-setup.md](./01-environment-setup.md) | 프로젝트 생성, 의존성, 기본 설정 | 화면에 Vite + React 앱 표시 |
| 2 | [02-project-structure.md](./02-project-structure.md) | App 구조, 라우팅, 플레이스홀더 페이지 | 페이지 간 라우팅 동작 |
| 3 | [03-design-system.md](./03-design-system.md) | 테마, 스타일, Button/Input | 디자인 토큰 적용 |
| 4 | [04-layout-basic.md](./04-layout-basic.md) | Layout, Header, Footer | 공통 레이아웃 적용 |
| 5 | [05-homepage-slider.md](./05-homepage-slider.md) | API, JSON 데이터, HomePage | 홈 배너·상품 슬라이더 |
| 6 | [06-product-card-list.md](./06-product-card-list.md) | ProductCard, ProductListPage | 상품 목록·필터 |
| 7 | [07-product-detail.md](./07-product-detail.md) | ProductDetailPage | 상품 상세 페이지 |
| 8 | [08-cart-checkout.md](./08-cart-checkout.md) | StoreContext, Cart, Checkout | 장바구니·주문 플로우 |
| 9 | [09-navigation-patterns.md](./09-navigation-patterns.md) | Breadcrumb, 검색, 모바일 메뉴 | 네비게이션 UX |
| 10 | [10-state-management.md](./10-state-management.md) | 로그인, 회원가입, 마이페이지 | 사용자 인증·마이페이지 |

## 시작하기 (빈 폴더에서)

1. **01-environment-setup.md**를 열어 프로젝트 생성부터 진행합니다.
2. 각 문서의 **실습 단계**를 순서대로 진행합니다.
3. **확인** 섹션에서 기대 결과를 확인합니다.
4. `pnpm dev`를 실행하며 단계별로 화면을 확인합니다.

## 선수 지식

- HTML, CSS 기초
- JavaScript (ES6+) 기초
- React 기초 (컴포넌트, useState, useEffect)

## 실행 환경

- Node.js 18+
- pnpm 9+ (권장) 또는 npm 9+

## 코드 이해

각 js/jsx 파일 상단에 JSDoc 주석으로 역할과 주요 개념을 설명해 두었습니다.  
전체 구조와 데이터 흐름은 [../CODE_GUIDE.md](../CODE_GUIDE.md)를 참고하세요.

## 📖 강의 진행 시 활용

각 실습 문서(00~10) 맨 아래에 **"강의 시 참고 – 핵심 개념"** 섹션이 있습니다.

| 내용 | 설명 |
|------|------|
| **개념 정리** | 해당 단계에서 등장하는 React·JavaScript·CSS 개념 요약 |
| **코드 설명** | 핵심 코드 블록의 동작 원리와 의도 |
| **주의사항** | 흔한 실수, 플랫폼별 차이(Windows/Mac), 의존성 순서 등 |

강의 중 "왜 이렇게 작성했는지", "이 코드는 어떤 역할을 하는지" 설명할 때 참고하면 됩니다.
