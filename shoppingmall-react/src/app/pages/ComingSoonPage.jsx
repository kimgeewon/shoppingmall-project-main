/**
 * ComingSoonPage - 404 및 준비 중 페이지
 *
 * 사용처: App.jsx (path="*") | 존재하지 않는 경로, Footer 링크(이벤트, 이용약관 등)
 */
import { useNavigate, useLocation } from "react-router-dom";
import { Construction, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Breadcrumb } from "../components/layout/Breadcrumb";

export const ComingSoonPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = location.state?.from || "";
  const pathLabels = {
    "/events": "이벤트",
    "/my/profile/edit": "정보 수정",
    "/my/orders": "주문내역",
    "/my/returns": "취소/교환/반품",
    "/my/wishlist": "찜한 상품",
    "/my/coupons": "쿠폰함",
    "/my/points": "포인트",
  };
  const breadcrumbItems = fromPath
    ? [
        { to: "/", label: "홈" },
        { to: fromPath, label: pathLabels[fromPath] || "이전" },
        { label: "준비 중" },
      ]
    : [{ to: "/", label: "홈" }, { label: "준비 중" }];

  /** 이전 페이지로: Link state에 from이 있으면 그 경로로, 없으면 history.back */
  const handleBack = (e) => {
    e.preventDefault();
    const from = location.state?.from; // 예: /events → /products에서 온 경우
    if (from) {
      navigate(from, { replace: true });
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="page-container">
      <Breadcrumb items={breadcrumbItems} />
    <div className="page-empty-state">
      <div className="empty-state-icon">
        <Construction className="h-16 w-16 text-gray-400" />
      </div>

      <h1 className="empty-state-title">준비 중인 페이지입니다</h1>

      <p className="empty-state-desc">
        현재 페이지는 개발 진행 중이거나 준비 단계에 있습니다.
        <br />
        보다 나은 서비스를 제공하기 위해 노력하고 있습니다.
        <br />
        조금만 기다려주세요!
      </p>

      <div className="empty-state-actions">
        <Button
          variant="outline"
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          이전 페이지
        </Button>
        <Button type="button" onClick={() => navigate("/")}>
          홈으로 가기
        </Button>
      </div>
    </div>
    </div>
  );
};
