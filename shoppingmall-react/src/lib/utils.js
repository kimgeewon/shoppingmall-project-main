/**
 * cn() - Tailwind CSS 클래스 병합 유틸
 *
 * 사용처: ProductDetailPage, ProductCard, Slider, ImageWithFallback, Skeleton,
 *        Badge, Input, Button (조건부 className 병합)
 *
 * 사용 예:
 *   cn("base-class", isActive && "active-class", className)
 *   cn("p-2", "p-4")  → twMerge가 p-4만 남김 (동일 유틸리티 충돌 시 후자 우선)
 *
 * - clsx: 조건/배열/객체를 문자열로 변환 (false, null 등은 제외됨)
 * - twMerge: 동일 유틸리티(예: p-2 vs p-4)가 있으면 후자를 우선
 */
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
