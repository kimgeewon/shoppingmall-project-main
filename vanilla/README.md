# Vanilla 쇼핑몰

figma-make React 프로젝트를 **순수 HTML, CSS, JavaScript**로 구현한 버전입니다.
Tailwind CSS 대신 바닐라 CSS로 스타일을 그대로 구현했습니다.

## 문서 가이드

- **실습 가이드(처음부터 만들기)**: [practice-guide/00-practice-guide-index.md](../practice-guide/00-practice-guide-index.md) — 온라인 강의 플랫폼과 동일한 형식의 단계별 실습(00 인덱스, 01 개념, 02~11 단계, README-REVIEW)으로 쇼핑몰을 처음부터 완성하는 가이드입니다.

## 프로젝트 구조

```
vanilla/
├── index.html          # 홈페이지 (히어로, 퀵 카테고리, 인기/시즌 상품, 세일 배너)
├── products.html       # 상품 목록 (필터, 정렬, 검색)
├── product-detail.html # 상품 상세 (갤러리, 수량, 장바구니 담기, 탭)
├── cart.html           # 장바구니 (수량 변경, 삭제, 주문 요약)
├── checkout.html       # 주문/결제 (배송 정보, 결제 방법)
├── order-complete.html # 주문 완료
├── order-history.html  # 주문 내역
├── login.html          # 로그인
├── signup.html         # 회원가입
├── mypage.html         # 마이페이지
├── magazine.html       # 매거진
├── coming-soon.html    # 준비 중 페이지 (404 대체)
├── css/
│   ├── variables.css   # 디자인 토큰 (색상, 타이포)
│   ├── style.css       # Reset, 레이아웃, 헤더/푸터
│   ├── components.css  # 버튼, 카드, 배지, 폼, 모달 등
│   └── responsive.css  # 반응형 및 페이지별 스타일
├── data/
│   ├── products.json   # 상품 데이터
│   └── users.json     # 사용자 데이터 (로그인/회원가입)
├── js/
│   ├── app.js          # data-page 기반 단일 진입점
│   ├── icons.js        # 아이콘 유틸
│   ├── modules/
│   │   ├── utils.js    # 상품/카테고리/매거진 데이터, 포맷터
│   │   └── storage.js  # 장바구니/사용자/검색어 로컬 스토리지
│   ├── components/
│   │   ├── AppHeader.js
│   │   ├── AppFooter.js
│   │   └── ProductCard.js
│   └── pages/          # 페이지별 로직(main, products, cart, ...)
└── README.md
```

## 실행 방법

로컬에서 실행하려면 간단한 HTTP 서버가 필요합니다:

```bash
# vanilla 폴더에서
npx serve .

# 또는 프로젝트 루트에서
npx serve vanilla
```

브라우저에서 `http://localhost:3000` (또는 서버가 제공하는 URL)로 접속합니다.

> `file://` 프로토콜로 직접 열면 CORS 등으로 이미지/스크립트가 제대로 동작하지 않을 수 있습니다.

## 주요 기능

- **홈**: 히어로 슬라이더, 퀵 카테고리, 인기/시즌 상품, 세일 배너
- **상품 목록**: 카테고리/가격 필터, 정렬, 검색, URL 쿼리 반영
- **상품 상세**: 이미지 갤러리, 수량 선택, 장바구니 담기, 바로 구매, 상세정보/리뷰 탭, 관련 상품
- **장바구니**: 수량 변경, 삭제, 50,000원 이상 무료배송, 주문 요약 → 주문하기(결제 페이지 이동)
- **주문/결제**: 주문 상품, 배송 정보, 결제 방법(신용카드/무통장/계좌이체)
- **주문 완료**: 주문번호, 결제금액, 주문 내역/쇼핑 계속하기 버튼
- **주문 내역**: 주문 목록, 배송조회, 교환/반품
- **로그인/회원가입**: 폼 유효성 검사, 성공 모달
- **마이페이지**: 프로필, 쿠폰/포인트/관심상품, 최근 주문 내역
- **매거진**: 기사 그리드, READ MORE 링크
- **준비 중**: 미구현 페이지 대체, 이전 페이지/홈으로 버튼
- **공통**: 검색, 장바구니 카운트(localStorage), 이벤트 위임, 로그인/회원가입/매거진 헤더 링크

## 스타일

figma-make React 프로젝트의 Tailwind 클래스를 바닐라 CSS로 변환했습니다.

- **variables.css**: 디자인 토큰 (--color-primary, --gray-*, --orange-* 등). style.css에서 `@import url('variables.css');` 로 로드합니다.
- **components.css**: Button/Badge/ProductCard 등 컴포넌트 스타일
- **responsive.css**: 반응형 breakpoints (sm 640px, md 768px, lg 1024px, xl 1280px)

## JSDoc에서 자주 쓰는 표준 태그

### 파일/모듈

- @fileoverview - 파일 전체 설명
- @module - 모듈 이름
- @description / @desc - 설명

### 타입/구조

- **@typedef** – 사용자 정의 타입

- **@type** – 변수·반환값 타입

- **@property** / **@prop** – 객체 속성

- **@callback** – 콜백 함수 타입

- **@extends** – 상속 대상

- **@implements** – 구현하는 인터페이스

### **함수/메서드**

- **@param** / **@arg** / **@argument** – 매개변수 (이름, 타입, 설명)

- **@returns** / **@return** – 반환값

- **@throws** / **@exception** – 던지는 예외

- **@yields** – 제너레이터가 yield하는 값

### **클래스/멤버**

- **@class** / **@constructor** – 클래스/생성자

- **@member** / **@var** – 멤버 변수

- **@method** – 메서드

- **@static** – 정적 멤버

- **@abstract** – 추상

- **@override** – 오버라이드

### **기타**

- **@deprecated** – deprecated 표시

- **@example** – 사용 예시 코드

- **@see** – 참고할 대상(링크·이름)

- **@ignore** – 문서에서 제외

- **@global** – 전역

- **@inner** – 내부(비공개) 멤버

- **@readonly** – 읽기 전용

- **@constant** / **@const** – 상수

