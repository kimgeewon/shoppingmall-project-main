/**
 * api.js - 로컬 API 서비스 (백엔드 없는 프로토타입용)
 *
 * 함수별 사용처:
 *   initData → main.jsx
 *   getProducts → HomePage, ProductListPage, ProductDetailPage
 *   getProductById → ProductDetailPage
 *   getCategories → ProductListPage
 *   getMagazineArticles → HomePage, MagazinePage
 *   login → LoginPage | logout, getCurrentUser → StoreContext
 *   signup → SignupPage | createOrder → CheckoutPage | getOrders → OrderHistoryPage, MyPage
 *   getCart, addToCart, removeFromCart, updateQuantity, clearCart → StoreContext (실제 호출은 CartPage, ProductCard, ProductDetailPage 등에서 useStore 통해)
 *
 * 저장소 구분:
 *   - sessionStorage: 로그인(user) - 탭 닫으면 자동 로그아웃
 *   - localStorage: 상품, 카테고리, 매거진, 유저목록, 장바구니, 주문 - 영구 저장
 *
 * 동작 흐름:
 *   1. initData(): public/data/*.json 을 fetch → localStorage에 저장
 *   2. getProducts 등: localStorage에서 읽어서 반환
 *   3. addToCart, login 등: localStorage/sessionStorage에 쓰기
 */

const STORAGE_KEYS = {
  USERS: "shopping_users",
  PRODUCTS: "shopping_products",
  CATEGORIES: "shopping_categories",
  MAGAZINE: "shopping_magazine",
  CURRENT_USER: "shopping_current_user",
  CART: "shopping_cart",
  ORDERS: "shopping_orders",
};

/** API 요청 시뮬레이션용 지연 (실제 백엔드 호출처럼 약간의 딜레이) */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** localStorage에서 JSON 파싱 (에러 시 null) */
function getStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** localStorage에 저장 */
function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/** sessionStorage에서 JSON 파싱 (에러 시 null) */
function getSessionStorage(key) {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** sessionStorage에 저장 */
function setSessionStorage(key, value) {
  if (value === null || value === undefined) {
    sessionStorage.removeItem(key);
  } else {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
}

/**
 * initData() - 앱 시작 시 public/data/ 아래 JSON을 fetch해서 localStorage에 저장
 * 사용처: main.jsx
 * - 상품/카테고리/매거진: 매번 덮어씀 (JSON 파일 수정 시 반영)
 * - 유저: 비어 있을 때만 시드 (회원가입으로 추가된 유저 보존)
 */
export async function initData() {
  const alwaysOverwrite = [
    { key: STORAGE_KEYS.PRODUCTS, url: "/data/products.json", prop: "products" },
    { key: STORAGE_KEYS.CATEGORIES, url: "/data/categories.json", prop: "categories" },
    { key: STORAGE_KEYS.MAGAZINE, url: "/data/magazine.json", prop: "articles" },
  ];
  const seedWhenEmpty = [
    { key: STORAGE_KEYS.USERS, url: "/data/users.json", prop: "users" },
  ];

  for (const { key, url, prop } of alwaysOverwrite) {
    try {
      const res = await fetch(url);
      const json = await res.json();
      const data = json[prop] ?? json;
      setStorage(key, data);
    } catch (e) {
      console.warn(`API init 실패: ${url}`, e);
    }
  }
  for (const { key, url, prop } of seedWhenEmpty) {
    if (!getStorage(key)) {
      try {
        const res = await fetch(url);
        const json = await res.json();
        const data = json[prop] ?? json;
        setStorage(key, data);
      } catch (e) {
        console.warn(`API init 실패: ${url}`, e);
      }
    }
  }
}

// ----- Products -----
/** 사용처: HomePage, ProductListPage, ProductDetailPage */
export async function getProducts() {
  await delay(100);
  const data = getStorage(STORAGE_KEYS.PRODUCTS);
  return data || [];
}

/** 사용처: ProductDetailPage */
export async function getProductById(id) {
  await delay(50);
  const products = getStorage(STORAGE_KEYS.PRODUCTS) || [];
  return products.find((p) => p.id === id) || null;
}

// ----- Categories -----
/** 사용처: ProductListPage */
export async function getCategories() {
  await delay(50);
  const data = getStorage(STORAGE_KEYS.CATEGORIES);
  return data || [];
}

// ----- Magazine -----
/** 사용처: HomePage, MagazinePage */
export async function getMagazineArticles() {
  await delay(100);
  const data = getStorage(STORAGE_KEYS.MAGAZINE);
  return data || [];
}

// ----- Auth -----
/**
 * mergeGuestCartIntoUser() - 로그인 시 비로그인 장바구니를 유저 장바구니로 합침
 * 예: 비로그인 시 담은 상품A 2개 + 로그인한 유저 기존 장바구니에 상품A 1개 → 상품A 3개
 */
function mergeGuestCartIntoUser(userId) {
  const guestCart = getStorage(STORAGE_KEYS.CART) || [];
  const userKey = `${STORAGE_KEYS.CART}_${userId}`;
  let userCart = getStorage(userKey) || [];
  if (!Array.isArray(guestCart)) return userCart;
  if (!Array.isArray(userCart)) userCart = [];

  for (const item of guestCart) {
    const productId = String(item.productId ?? "");
    const option = item.option ?? "기본";
    const qty = item.quantity || 1;
    const idx = userCart.findIndex(
      (i) => String(i.productId) === productId && (i.option ?? "기본") === option
    );
    if (idx >= 0) {
      userCart = [...userCart];
      userCart[idx] = {
        ...userCart[idx],
        quantity: (userCart[idx].quantity || 1) + qty,
      };
    } else {
      userCart = [
        ...userCart,
        {
          ...item,
          productId,
          option,
          id: item.id || `cart_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        },
      ];
    }
  }
  setStorage(userKey, userCart);
  setStorage(STORAGE_KEYS.CART, []); // 비로그인 장바구니 비우기
  return userCart;
}

/** 사용처: LoginPage */
export async function login(email, password) {
  await delay(500);
  const users = getStorage(STORAGE_KEYS.USERS) || [];
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (user) {
    const { password: _, ...safeUser } = user; // 비밀번호 제외 후 세션 저장 (보안)
    setSessionStorage(STORAGE_KEYS.CURRENT_USER, safeUser);
    mergeGuestCartIntoUser(safeUser.id); // 비로그인 장바구니 → 유저 장바구니 병합
    return safeUser;
  }
  return null;
}

/** 사용처: StoreContext, Header(useStore().logout) */
export function logout() {
  setSessionStorage(STORAGE_KEYS.CURRENT_USER, null);
}

/** 사용처: StoreContext, api 내부(getCartKey, createOrder, getOrders) */
export function getCurrentUser() {
  return getSessionStorage(STORAGE_KEYS.CURRENT_USER);
}

/** 사용처: SignupPage */
export async function signup(userData) {
  await delay(800);
  const users = getStorage(STORAGE_KEYS.USERS) || [];
  const exists = users.some((u) => u.email.toLowerCase() === userData.email.toLowerCase());
  if (exists) return { success: false, error: "이미 가입된 이메일입니다." };

  const newUser = {
    id: `user_${Date.now()}`,
    email: userData.email,
    password: userData.password,
    name: userData.name,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  };
  users.push(newUser);
  setStorage(STORAGE_KEYS.USERS, users);

  const { password: _, ...safeUser } = newUser;
  return { success: true, user: safeUser };
}

// ========== Cart ==========
/**
 * getCartKey() - 현재 사용자에 맞는 장바구니 키 반환
 * - 로그인: shopping_cart_user_1 (유저별 분리)
 * - 비로그인: shopping_cart (공통)
 */
function getCartKey() {
  const user = getCurrentUser();
  return user ? `${STORAGE_KEYS.CART}_${user.id}` : STORAGE_KEYS.CART;
}

/** 사용처: StoreContext */
export function getCart() {
  const cart = getStorage(getCartKey());
  return Array.isArray(cart) ? cart : [];
}

export function setCart(items) {
  setStorage(getCartKey(), items);
}

/** 사용처: StoreContext (ProductCard, ProductDetailPage에서 useStore().addToCart 호출) */
export function addToCart(item) {
  const key = getCartKey();
  let cart = getStorage(key) || [];
  if (!Array.isArray(cart)) cart = [];

  const productId = String(item.productId ?? "");
  const option = item.option ?? "기본";

  // 같은 상품+옵션 조합이 있으면 수량만 늘리고, 없으면 새 행 추가
  const existingIndex = cart.findIndex(
    (i) => String(i.productId) === productId && (i.option ?? "기본") === option
  );

  if (existingIndex >= 0) {
    cart = [...cart];
    cart[existingIndex] = {
      ...cart[existingIndex],
      quantity: cart[existingIndex].quantity + (item.quantity || 1),
    };
  } else {
    cart = [
      ...cart,
      {
        ...item,
        productId,
        option,
        id: item.id || `cart_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      },
    ];
  }
  setStorage(key, cart);
  return cart;
}

/** 사용처: StoreContext (CartPage에서 useStore().updateQuantity 호출) */
export function updateCartQuantity(itemId, delta) {
  const key = getCartKey();
  let cart = getStorage(key) || [];
  const idx = cart.findIndex((i) => i.id === itemId);
  if (idx < 0) return cart;
  cart = [...cart];
  const newQty = Math.max(1, (cart[idx].quantity || 1) + delta);
  cart[idx] = { ...cart[idx], quantity: newQty };
  setStorage(key, cart);
  return cart;
}

/** 사용처: StoreContext (CartPage에서 useStore().removeFromCart 호출) */
export function removeFromCart(itemId) {
  const key = getCartKey();
  let cart = getStorage(key) || [];
  cart = cart.filter((i) => i.id !== itemId);
  setStorage(key, cart);
  return cart;
}

/** 사용처: StoreContext, createOrder 내부 */
export function clearCart() {
  setStorage(getCartKey(), []);
  return [];
}

// ----- Orders -----
/** 사용처: CheckoutPage */
export async function createOrder(orderData) {
  await delay(800);
  const user = getCurrentUser();
  const cart = getCart();
  if (!user) return { success: false, error: "로그인이 필요합니다." };
  if (!cart.length) return { success: false, error: "장바구니가 비어있습니다." };

  const order = {
    id: `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(Date.now()).slice(-4)}`, // 예: ORD-20250211-1234
    userId: user.id,
    date: new Date().toISOString().slice(0, 10),
    status: "결제완료",
    items: cart.map((i) => ({
      productId: i.productId,
      name: i.name,
      image: i.image,
      price: i.price,
      quantity: i.quantity,
      option: i.option,
    })),
    total: orderData.total,
    shippingInfo: orderData.shippingInfo,
    paymentMethod: orderData.paymentMethod,
  };

  let orders = getStorage(STORAGE_KEYS.ORDERS) || [];
  orders = [...orders, order];
  setStorage(STORAGE_KEYS.ORDERS, orders);

  clearCart();

  return { success: true, order };
}

/** 사용처: OrderHistoryPage, MyPage */
export async function getOrders() {
  await delay(200);
  const user = getCurrentUser();
  const orders = getStorage(STORAGE_KEYS.ORDERS) || [];
  if (!user) return [];
  return orders.filter((o) => o.userId === user.id).reverse();
}
