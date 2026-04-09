/**
 * ImageWithFallback - 이미지 로드 실패 시 "No Image" placeholder 표시
 *
 * 사용처: ProductDetailPage, CartModal, ProductCard, MyPage
 *
 * 외부 URL(Unsplash 등)이 만료되거나 404일 때 깨진 아이콘 대신 placeholder 표시
 */
import { useState } from "react";
import { cn } from "@/lib/utils";

/** SVG 기반 placeholder (data URL로 인라인, 별도 요청 없음) */
const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' fill='%23e5e7eb'%3E%3Crect width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='24' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

export function ImageWithFallback({ src, alt, className, ...props }) {
  const [error, setError] = useState(false); // onError 발생 시 true

  return (
    <img
      src={error ? PLACEHOLDER : src}
      alt={alt}
      className={cn(className)}
      onError={() => setError(true)} // 로드 실패 시 placeholder로 전환
      {...props}
    />
  );
}
