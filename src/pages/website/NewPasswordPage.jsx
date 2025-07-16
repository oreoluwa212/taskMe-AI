// src/pages/website/NewPasswordPage.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "../../store/authStore";
import FormInput from "../../components/input/FormInput";
import Button from "../../components/ui/Button";
import { validationRules } from "../../utils/validations";
import { ResetPasswordBg, logo } from "../../../public";

const NewPasswordPage = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const { resetPassword, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Get email and code from navigation state
  const { email, code } = location.state || {};

  useEffect(() => {
    // Clear any existing errors
    clearError();

    // If no email or code, redirect to reset password page
    if (!email || !code) {
      toast.error(
        "Invalid access. Please start the password reset process again."
      );
      navigate("/reset-password");
      return;
    }

    // Show entry toast
    toast.info("Please create your new password");
  }, [email, code, navigate, clearError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate new password
    const passwordError = validationRules.password(formData.newPassword);
    if (passwordError !== true) {
      newErrors.newPassword = passwordError;
    }

    // Validate confirm password
    const confirmPasswordError = validationRules.confirmPassword(
      formData.confirmPassword,
      formData.newPassword
    );
    if (confirmPasswordError !== true) {
      newErrors.confirmPassword = confirmPasswordError;
    }

    setErrors(newErrors);

    // Show validation errors as toasts
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError);
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsProcessing(true);

      // Show processing toast
      const processingToast = toast.loading("Resetting your password...");

      await resetPassword(email, code, formData.newPassword);

      // Dismiss processing toast and show success
      toast.dismiss(processingToast);
      toast.success("Password reset successfully!");

      // Add a delay to show the success message and smooth transition
      setTimeout(() => {
        navigate("/reset-password/confirm", {
          state: {
            email: email,
          },
        });
      }, 2000);
    } catch (error) {
      setIsProcessing(false);
      const errorMessage =
        error.response?.data?.message || "Failed to reset password";
      toast.error(errorMessage);
    }
  };

  // Don't render if no email or code
  if (!email || !code) {
    return null;
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center relative">
      <div className="w-full lgss:flex overflow-hidden absolute top-0 left-0">
        <img
          src={ResetPasswordBg}
          className="lgss:h-1/2 h-screen object-cover"
          alt="New Password"
        />
      </div>

      <Link to="/" className="absolute top-9 text-white text-lg z-20">
        <img src={logo} alt="Logo" />
      </Link>

      <div className="relative z-10 w-full flex justify-center">
        <div
          className={`bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 transition-all duration-300 animate-slideIn ${
            isProcessing ? "opacity-75 scale-95" : "opacity-100 scale-100"
          }`}
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Create New Password
            </h2>
            <p className="text-gray-600">
              Enter your new password below for{" "}
              <span className="text-primary font-semibold break-all">
                {email}
              </span>
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <FormInput
                name="newPassword"
                label="New Password"
                type={showPasswords.newPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Enter new password"
                required
                disabled={loading || isProcessing}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("newPassword")}
                className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
                disabled={loading || isProcessing}
              >
                {showPasswords.newPassword ? "👁️" : "🙈"}
              </button>
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword}
                </p>
              )}
            </div>

            <div className="relative">
              <FormInput
                name="confirmPassword"
                label="Confirm New Password"
                type={showPasswords.confirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm new password"
                required
                disabled={loading || isProcessing}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
                disabled={loading || isProcessing}
              >
                {showPasswords.confirmPassword ? "👁️" : "🙈"}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={loading || isProcessing}
              disabled={
                loading ||
                isProcessing ||
                !formData.newPassword.trim() ||
                !formData.confirmPassword.trim()
              }
            >
              {isProcessing ? "Resetting Password..." : "Reset Password"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/reset-password"
              className="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              ← Back to Reset Password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPasswordPage;
