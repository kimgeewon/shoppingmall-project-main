/**
 * MagazinePage - 매거진 목록 페이지
 *
 * 사용처: App.jsx (path="/magazine") | HomePage 매거진 섹션 "전체보기"
 */
import { useState, useEffect } from "react";
import { getMagazineArticles } from "@/lib/api";
import { Link } from "react-router-dom";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { Skeleton } from "../components/ui/Skeleton";

export const MagazinePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      const data = await getMagazineArticles();
      if (!cancelled) setArticles(data || []);
      setIsLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="flex items-center gap-2 mb-8">
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex flex-col items-center mb-16 space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="grid-articles">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col gap-4">
              <Skeleton className="aspect-[3/4] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-24 mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Breadcrumb items={[{ to: "/", label: "홈" }, { label: "매거진" }]} />

      <div className="section-heading">
        <h1 className="page-title-lg mb-4">MAGAZINE</h1>
        <p className="text-body">패션 트렌드와 스타일링 팁을 만나보세요.</p>
      </div>

      <div className="grid-articles">
        {articles.map((article) => (
          <Link to={`/magazine/${article.id}`} key={article.id} className="article-card group">
            <div className="article-card-image">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4">
                <span className="article-card-badge">{article.category}</span>
              </div>
            </div>

            <div className="article-card-content">
              <span className="text-body-secondary text-sm">{article.date}</span>
              <h3 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors">
                {article.title}
              </h3>
              <p className="text-body line-clamp-2">{article.description}</p>
              <div className="mt-2">
                <span className="read-more-link">READ MORE</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
