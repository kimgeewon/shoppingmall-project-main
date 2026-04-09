/**
 * Header - 상단 네비게이션
 *
 * 사용처: Layout.jsx
 *
 * 기능: 로고 | 검색(최근/추천 검색어 드롭다운) | 장바구니 | 로그인/마이페이지/로그아웃
 * 모바일: 햄버거 메뉴 → 드롭다운 (검색, 링크들)
 * recentSearches: localStorage "recentSearches"에 최대 10개 저장
 * searchRef: 검색창 바깥 클릭 시 드롭다운 닫기용
 */
import { useState, useRef, useEffect } from "react";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  LogOut,
  Clock,
  TrendingUp,
  Trash2,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useStore } from "../../context/StoreContext";
import { MessageModal } from "../modal/MessageModal";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  /** 최근 검색어 (localStorage에 최대 10개 저장) */
  const [recentSearches, setRecentSearches] = useState([]);
  const searchRef = useRef(null); // 검색창 외부 클릭 감지용

  const { isLoggedIn, user, cartCount, logout } = useStore();

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("최근 검색어 파싱 실패", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }, [recentSearches]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const term = searchQuery.trim();

      setRecentSearches((prev) => {
        const filtered = prev.filter((item) => item !== term);
        return [term, ...filtered].slice(0, 10); // 중복 제거 후 최신 10개만 유지
      });

      navigate(`/products?search=${encodeURIComponent(term)}`);
      setIsMenuOpen(false);
      setIsSearchFocused(false);
      searchRef.current?.blur();
    }
  };

  const removeRecentSearch = (e, term) => {
    e.stopPropagation();
    e.preventDefault();
    setRecentSearches((prev) => prev.filter((item) => item !== term));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const handleLogout = () => {
    logout();
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);
    navigate("/");
  };

  /** 검색 드롭다운 외부 클릭 시 닫기 */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-24 flex items-center justify-between gap-4 relative">
          <Link to="/" className="text-2xl font-bold text-black shrink-0">
            MALL
          </Link>

          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full justify-center pointer-events-none">
            <form
              ref={searchRef}
              onSubmit={handleSearch}
              className={`relative w-full pointer-events-auto transition-all duration-300 ease-out ${isSearchFocused ? "max-w-2xl" : "max-w-md"}`}
            >
              <div className="relative z-20">
                <Input
                  placeholder="상품을 검색해보세요"
                  className={`pr-10 transition-shadow duration-200 focus-visible:ring-0 ${isSearchFocused ? "ring-1 ring-black border-black" : ""}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>

              {isSearchFocused && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-10 p-6 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex gap-8">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                          <Clock className="w-4 h-4" />
                          최근 검색어
                        </div>
                        {recentSearches.length > 0 && (
                          <button
                            type="button"
                            onClick={clearRecentSearches}
                            className="text-xs text-gray-400 hover:text-gray-600 underline"
                          >
                            전체 삭제
                          </button>
                        )}
                      </div>

                      {recentSearches.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((term, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-full text-sm group/badge"
                            >
                              <button
                                type="button"
                                className="hover:text-black transition-colors truncate max-w-[120px]"
                                onClick={() => {
                                  setSearchQuery(term);
                                  navigate(`/products?search=${encodeURIComponent(term)}`);
                                  setIsSearchFocused(false);
                                }}
                              >
                                #{term}
                              </button>
                              <button
                                type="button"
                                onClick={(e) => removeRecentSearch(e, term)}
                                className="text-gray-400 hover:text-destructive hover:bg-destructive-muted p-0.5 rounded-full transition-colors shrink-0"
                                title="삭제"
                                aria-label="삭제"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="py-4 text-center text-sm text-gray-400">
                          최근 검색 내역이 없습니다.
                        </div>
                      )}
                    </div>

                    <div className="flex-1 border-l border-gray-100 pl-8">
                      <div className="flex items-center gap-2 mb-3 text-sm font-bold text-secondary">
                        <TrendingUp className="w-4 h-4" />
                        추천 검색어
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {["노트북", "가을 자켓", "영양제", "캠핑용품", "기계식 키보드"].map(
                          (term, idx) => (
                            <button
                              key={idx}
                              type="button"
                              className="px-3 py-1.5 bg-bg-muted hover:bg-secondary-light hover:text-secondary text-text-muted rounded-full text-sm transition-colors"
                              onClick={() => {
                                setSearchQuery(term);
                                navigate(`/products?search=${encodeURIComponent(term)}`);
                                setIsSearchFocused(false);
                              }}
                            >
                              #{term}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <Link
              to="/cart"
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center h-4 w-4 rounded-full bg-secondary text-[10px] font-bold text-white ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="hidden md:flex items-center">
              {isLoggedIn && user ? (
                <div className="flex items-center gap-3 pl-2 border-l border-gray-200 ml-2">
                  <Link
                    to="/mypage"
                    className="flex items-center gap-2 hover:bg-gray-100 rounded-full pr-3 pl-1 py-1 transition-colors group"
                  >
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-200 text-gray-500 font-bold">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-sm">{user.name.charAt(0)}</span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-black">
                      {user.name}님
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 hover:bg-bg-muted rounded-full transition-colors text-text-muted hover:text-destructive"
                    title="로그아웃"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4 ml-2">
                  <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-black">
                    로그인
                  </Link>
                  <Link to="/signup" className="text-sm font-medium text-gray-700 hover:text-black">
                    회원가입
                  </Link>
                </div>
              )}
            </div>

            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 shadow-lg animate-in slide-in-from-top-2">
            <form onSubmit={handleSearch} className="mb-4 relative">
              <Input
                placeholder="검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                <Search className="h-4 w-4 text-gray-500" />
              </button>
            </form>
            <nav className="flex flex-col gap-4 text-base font-medium text-gray-900">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                홈
              </Link>
              <Link to="/products" onClick={() => setIsMenuOpen(false)}>
                상품
              </Link>
              <Link to="/products?category=all" onClick={() => setIsMenuOpen(false)}>
                카테고리
              </Link>
              <Link
                to="/events"
                state={{ from: location.pathname }}
                onClick={() => setIsMenuOpen(false)}
              >
                이벤트
              </Link>

              <hr className="my-2 border-gray-100" />

              {isLoggedIn && user ? (
                <>
                  <div className="flex items-center gap-3 px-2 py-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-200 text-gray-500 font-bold">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-sm">{user.name.charAt(0)}</span>
                      )}
                    </div>
                    <span className="font-medium text-gray-900">{user.name}님</span>
                  </div>
                  <Link to="/mypage" onClick={() => setIsMenuOpen(false)}>
                    마이페이지
                  </Link>
                  <button
                    className="text-left text-gray-500"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-left" onClick={() => setIsMenuOpen(false)}>
                    로그인
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    회원가입
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      <MessageModal
        isOpen={isLogoutModalOpen}
        onClose={handleLogoutConfirm}
        title="로그아웃 되었습니다"
        icon="info"
      />
    </>
  );
};
