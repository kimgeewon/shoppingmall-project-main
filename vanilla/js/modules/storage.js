/**
 * @fileoverview 장바구니·최근 검색어·데이터는 로컬 스토리지, 로그인 사용자는 세션 스토리지 API.
 * @module modules/storage
 */

const CART_KEY = "mall_cart";
const USER_KEY = "user";
const RECENT_KEY = "recentSearches";
const PRODUCTS_KEY = "mall_products";
const USERS_KEY = "mall_users";
const PROJECT_KEY = "mall_project";

/**
 * @param {string} key - 스토리지 키
 * @param {*} fallback - 파싱 실패 또는 없을 때 반환값
 * @returns {*} 저장된 값 또는 fallback
 */
function readStorage(key, fallback) {
 try {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
 } catch (error) {
  console.error("[Storage] 로컬 스토리지 읽기 실패:", error);
  return fallback;
 }
}

/**
 * @param {string} key - 스토리지 키
 * @param {*} value - 저장할 값 (JSON 직렬화)
 */
function writeStorage(key, value) {
 try {
  localStorage.setItem(key, JSON.stringify(value));
 } catch (error) {
  console.error("[Storage] 로컬 스토리지 저장 실패:", error);
 }
}

/** @returns {Array} 상품 목록 (로컬스토리지) */
function getProducts() {
 return readStorage(PRODUCTS_KEY, []);
}

/**
 * @param {Array} arr - 상품 배열
 */
function setProducts(arr) {
 writeStorage(PRODUCTS_KEY, Array.isArray(arr) ? arr : []);
}

/** @returns {Array} 사용자 목록 (로컬스토리지, 로그인 검증용) */
function getUsers() {
 return readStorage(USERS_KEY, []);
}

/**
 * @param {Array} arr - 사용자 배열
 */
function setUsers(arr) {
 writeStorage(USERS_KEY, Array.isArray(arr) ? arr : []);
}

/** @returns {Array} 이벤트/기획전 목록 (로컬스토리지, data/project.json) */
function getProject() {
 return readStorage(PROJECT_KEY, []);
}

/**
 * @param {Array} arr - 이벤트/기획전 배열
 */
function setProject(arr) {
 writeStorage(PROJECT_KEY, Array.isArray(arr) ? arr : []);
}

/** @returns {Array} 장바구니 아이템 배열 */
function getCart() {
 return readStorage(CART_KEY, []);
}

/**
 * @param {Array} cart - 장바구니 배열
 */
function setCart(cart) {
 writeStorage(CART_KEY, cart);
 updateCartCount();
}

/**
 * 장바구니에 상품 추가
 * @param {Object} product - 상품 객체 (id, name, price, image)
 * @param {number} [quantity=1] - 수량
 */
function addToCart(product, quantity) {
 quantity = quantity || 1;
 const cart = getCart();
 const productId = String(product.id);
 const existing = cart.find(
  (item) => item.productId === productId && (!item.option || item.option === "기본")
 );

 if (existing) {
  existing.quantity += quantity;
 } else {
  cart.push({
   id: `cart_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
   productId,
   name: product.name,
   price: product.price,
   image: product.image,
   quantity,
   option: "기본",
  });
 }

 setCart(cart);
}

/**
 * @param {string} itemId - 장바구니 아이템 ID
 */
function removeFromCart(itemId) {
 const filtered = getCart().filter((item) => item.id !== itemId);
 setCart(filtered);
}

/**
 * @param {string} itemId - 장바구니 아이템 ID
 * @param {number} delta - 수량 증감
 */
function updateQuantity(itemId, delta) {
 const cart = getCart().map((item) => {
  if (item.id === itemId) {
   const next = Math.max(1, item.quantity + delta);
   return Object.assign({}, item, { quantity: next });
  }
  return item;
 });
 setCart(cart);
}

function clearCart() {
 setCart([]);
}

/** @returns {number} 장바구니 총 수량 */
function updateCartCount() {
 const totalItems = getCart().reduce((sum, item) => sum + item.quantity, 0);
 document.querySelectorAll(".cart-count").forEach((el) => {
  el.textContent = totalItems;
  el.classList.toggle("is-visible", totalItems > 0);
 });

 const headers = document.querySelectorAll("app-header");
 headers.forEach((header) => {
  if (typeof header.updateCartCount === "function") {
   header.updateCartCount(totalItems);
  }
 });

 return totalItems;
}

/** @returns {Object|null} 현재 로그인 사용자 (세션 스토리지) 또는 null */
function getCurrentUser() {
 try {
  const raw = sessionStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
 } catch (error) {
  console.error("[Storage] 세션 스토리지 사용자 읽기 실패:", error);
  return null;
 }
}

/**
 * 로그인 사용자 저장 (세션 스토리지). null이면 삭제.
 * @param {Object|null} user - 사용자 객체
 */
function setCurrentUser(user) {
 try {
  if (user == null) {
   sessionStorage.removeItem(USER_KEY);
  } else {
   sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
 } catch (error) {
  console.error("[Storage] 세션 스토리지 사용자 저장 실패:", error);
 }
}

/** 로그아웃: 세션 스토리지 사용자 삭제 후 헤더 갱신 */
function logoutCurrentUser() {
 sessionStorage.removeItem(USER_KEY);
 const headers = document.querySelectorAll("app-header");
 headers.forEach((header) => {
  if (typeof header.refreshAuthState === "function") {
   header.refreshAuthState();
  }
 });
}

/** @returns {string[]} 최근 검색어 배열 */
function getRecentSearches() {
 return readStorage(RECENT_KEY, []);
}

/**
 * @param {string} term - 검색어
 */
function saveRecentSearch(term) {
 if (!term) return;
 const prev = getRecentSearches().filter((t) => t !== term);
 writeStorage(RECENT_KEY, [term].concat(prev).slice(0, 10));
}

/**
 * @param {string} term - 삭제할 검색어
 */
function removeRecentSearch(term) {
 const filtered = getRecentSearches().filter((t) => t !== term);
 writeStorage(RECENT_KEY, filtered);
}

function clearRecentSearches() {
 writeStorage(RECENT_KEY, []);
}

const storageAPI = {
 getProducts,
 setProducts,
 getUsers,
 setUsers,
 getProject,
 setProject,
 getCart,
 setCart,
 addToCart,
 removeFromCart,
 updateQuantity,
 clearCart,
 updateCartCount,
 getCurrentUser,
 setCurrentUser,
 logoutCurrentUser,
 getRecentSearches,
 saveRecentSearch,
 removeRecentSearch,
 clearRecentSearches,
};

if (typeof window !== "undefined") {
 window.AppStorage = storageAPI;
 window.App = window.App || {};
 Object.assign(window.App, storageAPI);
}

export {
 getProducts,
 setProducts,
 getUsers,
 setUsers,
 getProject,
 setProject,
 getCart,
 setCart,
 addToCart,
 removeFromCart,
 updateQuantity,
 clearCart,
 updateCartCount,
 getCurrentUser,
 setCurrentUser,
 logoutCurrentUser,
 getRecentSearches,
 saveRecentSearch,
 removeRecentSearch,
 clearRecentSearches,
 storageAPI,
};
