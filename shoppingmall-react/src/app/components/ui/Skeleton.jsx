/**
 * Skeleton - 로딩 중 표시하는 회색 플레이스홀더
 *
 * 사용처: ProductDetailPage, CartPage, ProductListPage, HomePage, MagazinePage,
 *        CheckoutPage, OrderHistoryPage, MyPage
 *
 * 데이터 로딩 중(useEffect, fetch)에 사용. animate-pulse로 깜빡이는 효과.
 * 사용: <Skeleton className="h-8 w-32" /> (높이·너비 Tailwind로 지정)
 */
import { cn } from "@/lib/utils";

export const Skeleton = ({ className, ...props }) => (
  <div className={cn("animate-pulse rounded-md bg-gray-200/80", className)} {...props} />
);
