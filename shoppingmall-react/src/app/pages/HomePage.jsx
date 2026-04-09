/**
 * HomePage - 홈 페이지
 *
 * 사용처: App.jsx (path="/")
 *
 * 구성: 히어로 배너(react-slick) | 퀵 카테고리 | 인기 상품 슬라이더 | 시즌 추천 | 세일 배너 | 매거진
 * 데이터: getProducts(), getMagazineArticles() - api.js가 localStorage에서 반환
 * cancelled: useEffect cleanup에서 setState 방지 (컴포넌트 unmount 후 비동기 완료 시 에러 방지)
 */
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {
  Menu,
  ThumbsUp,
  Percent,
  Sparkles,
  Dumbbell,
  ShoppingBag,
  Footprints,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { ProductCard } from "../components/product/ProductCard";
import { getProducts, getMagazineArticles } from "@/lib/api";

const HERO_BANNER =
  "https://images.unsplash.com/photo-1703413222048-d24789838246?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080";

export const HomePage = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [magazineArticles, setMagazineArticles] = useState([]);
  const sliderRef = useRef(null);
  const productSliderRef = useRef(null);
  const seasonalSliderRef = useRef(null);

  useEffect(() => {
    let cancelled = false; // 언마운트 시 setState 방지
    async function load() {
      setIsLoading(true);
      const [prods, articles] = await Promise.all([
        getProducts(),
        getMagazineArticles(),
      ]);
      if (!cancelled) {
        setProducts(prods || []);
        setMagazineArticles(articles || []);
      }
      setIsLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const quickCategories = [
    { id: "all", name: "전체 보기", icon: Menu, path: "/products" },
    { id: "recommended", name: "추천", icon: ThumbsUp, path: "/products?tag=recommended" },
    { id: "sale", name: "세일", icon: Percent, path: "/products?tag=sale" },
    { id: "beauty", name: "뷰티", icon: Sparkles, path: "/products?category=beauty" },
    { id: "sports", name: "스포츠", icon: Dumbbell, path: "/products?category=sports" },
    { id: "outlet", name: "아울렛", icon: ShoppingBag, path: "/products?tag=outlet" },
    { id: "shoes", name: "슈즈", icon: Footprints, path: "/products?category=shoes" },
  ];

  const banners = [
    {
      id: 1,
      image: HERO_BANNER,
      title: "새로운 쇼핑의 시작",
      description: "매일 업데이트되는 신상품과 특별한 혜택을 만나보세요.",
      buttonText: "지금 쇼핑하기",
      link: "/products",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1768033976358-875c5dd27fc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcHJpbmclMjBmYXNoaW9uJTIwY29sbGVjdGlvbiUyMG1vZGVsfGVufDF8fHx8MTc2OTg1MjE2NHww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "2024 S/S 컬렉션",
      description: "트렌디한 스타일로 당신의 봄을 완성하세요.",
      buttonText: "컬렉션 보기",
      link: "/products?tag=new",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1767563280973-9ef190ee25cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG90aGluZyUyMHN0b3JlJTIwc2FsZSUyMHNpZ258ZW58MXx8fHwxNzY5ODUyMTY0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "시즌 오프 세일",
      description: "최대 70% 할인, 놓칠 수 없는 기회!",
      buttonText: "세일 입장하기",
      link: "/products?tag=sale",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1656325296078-47509c0393fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwcm9kdWN0JTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3Njk4NTIxNjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "프리미엄 에디션",
      description: "엄선된 소재와 디자인, 차원이 다른 품격.",
      buttonText: "자세히 보기",
      link: "/products?category=premium",
    },
  ];

  /** react-slick 배너 슬라이더 설정 (자동 재생, 5초 간격) */
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    pauseOnHover: false,
  };

  /** 상품 캐러셀 반응형 설정 (데스크톱 4개, 태블릿 3개, 모바일 1~2개) */
  const productSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const togglePlay = () => {
    if (isPlaying) {
      sliderRef.current?.slickPause();
    } else {
      sliderRef.current?.slickPlay();
    }
    setIsPlaying(!isPlaying);
  };

  // Reverse products for the seasonal section to make it look different
  const seasonalProducts = [...products].reverse();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 pb-20">
        <div className="relative h-[400px] md:h-[500px] w-full bg-gray-100">
          <Skeleton className="w-full h-full" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 gap-4">
            <Skeleton className="h-10 w-2/3 md:w-1/3" />
            <Skeleton className="h-6 w-1/2 md:w-1/4" />
            <Skeleton className="h-12 w-40 rounded-full" />
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="flex gap-4 overflow-hidden">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 min-w-[64px] shrink-0">
                <Skeleton className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 flex flex-col gap-32">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-5 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-5 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* Hero Banner Slider */}
      <section className="relative group">
        <Slider ref={sliderRef} {...sliderSettings}>
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="relative h-[400px] md:h-[500px] w-full bg-gray-900 outline-none"
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="h-full w-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
                <h1 className="text-2xl md:text-5xl font-bold mb-4 animate-in slide-in-from-bottom-4 fade-in duration-700">
                  {banner.title}
                </h1>
                <p className="text-sm md:text-lg mb-8 opacity-90 animate-in slide-in-from-bottom-5 fade-in duration-700 delay-150">
                  {banner.description}
                </p>
                <Button
                  size="lg"
                  className="rounded-full px-6 py-4 md:px-8 text-base md:text-lg animate-in zoom-in fade-in duration-700 delay-300"
                  onClick={() => (window.location.href = banner.link)}
                >
                  {banner.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </Slider>

        {/* Slider Controls */}
        <div className="absolute bottom-6 left-4 md:left-8 flex items-center gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => sliderRef.current?.slickPrev()}
            className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={togglePlay}
            className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-colors"
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>

          <button
            onClick={() => sliderRef.current?.slickNext()}
            className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Quick Categories - Placed below hero banner */}
      <section className="container mx-auto px-4">
        <div className="flex items-start justify-between sm:justify-center gap-4 sm:gap-8 overflow-x-auto pb-4 sm:pb-0 scrollbar-hide bg-[rgba(114,35,35,0)]">
          {quickCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                to={cat.path}
                className="flex flex-col items-center gap-2 min-w-[64px] shrink-0 group"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-700 group-hover:bg-gray-100 group-hover:text-black transition-colors duration-200">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.5} />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-black text-center whitespace-nowrap">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="container mx-auto px-4 flex flex-col gap-32">
        {/* Popular Products Slider */}
        <section className="relative group/popular">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">인기 상품</h2>
            <Link
              to="/products"
              className="text-gray-500 font-medium hover:text-black hover:underline flex items-center text-sm"
            >
              더보기 <ChevronRight className="ml-0.5 h-4 w-4" />
            </Link>
          </div>

          <div className="relative">
            {/* Previous Button */}
            <button
              onClick={() => productSliderRef.current?.slickPrev()}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 shadow-lg border border-gray-100 text-gray-800 hover:bg-white hover:scale-105 transition-all hidden md:flex"
              style={{ marginLeft: "-20px" }}
              aria-label="Previous products"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="-mx-2">
              <Slider ref={productSliderRef} {...productSliderSettings}>
                {products.map((product) => (
                  <div key={product.id} className="px-2">
                    <ProductCard product={product} />
                  </div>
                ))}
              </Slider>
            </div>

            {/* Next Button */}
            <button
              onClick={() => productSliderRef.current?.slickNext()}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 shadow-lg border border-gray-100 text-gray-800 hover:bg-white hover:scale-105 transition-all hidden md:flex"
              style={{ marginRight: "-20px" }}
              aria-label="Next products"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Seasonal Recommendations Slider */}
        <section className="relative group/seasonal">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">시즌 추천</h2>
            <Link
              to="/products?tag=seasonal"
              className="text-gray-500 font-medium hover:text-black hover:underline flex items-center text-sm"
            >
              더보기 <ChevronRight className="ml-0.5 h-4 w-4" />
            </Link>
          </div>

          <div className="relative">
            {/* Previous Button */}
            <button
              onClick={() => seasonalSliderRef.current?.slickPrev()}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 shadow-lg border border-gray-100 text-gray-800 hover:bg-white hover:scale-105 transition-all hidden md:flex"
              style={{ marginLeft: "-20px" }}
              aria-label="Previous seasonal products"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="-mx-2">
              <Slider ref={seasonalSliderRef} {...productSliderSettings}>
                {seasonalProducts.map((product) => (
                  <div key={product.id} className="px-2">
                    <ProductCard product={product} />
                  </div>
                ))}
              </Slider>
            </div>

            {/* Next Button */}
            <button
              onClick={() => seasonalSliderRef.current?.slickNext()}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 shadow-lg border border-gray-100 text-gray-800 hover:bg-white hover:scale-105 transition-all hidden md:flex"
              style={{ marginRight: "-20px" }}
              aria-label="Next seasonal products"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Sale Banner */}
        <section className="relative rounded-2xl overflow-hidden min-h-[300px] flex items-center">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1693899849404-c65b391d3d74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHNob3BwaW5nJTIwc2FsZSUyMGJhbm5lciUyMGJhY2tncm91bmQlMjBvcmFuZ2UlMjBibGFja3xlbnwxfHx8fDE3Njk4NTIzODh8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Sale Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-8 md:px-12 py-16 md:py-24 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
            <div className="max-w-xl text-white">
              <span className="inline-block px-3 py-1 bg-secondary text-white text-xs font-bold tracking-wider rounded-full mb-4">
                LIMITED TIME OFFER
              </span>
              <h3 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                이번 주 <span className="text-secondary">특별 세일</span>
                <br />
                놓치지 마세요!
              </h3>
              <p className="text-gray-300 text-lg mb-8 max-w-md">
                인기 상품 최대 50% 할인부터 추가 쿠폰 혜택까지.
                <br />
                지금 바로 확인하고 득템하세요.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-secondary hover:bg-secondary-dark text-white border-none px-8 py-6 text-lg rounded-full">
                  세일 상품 보기
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full"
                >
                  쿠폰 받기
                </Button>
              </div>
            </div>

            {/* Decorative Element (Desktop only) */}
            <div className="hidden md:block flex-shrink-0">
              <div className="relative w-56 h-56 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 animate-pulse shadow-2xl">
                <div className="text-center transform rotate-12">
                  <span className="block text-sm text-gray-300 mb-1 tracking-widest">UP TO</span>
                  <span className="block text-6xl font-black text-secondary drop-shadow-lg">
                    50%
                  </span>
                  <span className="block text-2xl font-bold text-white tracking-widest">OFF</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Magazine Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">매거진</h2>
            <Link
              to="/magazine"
              className="text-gray-500 font-medium hover:text-black hover:underline flex items-center text-sm"
            >
              전체보기 <ChevronRight className="ml-0.5 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Featured Article */}
            <Link to="/magazine/featured" className="group cursor-pointer block">
              <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[4/3]">
                <img
                  src={magazineArticles[0]?.image}
                  alt={magazineArticles[0]?.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-black/70 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
                    {magazineArticles[0]?.category}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-gray-500 text-sm font-medium">
                  {magazineArticles[0]?.date}
                </span>
                <h3 className="text-2xl font-bold text-primary group-hover:text-secondary transition-colors">
                  {magazineArticles[0]?.title}
                </h3>
                <p className="text-gray-600 line-clamp-2">{magazineArticles[0]?.description}</p>
              </div>
            </Link>

            {/* Side Articles List */}
            <div className="flex flex-col gap-8">
              {magazineArticles.slice(1).map((article) => (
                <Link
                  to={`/magazine/${article.id}`}
                  key={article.id}
                  className="group cursor-pointer flex gap-6 items-center"
                >
                  <div className="relative overflow-hidden rounded-xl w-1/3 aspect-square flex-shrink-0">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-col gap-2 flex-grow">
                    <div className="flex items-center gap-2">
                      <span className="text-secondary text-xs font-bold uppercase tracking-wider">
                        {article.category}
                      </span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="text-gray-400 text-xs">{article.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{article.description}</p>
                    <div className="mt-2">
                      <span className="text-sm font-medium text-primary border-b border-primary pb-0.5 group-hover:text-secondary group-hover:border-secondary transition-all">
                        READ MORE
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
