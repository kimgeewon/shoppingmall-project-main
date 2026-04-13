# 2단계: 메인 페이지 HTML 구조

`index.html`에 메인 페이지 HTML 구조를 작성합니다. 헤더(로고, 검색, 장바구니, 로그인), 히어로 배너, 인기 상품·시즌 추천 슬라이드, 매거진 영역, 푸터를 넣습니다.

---

## 학습 목표

- 시맨틱 HTML 태그 사용
- 섹션 기반 페이지 구조 설계
- 접근성을 고려한 마크업

---

## 실습 방향

1. **head**: Swiper CSS, `variables.css`, `style.css`, `components.css`, `responsive.css` 링크
2. **header**: `.header` > `.container` > 로고, 검색 폼, 장바구니 링크(.cart-count), 로그인/회원가입 링크, 모바일 메뉴 버튼
3. **main**: 히어로 Swiper 슬라이드, 인기 상품 섹션(`#popularProducts` + swiper 구조), 시즌 추천 섹션(`#seasonalProducts`), 매거진 섹션(`#magazinePreview`)
4. **footer**: 푸터 링크, 저작권
5. **script**: Swiper JS, `js/app.js` + `data-page="main"`

실제 마크업은 프로젝트의 `index.html` 전체를 참고하여 작성합니다. 섹션·id·클래스 패턴을 일관되게 두고, 상품·매거진 요소를 사용합니다.

---

## 체크리스트

- [ ] 헤더(로고, 검색, 장바구니, 로그인) 포함
- [ ] 히어로 배너(Swiper) 영역
- [ ] 인기 상품·시즌 추천 swiper-container 구조
- [ ] 매거진 미리보기 영역
- [ ] 푸터, `app.js` data-page="main" 스크립트

---

**다음**: [04-step3-design-system.md](./04-step3-design-system.md) - 디자인 시스템 구축
