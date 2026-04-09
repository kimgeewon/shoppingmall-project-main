/**
 * LoginPage - 로그인 페이지
 *
 * 사용처: App.jsx (path="/login") | CartPage/CheckoutPage 주문 시 비로그인 상태에서 리다이렉트
 *
 * redirect: ?redirect=/checkout 등 - 로그인 성공 후 이동할 경로
 * api.login() → 성공 시 useStore().login(user) → sessionStorage에 저장
 * flushSync: login(user) 직후 state 반영해서 모달이 바로 뜨도록
 */
import { useState } from "react";
import { flushSync } from "react-dom";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { useStore } from "../context/StoreContext";
import { MessageModal } from "../components/modal/MessageModal";
import { login as apiLogin } from "@/lib/api";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const { login } = useStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [loginError, setLoginError] = useState("");

  const onSubmit = async (data) => {
    setLoginError("");
    const user = await apiLogin(data.email, data.password);

    if (user) {
      flushSync(() => login(user)); // 동기적으로 state 갱신 후 모달 표시
      setIsSuccessModalOpen(true);
    } else {
      setLoginError("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  const handleLoginSuccess = () => {
    setIsSuccessModalOpen(false);
    // 외부 URL 오픈 리다이렉트 방지: /로 시작하는 내부 경로만 허용
    const path = redirectTo && redirectTo.startsWith("/") ? redirectTo : "/";
    navigate(path);
  };

  return (
    <div className="page-container">
      <Breadcrumb items={[{ to: "/", label: "홈" }, { label: "로그인" }]} />
      <div className="page-centered">
      <div className="card-form">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black mb-2">MALL</h1>
          <h2 className="page-subtitle">로그인</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="form-section">
            <div className="form-row">
              <label className="text-label">이메일</label>
              <Input
                type="email"
                placeholder="example@email.com"
                {...register("email", { required: "이메일을 입력해주세요" })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </div>
            <div className="form-row">
              <label className="text-label">비밀번호</label>
              <Input
                type="password"
                placeholder="비밀번호 입력"
                {...register("password", { required: "비밀번호를 입력해주세요" })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </div>
          </div>

          <div className="form-options">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              <span className="text-gray-600">자동 로그인</span>
            </label>
            <Link to="/find-password" className="text-gray-500 hover:text-black">
              비밀번호 찾기
            </Link>
          </div>

          {loginError && (
            <p className="text-sm text-destructive">{loginError}</p>
          )}
          <Button fullWidth size="lg" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "로그인 중..." : "로그인"}
          </Button>
        </form>

        <p className="text-xs text-text-subtle mt-2">
          테스트 계정: test@test.com / test1234
        </p>

        <div className="form-footer">
          계정이 없으신가요?{" "}
          <Link to="/signup" className="font-semibold text-black hover:underline">
            회원가입
          </Link>
        </div>
      </div>
      </div>

      <MessageModal
        isOpen={isSuccessModalOpen}
        onClose={handleLoginSuccess}
        title="로그인 성공"
        description="환영합니다! 즐거운 쇼핑 되세요."
        icon="success"
      />
    </div>
  );
};
