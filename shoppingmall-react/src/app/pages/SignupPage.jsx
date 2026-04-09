/**
 * SignupPage - 회원가입 페이지
 *
 * 사용처: App.jsx (path="/signup") | LoginPage 하단 "회원가입" 링크
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Breadcrumb } from "../components/layout/Breadcrumb";
import { MessageModal } from "../components/modal/MessageModal";
import { signup as apiSignup } from "@/lib/api";

export const SignupPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [signupError, setSignupError] = useState("");

  const onSubmit = async (data) => {
    setSignupError("");
    const result = await apiSignup({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (result.success) {
      setIsSuccessModalOpen(true);
    } else {
      setSignupError(result.error || "회원가입에 실패했습니다.");
    }
  };

  const handleSignupSuccess = () => {
    setIsSuccessModalOpen(false);
    navigate("/login");
  };

  const password = watch("password"); // 비밀번호 확인 필드 validate용

  return (
    <div className="page-container">
      <Breadcrumb items={[{ to: "/", label: "홈" }, { label: "회원가입" }]} />
      <div className="page-centered">
      <div className="card-form">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black mb-2">MALL</h1>
          <h2 className="page-subtitle">회원가입</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="form-section">
            <div className="form-row">
              <label className="text-label">이름 *</label>
              <Input
                placeholder="홍길동"
                {...register("name", { required: "이름을 입력해주세요" })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </div>

            <div className="form-row">
              <label className="text-label">이메일 *</label>
              <Input
                type="email"
                placeholder="example@email.com"
                {...register("email", {
                  required: "이메일을 입력해주세요",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "올바른 이메일 주소가 아닙니다",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </div>

            <div className="form-row">
              <label className="text-label">비밀번호 *</label>
              <Input
                type="password"
                placeholder="최소 4자 이상"
                {...register("password", {
                  required: "비밀번호를 입력해주세요",
                  minLength: { value: 4, message: "최소 4자 이상 입력해주세요" },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </div>

            <div className="form-row">
              <label className="text-label">비밀번호 확인 *</label>
              <Input
                type="password"
                placeholder="비밀번호 재입력"
                {...register("passwordConfirm", {
                  required: "비밀번호 확인을 입력해주세요",
                  validate: (val) => val === password || "비밀번호가 일치하지 않습니다", // watch한 password와 비교
                })}
                error={!!errors.passwordConfirm}
                helperText={errors.passwordConfirm?.message}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-2 cursor-pointer text-sm text-gray-600">
              <input
                type="checkbox"
                className="mt-1 rounded border-gray-300 text-black focus:ring-black"
                required
              />
              <span>[필수] 이용약관 동의</span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer text-sm text-gray-600">
              <input
                type="checkbox"
                className="mt-1 rounded border-gray-300 text-black focus:ring-black"
                required
              />
              <span>[필수] 개인정보 수집 및 이용 동의</span>
            </label>
          </div>

          {signupError && (
            <p className="text-sm text-destructive">{signupError}</p>
          )}
          <Button fullWidth size="lg" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "가입 중..." : "회원가입"}
          </Button>
        </form>

        <div className="form-footer">
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className="font-semibold text-black hover:underline">
            로그인
          </Link>
        </div>
      </div>
      </div>

      <MessageModal
        isOpen={isSuccessModalOpen}
        onClose={handleSignupSuccess}
        title="회원가입 완료"
        description="성공적으로 회원가입이 되었습니다. 로그인해주세요."
        icon="success"
      />
    </div>
  );
};
