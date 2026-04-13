# 3단계: 디자인 시스템 구축

`css/variables.css`에 디자인 토큰(색상, 타이포그래피, 간격 등)을 정의합니다.

---

## 학습 목표

- 디자인 토큰의 개념과 중요성 이해
- CSS 변수(Custom Properties) 사용법
- 쇼핑몰 브랜드에 맞는 일관된 토큰 정의

---

## 실습 단계

### variables.css에 정의할 항목

- **색상**: `--color-primary`, `--color-secondary`(강조/세일), `--color-background`, `--color-foreground`, `--color-muted`, `--color-border`, `--color-card`
- **타이포**: `--font-family`, `--font-size-xs` ~ `--font-size-2xl`, `--font-weight-*`
- **간격**: `--spacing-xs` ~ `--spacing-2xl`
- **radius**: `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-full`
- **shadow**: `--shadow-sm`, `--shadow-md`
- **transition**: `--transition-fast`, `--transition-base`
- **breakpoint**(선택): `--bp-tablet`, `--bp-desktop`

쇼핑몰 프로젝트의 `css/style.css` 상단에 이미 `:root` 변수가 있다면, 이를 `variables.css`로 분리해 두고 `style.css`에서 `@import url("variables.css");` 하거나, HTML에서 링크로 불러옵니다.

---

## 체크리스트

- [ ] variables.css 생성 및 색상·타이포·간격 변수 정의
- [ ] style.css 또는 index.html에서 variables 로드
- [ ] 버튼·카드 등에서 var(--color-primary) 등 사용 가능한지 확인

---

**다음**: [05-step4-common-styles.md](./05-step4-common-styles.md) - 공통 스타일 작성
