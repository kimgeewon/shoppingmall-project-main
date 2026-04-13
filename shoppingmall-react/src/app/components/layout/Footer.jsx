/**
 * Footer - 하단 영역 (회사 정보, 고객센터, 링크, 저작권)
 *
 * 사용처: Layout.jsx
 */
import { Link, useLocation } from "react-router-dom";

export const Footer = () => {
  const location = useLocation();

  return (
    <footer className="border-t border-border bg-bg-muted py-12 text-sm text-text-muted">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="mb-4 text-lg font-bold text-black">MALL</h3>
          <p className="leading-relaxed">
            고객의 행복을 최우선으로 생각하는
            <br />
            온라인 쇼핑몰입니다.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-primary">회사 정보</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/about" state={{ from: location.pathname }} className="hover:text-black">
                회사 소개
              </Link>
            </li>
            <li>
              <Link to="/careers" state={{ from: location.pathname }} className="hover:text-black">
                채용 정보
              </Link>
            </li>
            <li>
              <Link to="/terms" state={{ from: location.pathname }} className="hover:text-black">
                이용약관
              </Link>
            </li>
            <li>
              <Link to="/privacy" state={{ from: location.pathname }} className="hover:text-black">
                개인정보처리방침
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-primary">고객센터</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/notice" state={{ from: location.pathname }} className="hover:text-black">
                공지사항
              </Link>
            </li>
            <li>
              <Link to="/faq" state={{ from: location.pathname }} className="hover:text-black">
                자주 묻는 질문
              </Link>
            </li>
            <li>
              <Link to="/inquiry" state={{ from: location.pathname }} className="hover:text-black">
                1:1 문의
              </Link>
            </li>
            <li>
              <Link
                to="/shipping-guide"
                state={{ from: location.pathname }}
                className="hover:text-black"
              >
                배송 안내
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-primary">연락처</h4>
          <address className="not-italic space-y-2">
            <p>1544-0000</p>
            <p>help@mall.com</p>
            <p>평일 09:00 - 18:00</p>
          </address>
        </div>
      </div>
      <div className="container mx-auto mt-12 px-4 border-t border-border pt-8 text-center text-xs text-text-subtle">
        © 2024 MALL Corp. All rights reserved.
      </div>
    </footer>
  );
};
