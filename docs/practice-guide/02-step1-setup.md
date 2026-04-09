# 1단계: 프로젝트 셋업

빈 폴더에서 시작하여 프로젝트 구조를 만들고 기본 파일을 생성합니다.

---

## 학습 목표

- 프로젝트 폴더 구조 이해
- 기본 HTML 파일 생성
- 로컬 서버 실행 방법 습득

---

## 실습 단계

### 1단계: 프로젝트 폴더 생성

1. 원하는 위치에 `shoppingmall/vanilla` 폴더 생성
2. VS Code로 해당 폴더 열기

### 2단계: 폴더 구조 만들기

```
shoppingmall/vanilla/
├── css/
├── js/
├── data/
└── docs/
```

### 3단계: index.html 생성

프로젝트 루트(`shoppingmall/vanilla`)에 `index.html`을 만들고 기본 구조를 작성합니다.

```html
<!DOCTYPE html>
<html lang="ko">
 <head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>온라인 쇼핑몰</title>
 </head>
 <body>
  <h1>온라인 쇼핑몰</h1>
  <p>실습 프로젝트를 시작합니다!</p>
 </body>
</html>
```

### 4단계: 로컬 서버 실행

- **Live Server**: index.html 우클릭 → Open with Live Server
- **Python**: `python -m http.server 8000` → `http://localhost:8000`
- **Node**: `npx serve .` 또는 `npx http-server -p 8000`

### 5단계: 브라우저 확인

"온라인 쇼핑몰"과 "실습 프로젝트를 시작합니다!" 메시지가 보이면 성공입니다.

---

## 추가 파일 생성

- **css/**: `variables.css`, `style.css`, `components.css`, `responsive.css` (빈 파일)
- **js/**: `app.js` (빈 파일)
- 7단계에서 `js/modules/`, `js/components/`, `js/pages/` 폴더를 만듭니다.

---

## 체크리스트

- [ ] `shoppingmall/vanilla` 폴더 및 `css/`, `js/`, `data/`, `docs/` 생성
- [ ] `index.html` 작성, 로컬 서버 실행 성공
- [ ] CSS·JS 빈 파일 생성

---

**다음**: [03-step2-html-main.md](./03-step2-html-main.md) - 메인 페이지 HTML 구조 작성
