/**
 * Badge - 작은 라벨/태그 (SALE, HOT, NEW, 품절 등)
 *
 * 사용처: ProductListPage, ProductCard, OrderHistoryPage
 *
 * variant: default | sale | hot | new | soldout | discount | secondary
 */
import { cn } from "@/lib/utils";

export const Badge = ({ className, variant = "default", children, ...props }) => {
  const variants = {
    default: "bg-bg-muted text-primary",
    sale: "bg-secondary text-white",
    hot: "bg-destructive text-white",
    new: "bg-green-600 text-white",
    soldout: "bg-primary-dark text-white",
    discount: "bg-secondary text-white font-bold",
    secondary: "bg-secondary-light text-secondary-dark",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
