import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { ImageWithFallback } from "../components/ui/ImageWithFallback";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { useStore } from "../context/StoreContext";
import { getOrders } from "@/lib/api";

/**
 * MyPage - 마이페이지
 *
 * 사용처: App.jsx (path="/mypage") | Header 로그인 시 "마이페이지" 링크
 */

/** 최근 주문 내역 표시 개수 - 같은 날 여러 건 결제해도 최대 2건만 표시 */
const RECENT_ORDERS_LIMIT = 2;

export const MyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn, isHydrated } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);

  const handleComingSoon = (path) => {
    navigate(path, { state: { from: location.pathname } });
  };

  useEffect(() => {
    if (!isHydrated) return;
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    let cancelled = false;
    async function load() {
      const orders = await getOrders();
      if (!cancelled) {
        setRecentOrders((orders || []).slice(0, RECENT_ORDERS_LIMIT)); // 최신순, 최대 2건
      }
      setIsLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [isHydrated, isLoggedIn, navigate]);

  if (isLoading || !isHydrated || !isLoggedIn) {
    return (
      <div className="page-container">
        <Breadcrumb items={[{ to: "/", label: "홈" }, { label: "마이페이지" }]} />
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 shrink-0 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
              <Skeleton className="h-6 w-24 mx-auto mb-2" />
              <Skeleton className="h-4 w-32 mx-auto mb-4" />
              <Skeleton className="h-8 w-full" />
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden h-64">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="p-4 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>
          </aside>
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-lg overflow-hidden h-40 p-4"
                  >
                    <div className="flex gap-4 h-full">
                      <Skeleton className="w-20 h-20 rounded-md" />
                      <div className="flex-1 space-y-2 py-2">
                        <Skeleton className="h-5 w-1/4" />
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Breadcrumb items={[{ to: "/", label: "홈" }, { label: "마이페이지" }]} />
      <h1 className="text-2xl font-bold mb-8">마이페이지</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
                👤
              </div>
            )}
            <h2 className="text-lg font-bold mb-1">{user?.name || "-"}님</h2>
            <p className="text-gray-500 text-xs mb-4">{user?.email || "-"}</p>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs h-8"
              onClick={() => handleComingSoon("/my/profile/edit")}
            >
              정보 수정
            </Button>
          </div>

          <nav className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 font-bold text-sm">
              마이 쇼핑
            </div>
            <ul className="text-sm">
              <li
                onClick={() => navigate("/my/orders")}
                className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer pl-3 pr-4 py-3 font-medium text-black border-l-4 border-l-black"
              >
                주문/배송 조회
              </li>
              <li
                onClick={() => handleComingSoon("/my/returns")}
                className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer pl-3 pr-4 py-3 text-gray-600 border-l-4 border-l-transparent"
              >
                취소/교환/반품
              </li>
              <li
                onClick={() => handleComingSoon("/my/wishlist")}
                className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer pl-3 pr-4 py-3 text-gray-600 border-l-4 border-l-transparent"
              >
                찜한 상품
              </li>
              <li
                onClick={() => handleComingSoon("/my/coupons")}
                className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer pl-3 pr-4 py-3 text-gray-600 border-l-4 border-l-transparent"
              >
                쿠폰함
              </li>
              <li
                onClick={() => handleComingSoon("/my/points")}
                className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer pl-3 pr-4 py-3 text-gray-600 border-l-4 border-l-transparent"
              >
                포인트
              </li>
            </ul>
          </nav>
        </aside>

        <div className="flex-1 space-y-8">
          <section>
            <h3 className="text-lg font-bold mb-4">나의 쇼핑 활동</h3>
            <div className="grid grid-cols-3 gap-4">
              <div
                onClick={() => handleComingSoon("/my/coupons")}
                className="border border-gray-200 rounded-lg p-5 text-center cursor-pointer hover:border-black transition-colors group bg-white shadow-sm"
              >
                <div className="text-sm text-gray-500 mb-1 group-hover:text-black">쿠폰</div>
                <div className="text-2xl font-bold text-gray-900 group-hover:text-black">
                  3<span className="text-sm font-normal text-gray-400 ml-1">장</span>
                </div>
              </div>
              <div
                onClick={() => handleComingSoon("/my/points")}
                className="border border-gray-200 rounded-lg p-5 text-center cursor-pointer hover:border-black transition-colors group bg-white shadow-sm"
              >
                <div className="text-sm text-gray-500 mb-1 group-hover:text-black">포인트</div>
                <div className="text-2xl font-bold text-gray-900 group-hover:text-black">
                  2,500
                  <span className="text-sm font-normal text-gray-400 ml-1">P</span>
                </div>
              </div>
              <div
                onClick={() => handleComingSoon("/my/wishlist")}
                className="border border-gray-200 rounded-lg p-5 text-center cursor-pointer hover:border-black transition-colors group bg-white shadow-sm"
              >
                <div className="text-sm text-gray-500 mb-1 group-hover:text-black">관심상품</div>
                <div className="text-2xl font-bold text-gray-900 group-hover:text-black">
                  12
                  <span className="text-sm font-normal text-gray-400 ml-1">개</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">최근 주문 내역</h3>
              <Button
                variant="link"
                className="text-sm text-gray-500 p-0 h-auto font-normal"
                onClick={() => navigate("/my/orders")}
              >
                더보기 &gt;
              </Button>
            </div>

            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <div className="border border-gray-200 rounded-lg p-12 text-center text-gray-500 bg-gray-50">
                  <p>최근 주문 내역이 없습니다.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => navigate("/products")}
                  >
                    쇼핑하러 가기
                  </Button>
                </div>
              ) : (
                recentOrders.map((order) => {
                  const firstItem = order.items?.[0];
                  const itemSummary =
                    order.items?.length > 1
                      ? `${firstItem?.name || ""} 외 ${order.items.length - 1}건`
                      : firstItem?.name || "상품";
                  const statusClass =
                    order.status === "결제완료" || order.status === "배송중"
                      ? "text-black font-bold"
                      : "text-gray-900 font-bold";

                  return (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <div className="text-sm font-medium text-gray-900">
                          {order.date?.replace(/-/g, ".") || order.date}
                          <span className="text-gray-300 mx-2">|</span>
                          주문번호 {order.id}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs bg-white"
                          onClick={() => handleComingSoon(`/my/orders/${order.id}`)}
                        >
                          주문상세
                        </Button>
                      </div>
                      <div className="p-4 flex gap-4">
                        <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border border-gray-200 bg-gray-100">
                          <ImageWithFallback
                            src={firstItem?.image}
                            alt={firstItem?.name || "상품"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`text-sm ${statusClass}`}>{order.status}</span>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1 truncate">{itemSummary}</h4>
                          <p className="text-sm text-gray-500 font-medium">
                            {order.total?.toLocaleString()}원
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 justify-center shrink-0">
                          <Button
                            size="sm"
                            className="w-24 text-xs"
                            onClick={() => handleComingSoon("/my/shipping")}
                          >
                            배송조회
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-24 text-xs"
                            onClick={() => handleComingSoon("/my/returns")}
                          >
                            교환/반품
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
