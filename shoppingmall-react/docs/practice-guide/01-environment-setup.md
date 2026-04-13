# 01. 환경 설정 및 프로젝트 생성

> **목표**: 빈 폴더에서 Vite + React 프로젝트를 생성하고, 의존성을 설치한 뒤 실행 가능한 상태까지 만듭니다.

## 1. 사전 요구사항

- **Node.js** 18.x 이상
- **pnpm** 9.x (권장) 또는 **npm** 9.x

```bash
node -v   # v18.0.0 이상
npm -v    # 9.0.0 이상
```

Node.js 미설치 시: [nodejs.org](https://nodejs.org/)에서 LTS 버전 설치  
pnpm 설치: `npm install -g pnpm`

---

## 2. 프로젝트 생성

### 2-1. Vite로 React 프로젝트 생성

작업할 폴더(예: 바탕화면, 문서)로 이동한 뒤 실행합니다.

```bash
pnpm create vite shoppingmall-react --template react

# npm 사용 시
npm create vite@latest shoppingmall-react -- --template react
```

### 2-2. 프로젝트 폴더로 이동

```bash
cd shoppingmall-react
```

### 2-3. 기존 파일 정리

Vite가 만든 기본 파일 중 아래는 이 실습에서 교체하므로 삭제합니다.

- `src/App.jsx` (02에서 새로 작성)
- `src/App.css` (삭제)
- `src/index.css` (스타일은 `src/styles/`로 분리)

```bash
# Windows (PowerShell)
Remove-Item src/App.jsx, src/App.css
Remove-Item src/index.css -ErrorAction SilentlyContinue

# Mac/Linux
rm -f src/App.jsx src/App.css src/index.css
```

---

## 3. 의존성 설치

### 3-1. 프로덕션 의존성

```bash
pnpm add react-router-dom react-hook-form lucide-react clsx tailwind-merge
pnpm add react-slick slick-carousel
pnpm add @radix-ui/react-checkbox @radix-ui/react-slider tw-animate-css
```

### 3-2. 개발 의존성

```bash
pnpm add -D tailwindcss @tailwindcss/vite
pnpm add -D babel-plugin-react-compiler
```

> **참고**: `@vitejs/plugin-react`, `react`, `react-dom`, `vite`는 Vite 템플릿에 이미 포함되어 있습니다.

### 3-3. npm 사용 시

위 `pnpm add`를 `npm install`로, `pnpm add -D`를 `npm install -D`로 바꿔 실행합니다.

---

## 4. 설정 파일 수정

### 4-1. vite.config.js

기존 내용을 아래로 교체합니다.

```js
import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### 4-2. index.html

`<title>`을 쇼핑몰로 변경합니다.

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>쇼핑몰</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

## 5. 폴더 구조 생성

아래 폴더를 만듭니다.

```
src/
├── app/
│   ├── components/
│   │   ├── layout/
│   │   ├── modal/
│   │   ├── product/
│   │   └── ui/
│   ├── context/
│   └── pages/
├── lib/
└── styles/
```

```bash
# Windows (PowerShell)
New-Item -ItemType Directory -Force -Path src/app/components/layout, src/app/components/modal, src/app/components/product, src/app/components/ui, src/app/context, src/app/pages, src/lib, src/styles

# Mac/Linux
mkdir -p src/app/components/{layout,modal,product,ui} src/app/context src/app/pages src/lib src/styles
```

---

## 6. 기본 파일 생성

### 6-1. src/main.jsx

```jsx
import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";

createRoot(document.getElementById("root")).render(<App />);
```

### 6-2. src/app/App.jsx (최소 버전)

```jsx
export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-900">쇼핑몰</h1>
    </div>
  );
}
```

### 6-3. src/styles/index.css

```css
@import "./fonts.css";
@import "./tailwind.css";
```

### 6-4. src/styles/fonts.css

```css
@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css");
```

### 6-5. src/styles/tailwind.css

```css
@import "tailwindcss" source(none);
@source '../**/*.{js,ts,jsx,tsx}';
```

### 6-6. src/lib/utils.js

```js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
```

> **참고**: `theme.css`와 `components.css`는 03-design-system에서 추가합니다.

---

## 7. tailwind.css 보완

`src/styles/tailwind.css`를 아래처럼 수정합니다. (theme 없이도 동작합니다)

```css
@import "tailwindcss" source(none);
@source '../**/*.{js,ts,jsx,tsx}';
```

---

## 8. 실행 및 확인

```bash
pnpm dev
```

브라우저에서 `http://localhost:5173` 접속 시, 가운데에 **"쇼핑몰"** 텍스트가 보이면 성공입니다.

---

## 9. 다음 단계

[02-project-structure.md](./02-project-structure.md)에서 App 구조와 라우팅을 설정합니다.

---

## 📖 강의 시 참고 – 핵심 개념

### Vite란?

- **개념**: 빠른 개발 서버와 HMR(Hot Module Replacement)을 제공하는 번들러.
- **특징**: ES 모듈 기반, 변경 시 바로 반영, CRA보다 빠름.
- **강의 시**: "빌드 도구는 코드를 브라우저에서 실행 가능한 형태로 변환해 줍니다. Vite는 이 과정을 매우 빠르게 처리합니다."

### path alias (`@/`)

- **코드**: `resolve.alias: { "@": path.resolve(__dirname, "./src") }`
- **의미**: `@/`가 `src/`를 가리켜 `import { cn } from "@/lib/utils"`처럼 짧게 import 가능.
- **이점**: 폴더 구조가 바뀌어도 alias만 수정하면 됨.

### cn() 유틸리티

- **코드**: `cn(...inputs)` → `twMerge(clsx(inputs))`
- **역할**: 여러 Tailwind 클래스를 합치되, 충돌 시 뒤쪽 우선 적용.
- **예**: `cn("px-4", isActive && "px-6")` → 조건부 클래스 처리.

### ⚠️ 주의사항

- **Windows**: `Remove-Item` 명령은 PowerShell에서 실행. CMD는 문법이 다름.
- **의존성 순서**: `react-router-dom` 등은 02에서 사용하므로 01에서 먼저 설치.
