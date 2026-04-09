# 온라인 쇼핑몰 - 처음부터 만들기 실습 가이드

이 문서는 **빈 폴더에서 시작하여** 온라인 쇼핑몰을 처음부터 완성하는 단계별 실습 가이드입니다.  
UI/UX 디자인 강의에서 학생들이 각 단계를 따라 하며 완전한 웹 애플리케이션을 만들 수 있도록 구성했습니다.

---

## 📋 실습 가이드 구성

| 단계 | 문서                                              | 내용                                     | 예상 시간 |
| ---- | ------------------------------------------------- | ---------------------------------------- | --------- |
| 0    | [필요 개념 정리](./01-concepts.md)                | UI/UX 핵심 개념, HTML/CSS/JS 기초        | 30분      |
| 1    | [프로젝트 셋업](./02-step1-setup.md)              | 폴더 구조, 기본 파일 생성                | 30분      |
| 2    | [메인 페이지 HTML](./03-step2-html-main.md)       | index.html 작성, 시맨틱 마크업           | 1시간     |
| 3    | [디자인 시스템 구축](./04-step3-design-system.md) | variables.css, 색상·타이포·간격 정의     | 1시간     |
| 4    | [공통 스타일 작성](./05-step4-common-styles.md)   | style.css, 레이아웃·헤더·푸터 스타일     | 1.5시간   |
| 5    | [컴포넌트 스타일](./06-step5-components.md)       | components.css, 버튼·상품 카드·폼 스타일 | 1.5시간   |
| 6    | [반응형 디자인](./07-step6-responsive.md)         | responsive.css, 모바일·태블릿·데스크톱   | 1시간     |
| 7    | [JavaScript 기초](./08-step7-js-basics.md)        | 데이터 구조, storage.js, utils.js        | 1시간     |
| 8    | [메인 페이지 기능](./09-step8-js-main.md)         | main.js, Swiper, 상품·매거진 렌더링      | 1.5시간   |
| 9    | [추가 페이지 작성](./10-step9-more-pages.md)      | products, product-detail, cart 등        | 2시간     |
| 10   | [최종 완성 및 테스트](./11-step10-final.md)       | 전체 기능 통합, 테스트                   | 1시간     |

**총 예상 시간**: 약 12~14시간

### 문서 현황

| 단계 | 문서                 | 상태              |
| ---- | -------------------- | ----------------- |
| 0~4  | 01 ~ 05-step4        | ✅ 상세 작성 완료 |
| 5~10 | 06-step5 ~ 11-step10 | ✅ 상세 작성 완료 |

가이드만 따라 **현재 프로젝트를 완성**하려면 5~10단계 문서를 순서대로 진행하세요.  
전체 검토 결과는 [README-REVIEW.md](./README-REVIEW.md)를 참고하세요.

---

## 🎯 학습 목표

### 기술 역량

- **HTML**: 시맨틱 마크업, 접근성 고려한 구조 설계
- **CSS**: 디자인 시스템, 컴포넌트 기반 스타일, 반응형 레이아웃
- **JavaScript**: 모듈화, 데이터 관리(localStorage), DOM 조작, 이벤트 처리

### UI/UX 역량

- 디자인 토큰으로 일관성 유지
- 사용자 중심 인터페이스 설계 (쇼핑 플로우: 상품 탐색 → 장바구니 → 결제)

---

## 📁 완성 후 프로젝트 구조

```
shoppingmall/vanilla/
├── index.html              # 메인 페이지
├── products.html           # 상품 목록
├── product-detail.html     # 상품 상세
├── cart.html               # 장바구니
├── checkout.html           # 결제
├── order-complete.html     # 주문 완료
├── order-history.html      # 주문 내역
├── login.html, signup.html # 인증
├── mypage.html             # 마이페이지
├── magazine.html           # 매거진
├── coming-soon.html        # 준비 중
├── css/
│   ├── variables.css       # 디자인 토큰
│   ├── style.css           # 공통 스타일
│   ├── components.css      # 컴포넌트 스타일
│   └── responsive.css      # 반응형
├── js/
│   ├── app.js              # 앱 진입점 (data-page)
│   ├── components/         # (선택) AppHeader, AppFooter, ProductCard
│   ├── modules/            # api, storage, utils, modal
│   └── pages/              # main, products, product-detail, cart, ...
├── data/
│   ├── products.json       # 상품 데이터
│   └── users.json          # 사용자 데이터
└── practice-guide/         # 본 가이드 (shoppingmall/practice-guide)
```

---

## 💡 실습 진행 방법

1. **순서대로** 단계를 따라가세요.
2. 단계마다 **브라우저에서 확인**하세요.
3. **체크리스트**로 완료 여부 점검.

---

## 🚀 시작하기

[01-concepts.md](./01-concepts.md)에서 필요 개념을 확인한 뒤, [02-step1-setup.md](./02-step1-setup.md)부터 실습을 시작하세요.
