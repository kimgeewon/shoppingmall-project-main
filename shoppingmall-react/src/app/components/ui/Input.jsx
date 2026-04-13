/**
 * Input - 폼 입력 필드 (로그인, 회원가입, 주문 등)
 *
 * 사용처: Header(검색창), LoginPage, SignupPage, CheckoutPage
 *
 * props:
 *   error: true 시 빨간 테두리
 *   helperText: 에러/안내 메시지 (입력창 아래 표시)
 */
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef(({ className, error, helperText, ...props }, ref) => (
  <div className="w-full">
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
        error && "border-red-500 focus-visible:ring-red-500",
        className
      )}
      {...props}
    />
    {helperText && (
      <p className={cn("mt-1 text-xs", error ? "text-destructive" : "text-text-subtle")}>
        {helperText}
      </p>
    )}
  </div>
));
Input.displayName = "Input";
