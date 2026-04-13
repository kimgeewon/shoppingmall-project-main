/**
 * OrderHistoryPage - 주문 내역 페이지
 *
 * 사용처: App.jsx (path="/my/orders") | MyPage "주문/배송 조회" 클릭
 */
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Package } from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { getOrders } from "@/lib/api";
import { useStore } from "../context/StoreContext";

export const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isHydrated } = useStore();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isHydrated) return;
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    let cancelled = false;
    async function load() {
      const data = await getOrders();
      if (!cancelled) setOrders(data || []);
      setIsLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [isHydrated, isLoggedIn, navigate]);

  if (isLoading) {
    return (
      <div className="page-container">
        <Breadcrumb items={[{ to: "/", label: "홈" }, { to: "/mypage", label: "마이페이지" }, { label: "주문내역" }]} />
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="space-y-6">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Breadcrumb items={[{ to: "/", label: "홈" }, { to: "/mypage", label: "마이페이지" }, { label: "주문내역" }]} />
      <h1 className="text-2xl font-bold mb-8">주문 내역</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border border-gray-200 rounded-xl overflow-hidden bg-white"
          >
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center gap-4">
                <span className="font-bold text-gray-900">
                  {order.date?.replace(/-/g, ".") || order.date}
                </span>
                <span className="text-sm text-gray-500">{order.id}</span>
              </div>
              <Link
                to={`/order/${order.id}`}
                className="text-sm text-gray-600 hover:text-black flex items-center"
              >
                상세보기 <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="h-20 w-20 bg-gray-100 rounded overflow-hidden shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <Badge
                          variant={order.status === "결제완료" || order.status === "배송중" ? "hot" : "default"}
                          className="mb-1"
                        >
                          {order.status}
                        </Badge>
                        <p className="font-medium text-gray-900 line-clamp-1">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.price.toLocaleString()}원 / {item.quantity}개
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="lg:w-48 lg:border-l lg:border-gray-100 lg:pl-6 flex flex-col justify-center items-center lg:items-end text-center lg:text-right gap-2">
                  <span className="text-gray-500 text-sm">총 주문금액</span>
                  <span className="text-xl font-bold text-gray-900">
                    {order.total.toLocaleString()}원
                  </span>
                  <div className="flex flex-col gap-2 w-full mt-2">
                    <Button size="sm" variant="outline" fullWidth>
                      배송조회
                    </Button>
                    <Button size="sm" variant="outline" fullWidth>
                      교환/반품
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>주문 내역이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};
