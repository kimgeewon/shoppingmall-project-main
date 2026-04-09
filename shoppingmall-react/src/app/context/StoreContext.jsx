/**
 * StoreContext - 전역 상태 (로그인 user, 장바구니 cart)
 *
 * 사용처: App.jsx(StoreProvider) | useStore: Header, ProductDetailPage, CartPage,
 *        LoginPage, ProductCard, CheckoutPage, OrderHistoryPage, MyPage
 *
 * 역할:
 * - user: 로그인한 사용자 정보 (id, name, email, avatar)
 * - cart: 장바구니 아이템 배열 [{ id, productId, name, price, quantity, ... }]
 * - login/logout: api.js와 연동해 sessionStorage에 저장
 * - addToCart/removeFromCart/updateQuantity/clearCart: api.js와 연동해 localStorage에 저장
 *
 * flushSync: React가 즉시 DOM을 반영하도록 해서, 장바구니 담기 후 헤더 뱃지가 바로 업데이트됨
 */
import { createContext, useState, useContext, useMemo, useEffect } from "react";
import { flushSync } from "react-dom";
import { useLocation } from "react-router-dom";
import * as api from "@/lib/api";

const StoreContext = createContext(undefined);

/** Provider 밖에서 useStore() 호출 시 반환할 기본값 (실수 방지용 경고 로그) */
const defaultContext = {
  user: null,
  isLoggedIn: false,
  login: () => console.warn("StoreProvider를 찾을 수 없습니다: login"),
  logout: () => console.warn("StoreProvider를 찾을 수 없습니다: logout"),
  cart: [],
  cartCount: 0,
  addToCart: () => console.warn("StoreProvider를 찾을 수 없습니다: addToCart"),
  removeFromCart: () => console.warn("StoreProvider를 찾을 수 없습니다: removeFromCart"),
  updateQuantity: () => console.warn("StoreProvider를 찾을 수 없습니다: updateQuantity"),
  clearCart: () => console.warn("StoreProvider를 찾을 수 없습니다: clearCart"),
};

export function StoreProvider({ children }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // 초기 로드: sessionStorage/localStorage에서 상태 복원
  useEffect(() => {
    const savedUser = api.getCurrentUser();
    const savedCart = api.getCart();
    if (savedUser) setUser(savedUser);
    setCart(savedCart);
    setIsHydrated(true);
  }, []);

  // ② 라우트가 바뀔 때: 다른 탭에서 로그아웃했거나, 장바구니가 변경됐을 수 있으므로 저장소와 동기화
  useEffect(() => {
    if (!isHydrated) return;
    const savedUser = api.getCurrentUser();
    if (savedUser && (!user || user.id !== savedUser.id)) {
      setUser(savedUser);
      setCart(api.getCart());
    } else if (!savedUser && user) {
      setUser(null);
      setCart(api.getCart());
    } else {
      // 로그인 상태 변화 없을 때도 장바구니를 localStorage에서 동기화
      setCart(api.getCart());
    }
  }, [location.pathname, isHydrated]);

  const login = (userData) => {
    setUser(userData);
    // 로그인 시 해당 유저의 장바구니 로드
    setCart(api.getCart());
  };

  const logout = () => {
    api.logout();
    setUser(null);
    setCart([]);
  };

  const addToCart = (newItem) => {
    try {
      const updated = api.addToCart(newItem); // api가 localStorage에 저장
      flushSync(() => setCart(updated)); // React state를 즉시 반영 (헤더 뱃지 업데이트)
    } catch (e) {
      console.error("장바구니 담기 실패:", e);
    }
  };

  const removeFromCart = (itemId) => {
    const updated = api.removeFromCart(itemId);
    flushSync(() => setCart(updated));
  };

  const updateQuantity = (itemId, delta) => {
    const updated = api.updateCartQuantity(itemId, delta);
    flushSync(() => setCart(updated));
  };

  const clearCart = () => {
    api.clearCart();
    flushSync(() => setCart([]));
  };

  /** 장바구니 총 개수 (수량 합산) - 헤더 뱃지 등에 사용 */
  const cartCount = useMemo(
    () => cart.reduce((acc, item) => acc + (item.quantity || 0), 0),
    [cart]
  );

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: !!user,
      isHydrated,
      login,
      logout,
      cart,
      cartCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [user, cart, cartCount, isHydrated]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

/** 전역 스토어 훅 - Provider 내부에서만 정상 동작 */
export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    return defaultContext; // Provider 바깥 호출 시 no-op 함수 반환
  }
  return context;
}
