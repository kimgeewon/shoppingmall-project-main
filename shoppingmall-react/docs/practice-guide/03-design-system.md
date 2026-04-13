# 03. 디자인 시스템

> **목표**: 테마(컬러, 폰트), 공통 스타일, Button·Input 컴포넌트를 추가합니다.

## 1. 테마 및 스타일

### 1-1. src/styles/theme.css 생성

```css
@theme {
  --font-sans: "Pretendard", ui-sans-serif, system-ui, sans-serif;

  --color-primary: #000000;
  --color-primary-dark: #333333;
  --color-primary-light: #666666;

  --color-secondary: #f97316;
  --color-secondary-dark: #ea580c;
  --color-secondary-light: #ffedd5;

  --color-text: #1a1a1a;
  --color-text-muted: #6b7280;
  --color-text-subtle: #9ca3af;
  --color-bg: #ffffff;
  --color-bg-muted: #f9fafb;
  --color-border: #e5e7eb;
  --color-border-light: #f3f4f6;

  --color-destructive: #ef4444;
  --color-destructive-muted: #fef2f2;
}

@layer base {
  body {
    font-family: var(--font-sans);
    background-color: var(--color-bg);
    color: var(--color-text);
  }
}
```

### 1-2. src/styles/components.css 생성

```css
@layer components {
  .page-container {
    @apply container mx-auto px-4 py-8;
  }

  .page-centered {
    @apply container mx-auto px-4 py-20 flex justify-center items-center min-h-[60vh];
  }

  .page-title {
    @apply text-3xl font-bold text-primary;
  }

  .page-subtitle {
    @apply text-2xl font-bold text-primary;
  }

  .text-label {
    @apply text-sm font-medium text-text;
  }

  .breadcrumb-nav {
    @apply flex items-center gap-2 text-sm text-text-subtle mb-8;
  }

  .card-form {
    @apply w-full max-w-md space-y-8 bg-bg p-8 rounded-xl shadow-lg border border-border-light;
  }

  .form-section {
    @apply space-y-4;
  }

  .form-row {
    @apply space-y-1;
  }
}
```

### 1-3. src/styles/tailwind.css 수정

기존 내용을 아래로 교체합니다.

```css
@import "tailwindcss" source(none);
@import "./theme.css";
@source '../**/*.{js,ts,jsx,tsx}';
@import "tw-animate-css";
```

### 1-4. src/styles/index.css 수정

```css
@import "./fonts.css";
@import "./tailwind.css";
@import "./components.css";
```

---

## 2. Button 컴포넌트

### 2-1. src/app/components/ui/Button.jsx 생성

```jsx
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-primary text-white hover:bg-primary-dark border border-primary disabled:opacity-50",
  outline:
    "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white disabled:opacity-50",
  secondary:
    "bg-secondary text-white hover:bg-secondary-dark border border-secondary disabled:opacity-50",
  ghost: "bg-transparent hover:bg-gray-100 text-primary",
  link: "underline text-primary hover:text-primary-dark",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export const Button = forwardRef(
  ({ className, variant = "primary", size = "md", fullWidth, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-lg transition-colors disabled:pointer-events-none",
          variants[variant] || variants.primary,
          sizes[size] || sizes.md,
          fullWidth && "w-full",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
```

---

## 3. Input 컴포넌트

### 3-1. src/app/components/ui/Input.jsx 생성

```jsx
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef(
  ({ className, type = "text", error, helperText, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <input
          ref={ref}
          type={type}
          className={cn(
            "flex h-10 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm",
            "placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus:ring-destructive",
            className
          )}
          {...props}
        />
        {helperText && (
          <p className={cn("text-xs", error ? "text-destructive" : "text-text-muted")}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
```

---

## 4. Layout·Footer에 테마 적용

### 4-1. src/app/components/layout/Layout.jsx 수정

`className`에 `text-primary` 추가:

```jsx
<div className="flex min-h-screen flex-col font-sans text-primary">
```

### 4-2. src/app/components/layout/Footer.jsx 수정

테마 클래스 적용:

```jsx
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-muted py-8 text-sm text-text-muted">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap gap-6 mb-4">
          <Link to="/" className="hover:text-primary">홈</Link>
          <Link to="/products" className="hover:text-primary">상품</Link>
          <Link to="/cart" className="hover:text-primary">장바구니</Link>
        </div>
        <p className="text-xs text-text-subtle">© 2024 MALL Corp.</p>
      </div>
    </footer>
  );
}
```

---

## 5. 확인

`pnpm dev` 실행 후:

1. 버튼 스타일: 로그인 페이지 등에 `<Button variant="primary">테스트</Button>` 추가 후 확인
2. Input 스타일: 로그인 폼 등에 `<Input placeholder="입력" />` 추가 후 확인
3. 페이지 전체에 Pretendard 폰트와 primary(검정) 컬러가 적용되는지 확인

---

## 6. 다음 단계

[04-layout-basic.md](./04-layout-basic.md)에서 Header를 보강하고 모바일 메뉴를 추가합니다.

---

## 📖 강의 시 참고 – 핵심 개념

### @theme (Tailwind v4)

- **개념**: `--color-primary`처럼 CSS 변수를 정의하면, `text-primary`, `bg-primary` 같은 유틸리티로 사용 가능.
- **이점**: 디자인 변경 시 theme.css만 수정하면 전체 앱에 반영.

### @theme 변수 = Tailwind 유틸리티 + 커스텀 CSS 공통 사용

`--color-*`, `--font-*` 변수는 **두 가지 방식**으로 사용됩니다.

| 사용처 | 예시 |
|--------|------|
| Tailwind 유틸리티 | `className="text-primary bg-primary"` → 내부적으로 `var(--color-primary)` 참조 |
| 커스텀 CSS / @layer base | `color: var(--color-text);`처럼 `var(--변수명)` 직접 사용 |

둘 다 같은 변수를 참조하므로, theme.css만 수정하면 유틸리티와 커스텀 CSS 모두에 일괄 반영됩니다.

### @layer base vs @layer components

- **base**: 전역 기본 스타일 (body, a 등).
- **components**: 재사용 클래스 (`.page-container`, `.card-form` 등). `@apply`로 Tailwind 유틸리티 조합.

### forwardRef

```jsx
const Button = forwardRef(({ className, variant, ...props }, ref) => {
  return <button ref={ref} className={...} {...props} />;
});
```

- **이유**: 부모가 `ref`를 넘겨 DOM에 접근할 수 있게 하려면 `forwardRef` 필요.
- **displayName**: React DevTools에서 `Button`으로 표시되도록 설정.

### ...props (나머지 props 전달)

```jsx
<button {...props} />
```

- **의미**: `disabled`, `onClick`, `type` 등 Button에 명시하지 않은 속성을 그대로 button에 전달.
- **확장성**: 새 HTML 속성을 추가로 지원할 때 컴포넌트 수정 없이 전달 가능.

### ⚠️ 주의사항

- **Tailwind v4**: `@import "tailwindcss" source(none);` 문법. v3과 다름.
- **Input error 상태**: `error` prop이 true면 focus ring 색상을 `destructive`로 변경해 시각적 피드백 제공.
