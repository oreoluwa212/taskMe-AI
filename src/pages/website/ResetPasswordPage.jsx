// src/pages/website/ResetPasswordPage.jsx
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "../../store/authStore";
import FormInput from "../../components/input/FormInput";
import Button from "../../components/ui/Button";
import VerificationCodeInput from "../../components/forms/VerificationCodeInput";
import { validationRules } from "../../utils/validations";
import { ResetPasswordBg, logo } from "../../../public";
import InputField from "../../components/forms/InputField";

const ResetPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: email, 2: code verification
  const [formData, setFormData] = useState({
    email: "",
    code: "",
  });
  const [errors, setErrors] = useState({});
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { forgotPassword, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const emailInputRef = useRef(null);

  const codeInputRef = useRef();

  // Clear error on component mount
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Auto-focus email input when component mounts
  useEffect(() => {
    if (step === 1 && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [step]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const startResendCooldown = () => {
    setResendCooldown(60);
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    // Clear any existing errors
    setErrors({});

    // Validate email
    const emailError = validationRules.email(formData.email);
    if (emailError !== true) {
      setErrors({ email: emailError });
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setIsTransitioning(true);

      // Show loading toast
      const loadingToast = toast.loading("Sending reset code...");

      await forgotPassword(formData.email);

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success("Password reset code sent to your email!");

      // Wait a moment before transitioning for better UX
      setTimeout(() => {
        setStep(2);
        setIsTransitioning(false);
        startResendCooldown();
      }, 1500);
    } catch (error) {
      setIsTransitioning(false);
      const errorMessage =
        error.response?.data?.message || "Failed to send reset code";
      toast.error(errorMessage);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    try {
      const loadingToast = toast.loading("Resending code...");

      await forgotPassword(formData.email);

      toast.dismiss(loadingToast);
      toast.success("New reset code sent to your email!");
      startResendCooldown();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to resend code";
      toast.error(errorMessage);
    }
  };

  const handleCodeComplete = async (code) => {
    if (code.length !== 5) return;

    setFormData((prev) => ({ ...prev, code }));
    setErrors({});

    const loadingToast = toast.loading("Verifying code...");

    try {
      // Attempt password reset with dummy password to verify code only
      await useAuthStore
        .getState()
        .resetPassword(formData.email, code, "Dummy123!@#");

      toast.dismiss(loadingToast);
      toast.success("Code verified! Redirecting...");

      // Redirect with email and code
      setTimeout(() => {
        navigate("/new-password", {
          state: { email: formData.email, code },
        });
      }, 1000);
    } catch (error) {
      toast.dismiss(loadingToast);
      const errMsg = error.response?.data?.message || "Invalid or expired code";
      setErrors({ code: errMsg });
      codeInputRef.current?.reset();
      toast.error(errMsg);
    }
  };

  const handleBackToEmail = () => {
    setStep(1);
    setFormData((prev) => ({ ...prev, code: "" }));
    setErrors({});
    setResendCooldown(0);

    // Focus email input after transition
    setTimeout(() => {
      emailInputRef.current?.focus();
    }, 100);
  };

  const EmailStep = () => (
    <div
      className={`bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 transition-all duration-300 ${
        isTransitioning ? "opacity-50 scale-95" : "opacity-100 scale-100"
      }`}
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Reset Your Password
        </h2>
        <p className="text-gray-600">
          Enter your email address and we'll send you a code to reset your
          password
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded animate-shake">
          {error}
        </div>
      )}

      <form onSubmit={handleEmailSubmit} className="space-y-6">
        <InputField
          name="email"
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          required
          disabled={loading || isTransitioning}
          autoFocus
        />

        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}

        <Button
          type="submit"
          className="w-full"
          loading={loading || isTransitioning}
          disabled={loading || isTransitioning || !formData.email.trim()}
        >
          {isTransitioning ? "Sending..." : "Send Reset Code"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="text-sm text-gray-600 hover:text-primary transition-colors"
        >
          ← Back to Login
        </Link>
      </div>
    </div>
  );

  const CodeVerificationStep = () => (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 animate-slideIn">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Enter Verification Code
        </h2>
        <p className="text-gray-600">We've sent a reset code to</p>
        <p className="text-primary font-semibold break-all">{formData.email}</p>
      </div>

      <div className="mb-6">
        <VerificationCodeInput
          ref={codeInputRef}
          length={5}
          onComplete={handleCodeComplete}
          error={errors.code}
          disabled={loading}
        />
      </div>

      <div className="text-center space-y-4">
        <p className="text-sm text-gray-600">Didn't receive the code?</p>
        <button
          onClick={handleResendCode}
          disabled={resendCooldown > 0 || loading}
          className="text-sm text-primary hover:text-primary-dark disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {resendCooldown > 0
            ? `Resend code in ${resendCooldown}s`
            : "Resend code"}
        </button>

        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleBackToEmail}
            className="text-sm text-gray-600 hover:text-primary transition-colors"
            type="button"
          >
            ← Use different email
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center relative">
      <div className="w-full lgss:flex overflow-hidden absolute top-0 left-0">
        <img
          src={ResetPasswordBg}
          className="lgss:h-1/2 h-screen object-cover"
          alt="Reset Password"
        />
      </div>

      <Link to="/" className="absolute top-9 text-white text-lg z-20">
        <img src={logo} alt="Logo" />
      </Link>

      <div className="relative z-10 w-full flex justify-center">
        {step === 1 && <EmailStep />}
        {step === 2 && <CodeVerificationStep />}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
