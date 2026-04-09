/**
 * Button - 재사용 버튼 컴포넌트
 *
 * 사용처: Header, ProductDetailPage, CartPage, LoginPage, ProductListPage, HomePage,
 *        MessageModal, AlertModal, CartModal, ProductCard, ComingSoonPage, SignupPage,
 *        OrderCompletePage, CheckoutPage, OrderHistoryPage, MyPage
 *
 * props:
 *   variant: "primary" | "secondary" | "outline" | "ghost" | "danger" | "link"
 *   size: "sm" | "md" | "lg" | "icon"
 *   fullWidth: true 시 가로 전체
 */
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
export const Button = forwardRef(
  ({ className, variant = "primary", size = "md", fullWidth, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50";
    const variants = {
      primary: "bg-primary text-white hover:bg-primary-hover shadow-sm",
      secondary: "bg-bg text-primary border border-primary hover:bg-bg-muted",
      outline: "border border-border bg-transparent hover:bg-bg-muted text-text",
      ghost: "hover:bg-bg-muted hover:text-text text-text-muted",
      danger: "bg-destructive text-white hover:bg-destructive-hover",
      link: "text-primary underline-offset-4 hover:underline",
    };
    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-11 px-4 py-2 text-sm",
      lg: "h-14 px-8 text-base",
      icon: "h-10 w-10",
    };
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], fullWidth && "w-full", className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
