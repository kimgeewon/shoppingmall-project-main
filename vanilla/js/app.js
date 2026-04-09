/**
 * @fileoverview 쇼핑몰 앱 진입점 (ES Module). data-page에 따라 해당 페이지 모듈을 동적 import하여 init() 실행.
 * @module app
 *
 * 전역 window.App 네임스페이스는 utils.js, storage.js, ProductCard.js 로드 시 채워짐.
 * @typedef {Object} AppNamespace
 * @property {Array} [PRODUCTS] - 상품 목록
 * @property {Array} [CATEGORIES] - 카테고리 목록
 * @property {function(number): string} [formatPrice] - 가격 포맷
 * @property {function(Object): string} [createProductCard] - 상품 카드 HTML
 * @property {function(): Array} [getCart] - 장바구니 조회
 * @property {function(Array): void} [setCart] - 장바구니 저장
 * @property {function(Object, number): void} [addToCart] - 장바구니 담기
 * @property {function(string): void} [removeFromCart] - 장바구니 삭제
 * @property {function(string, number): void} [updateQuantity] - 수량 변경
 * @property {function(): void} [clearCart] - 장바구니 비우기
 * @property {function(): number} [updateCartCount] - 장바구니 개수 갱신
 * @property {function(string, string, number): void} [showCartModal] - 장바구니 모달 표시
 * @property {function(): Object|null} [getCurrentUser] - 현재 사용자
 * @property {function(Object|null): void} [setCurrentUser] - 사용자 저장
 * @property {function(): void} [logoutCurrentUser] - 로그아웃
 * @property {function(): string[]} [getRecentSearches] - 최근 검색어
 * @property {function(string): void} [saveRecentSearch] - 최근 검색어 저장
 * @property {function(string): void} [removeRecentSearch] - 최근 검색어 삭제
 * @property {function(): void} [clearRecentSearches] - 최근 검색어 전체 삭제
 * @property {function(): Array} [getProducts] - 상품 목록 (로컬스토리지)
 * @property {function(Array): void} [setProducts] - 상품 목록 저장
 * @property {function(): Array} [getUsers] - 사용자 목록 (로컬스토리지)
 * @property {function(Array): void} [setUsers] - 사용자 목록 저장
 * @property {function(): Array} [getProject] - 이벤트/기획전 목록 (로컬스토리지)
 * @property {function(Array): void} [setProject] - 이벤트/기획전 저장
 * @property {Array} [PROJECT] - 이벤트/기획전 (앱 초기화 시 getProject()로 주입)
 */

import "./icons.js";
import "./modules/utils.js";
import "./modules/storage.js";
import "./components/ProductCard.js";
import "./components/AppHeader.js";
import "./components/AppFooter.js";

/** @type {Record<string, string>} 페이지 이름 → 스크립트 파일명 매핑 */
const PAGE_SCRIPTS = {
 main: "main",
 products: "products",
 "product-detail": "product-detail",
 cart: "cart",
 checkout: "checkout",
 login: "login",
 signup: "signup",
 mypage: "mypage",
 "order-history": "order-history",
 "order-complete": "order-complete",
 magazine: "magazine",
 "coming-soon": "coming-soon",
};

/**
 * 현재 페이지 식별 (data-page 속성 또는 URL 경로 기준)
 * @returns {string} 페이지 키 (main, products, cart 등)
 */
function detectCurrentPage() {
 const script = document.querySelector("script[data-page]");
 if (script?.dataset?.page) return script.dataset.page;

 const path = window.location.pathname;
 const filename = path.split("/").pop().replace(".html", "");
 /** @type {Record<string, string>} */
 const pageMap = {
  index: "main",
  "": "main",
  products: "products",
  "product-detail": "product-detail",
  cart: "cart",
  checkout: "checkout",
  login: "login",
  signup: "signup",
  mypage: "mypage",
  "order-history": "order-history",
  "order-complete": "order-complete",
  magazine: "magazine",
  "coming-soon": "coming-soon",
 };
 return pageMap[filename] || "main";
}

/**
 * data/ JSON을 로컬스토리지에 없으면 fetch 후 저장 (최초 1회 시드)
 */
async function seedDataFromJsonIfNeeded() {
 const App = window.App;
 if (!App || !App.setProducts) return;

 const products = App.getProducts();
 if (!products || products.length === 0) {
  try {
   const res = await fetch("data/products.json");
   if (res.ok) {
    const data = await res.json();
    if (Array.isArray(data)) App.setProducts(data);
   }
  } catch (e) {}
 }

 const users = App.getUsers();
 if (!users || users.length === 0) {
  try {
   const res = await fetch("data/users.json");
   if (res.ok) {
    const data = await res.json();
    if (Array.isArray(data)) App.setUsers(data);
   }
  } catch (e) {}
 }

 const project = App.getProject();
 if (!project || project.length === 0) {
  try {
   const res = await fetch("data/project.json");
   if (res.ok) {
    const data = await res.json();
    if (Array.isArray(data)) App.setProject(data);
   }
  } catch (e) {}
 }
}

/** 앱 초기화: 로컬스토리지 시드 후 데이터 주입, 페이지 모듈 init() 실행 */
async function initializeApp() {
 try {
  const currentPage = detectCurrentPage();

  await seedDataFromJsonIfNeeded();

  window.App.PRODUCTS = window.App.getProducts();
  window.App.PROJECT = window.App.getProject();

  const pageName = PAGE_SCRIPTS[currentPage] || "main";
  const pageModule = await import(`./pages/${pageName}.js`);
  if (typeof pageModule.init === "function") {
   pageModule.init();
  } else {
   console.warn("[App] 페이지 모듈에 init이 없습니다:", currentPage);
  }
 } catch (error) {
  console.error("[App] 초기화 실패:", error);
 }
}

if (document.readyState === "loading") {
 document.addEventListener("DOMContentLoaded", initializeApp);
} else {
 initializeApp();
}
