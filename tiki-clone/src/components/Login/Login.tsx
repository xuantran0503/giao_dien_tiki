import React, { useState, FormEvent, ChangeEvent, KeyboardEvent } from "react";
import "./Login.css";

interface LoginProps {
  onClose: () => void;
}

// Type for login steps
type LoginStep = 1 | 2 | 3 | 4;

interface FormErrors {
  phone: string;
  email: string;
  password: string;
  resetAccount: string;
}

const Login: React.FC<LoginProps> = ({ onClose }) => {
  // State management with proper typing
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [step, setStep] = useState<LoginStep>(1);
  const [phoneNumber, setPhoneNumber] = useState<string>("");


  const [errors, setErrors] = useState<FormErrors>({
    phone: "",
    email: "",
    password: "",
    resetAccount: "",
  });


  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    return phoneRegex.test(phone);
  };


  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const clearError = (field: keyof FormErrors): void => {
    setErrors(prev => ({ ...prev, [field]: "" }));
  };


  const setError = (field: keyof FormErrors, message: string): void => {
    setErrors(prev => ({ ...prev, [field]: message }));
  };


  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    const onlyNumbers = value.replace(/[^0-9]/g, "");
    setEmail(onlyNumbers);
    clearError("phone");
  };


  const handleContinue = (): void => {
    const phone = email.trim();

    if (!phone) {
      setError("phone", "Số điện thoại không được để trống");
      return;
    }

    if (!validatePhoneNumber(phone)) {
      setError("phone", "Số điện thoại không đúng định dạng");
      return;
    }

    setPhoneNumber(phone);
    setStep(3);
    clearError("phone");
  };


  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
    clearError("email");
  };


  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
    clearError("password");
  };


  const handleLogin = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    let hasError = false;

    // Validate email
    if (!trimmedEmail) {
      setError("email", "Email không được để trống");
      hasError = true;
    } else if (!validateEmail(trimmedEmail)) {
      setError("email", "Email không đúng định dạng");
      hasError = true;
    }

    // Validate password
    if (!trimmedPassword) {
      setError("password", "Mật khẩu không được để trống");
      hasError = true;
    } else if (trimmedPassword.length < 4) {
      setError("password", "Mật khẩu phải có ít nhất 4 ký tự");
      hasError = true;
    }

    if (!hasError) {
      console.log("Đăng nhập với:", trimmedEmail, trimmedPassword);
      alert("Đăng nhập thành công!");
      onClose();
    }
  };


  const handlePhoneLogin = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const trimmedPassword = password.trim();

    if (!trimmedPassword) {
      setError("password", "Mật khẩu không được để trống");
      return;
    }

    if (trimmedPassword.length < 4) {
      setError("password", "Mật khẩu phải có ít nhất 4 ký tự");
      return;
    }

    clearError("password");
    console.log("Đăng nhập với số điện thoại:", phoneNumber, trimmedPassword);
    alert("Đăng nhập thành công!");
    onClose();
  };


  const handleResetAccountChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
    clearError("resetAccount");
  };


  const handleForgotPasswordSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const account = email.trim();

    if (!account) {
      setError("resetAccount", "Vui lòng nhập số điện thoại hoặc email");
      return;
    }

    const isPhone = /^[0-9]+$/.test(account);
    const isEmail = validateEmail(account);

    if (isPhone) {
      if (!validatePhoneNumber(account)) {
        setError("resetAccount", "Số điện thoại không đúng định dạng");
        return;
      }
    } else if (!isEmail) {
      setError("resetAccount", "Email không đúng định dạng");
      return;
    }

    clearError("resetAccount");
    console.log("Gửi yêu cầu reset mật khẩu cho:", account);
    alert(
      "Đã gửi yêu cầu lấy lại mật khẩu. Vui lòng kiểm tra " +
      (isPhone ? "SMS" : "email") +
      " của bạn."
    );
  };


  const handleForgotPasswordClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    setStep(4);
    setEmail("");
    clearError("resetAccount");
  };


  const handleRegisterClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    setStep(1);
    setPhoneNumber("");
  };


  const handleBack = (): void => {
    setStep(1);
    setEmail("");
    setPassword("");
    setPhoneNumber("");
    setErrors({
      phone: "",
      email: "",
      password: "",
      resetAccount: "",
    });
  };


  const handlePhoneKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleContinue();
    }
  };


  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };


  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
  };


  const togglePasswordVisibility = (): void => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="login-overlay" onClick={handleOverlayClick}>
      <div className="login-modal" onClick={handleModalClick}>
        <button className="login-close-btn" onClick={onClose} type="button">
          ×
        </button>

        {step === 1 && (
          // Step 1: Enter phone number
          <div className="login-content">
            <div className="login-left">
              <h2 className="login-title">Xin chào,</h2>
              <p className="login-subtitle">Đăng nhập hoặc Tạo tài khoản</p>

              <div className="login-form">
                <input
                  type="text"
                  className={`login-input ${errors.phone ? "error" : ""}`}
                  placeholder="Số điện thoại"
                  value={email}
                  onChange={handlePhoneChange}
                  onKeyDown={handlePhoneKeyDown}
                  maxLength={11}
                />
                {errors.phone && <p className="error-message">{errors.phone}</p>}

                <button
                  className="login-btn-primary"
                  onClick={handleContinue}
                  type="button"
                >
                  Tiếp Tục
                </button>

                <button
                  className="login-email-link"
                  onClick={() => setStep(2)}
                  type="button"
                >
                  Đăng nhập bằng email
                </button>

                <div className="login-divider">
                  <span>Hoặc tiếp tục bằng</span>
                </div>

                <div className="login-social-buttons">
                  <button className="login-social-btn facebook-btn" type="button">
                    <img
                      src="https://salt.tikicdn.com/ts/upload/3a/22/45/0f04dc6e4ed55fa62dcb305fd337db6c.png"
                      alt="Facebook"
                    />
                  </button>
                  <button className="login-social-btn google-btn" type="button">
                    <img
                      src="https://salt.tikicdn.com/ts/upload/1c/ac/e8/141c68302262747f5988df2aae7eb161.png"
                      alt="Google"
                    />
                  </button>
                </div>

                <p className="login-terms">
                  Bằng việc tiếp tục, bạn đã đọc và đồng ý với{" "}
                  <a href="/terms">điều khoản sử dụng</a> và{" "}
                  <a href="/privacy">Chính sách bảo mật thông tin cá nhân</a>{" "}
                  của Tiki
                </p>
              </div>
            </div>

            <div className="login-right">
              <div className="login-illustration">
                <img
                  src="https://salt.tikicdn.com/ts/upload/df/48/21/b4d225f471fe06887284e1341751b36e.png"
                  alt="Tiki mascot"
                />
                <h3>Mua sắm tại Tiki</h3>
                <p>Siêu ưu đãi mỗi ngày</p>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          // Step 2: Email login form
          <div className="login-content">
            <div className="login-email-form-container">
              <button
                className="login-back-btn"
                onClick={handleBack}
                type="button"
                aria-label="Quay lại"
              >
                <img
                  src="https://salt.tikicdn.com/ts/upload/0b/43/2f/7c7435e82bce322554bee648e748c82a.png"
                  alt="Quay lại"
                />
              </button>
              <h2 className="login-title">Đăng nhập bằng email</h2>
              <p className="login-subtitle">
                Nhập email và mật khẩu tài khoản Tiki
              </p>

              <form className="login-form" onSubmit={handleLogin}>
                <div className="form-group">
                  <input
                    type="email"
                    className={`login-input-email ${errors.email ? "error" : ""}`}
                    placeholder="abc@email.com"
                    value={email}
                    onChange={handleEmailChange}
                  />
                  {errors.email && <p className="error-message">{errors.email}</p>}
                </div>

                <div className="form-group">
                  <div className="login-password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`login-input-email ${errors.password ? "error" : ""}`}
                      placeholder="Mật khẩu"
                      value={password}
                      onChange={handlePasswordChange}
                    />
                    <button
                      type="button"
                      className="login-toggle-password"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? "Ẩn" : "Hiện"}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="error-message">{errors.password}</p>
                  )}
                </div>

                <button type="submit" className="login-btn-primary">
                  Đăng nhập
                </button>

                <div className="login-links">
                  <a
                    href="#"
                    className="login-link"
                    onClick={handleForgotPasswordClick}
                  >
                    Quên mật khẩu?
                  </a>

                  <p>
                    Chưa có tài khoản?{" "}
                    <a
                      href="#"
                      className="login-link-register"
                      onClick={handleRegisterClick}
                    >
                      Tạo tài khoản
                    </a>
                  </p>
                </div>
              </form>
            </div>

            <div className="login-right">
              <div className="login-illustration">
                <img
                  src="https://salt.tikicdn.com/ts/upload/df/48/21/b4d225f471fe06887284e1341751b36e.png"
                  alt="Tiki mascot"
                />
                <h3>Mua sắm tại Tiki</h3>
                <p>Siêu ưu đãi mỗi ngày</p>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          // Step 3: Phone password input
          <div className="login-content">
            <div className="login-email-form-container">
              <button
                className="login-back-btn"
                onClick={handleBack}
                type="button"
                aria-label="Quay lại"
              >
                <img
                  src="https://salt.tikicdn.com/ts/upload/0b/43/2f/7c7435e82bce322554bee648e748c82a.png"
                  alt="Quay lại"
                />
              </button>
              <h2 className="login-title">Nhập mật khẩu</h2>
              <p className="login-subtitle">
                Vui lòng nhập mật khẩu Tiki của số điện thoại {phoneNumber}
              </p>

              <form className="login-form" onSubmit={handlePhoneLogin}>
                <div className="form-group">
                  <div className="login-password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`login-input-email ${errors.password ? "error" : ""}`}
                      placeholder="Mật khẩu"
                      value={password}
                      onChange={handlePasswordChange}
                      autoFocus
                    />
                    <button
                      type="button"
                      className="login-toggle-password"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? "Ẩn" : "Hiện"}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="error-message">{errors.password}</p>
                  )}
                </div>

                <button type="submit" className="login-btn-primary">
                  Đăng Nhập
                </button>

                <div className="login-links">
                  <a
                    href="#"
                    className="login-link"
                    onClick={handleForgotPasswordClick}
                  >
                    Quên mật khẩu?
                  </a>
                  <a href="/sms-login" className="login-link">
                    Đăng nhập bằng SMS
                  </a>
                </div>
              </form>
            </div>

            <div className="login-right">
              <div className="login-illustration">
                <img
                  src="https://salt.tikicdn.com/ts/upload/df/48/21/b4d225f471fe06887284e1341751b36e.png"
                  alt="Tiki mascot"
                />
                <h3>Mua sắm tại Tiki</h3>
                <p>Siêu ưu đãi mỗi ngày</p>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          // Step 4: Forgot Password
          <div className="login-content">
            <div className="login-email-form-container">
              <button
                className="login-back-btn"
                onClick={handleBack}
                type="button"
                aria-label="Quay lại"
              >
                <img
                  src="https://salt.tikicdn.com/ts/upload/0b/43/2f/7c7435e82bce322554bee648e748c82a.png"
                  alt="Quay lại"
                />
              </button>
              <h2 className="login-title">Quên mật khẩu ?</h2>
              <p className="login-subtitle">
                Vui lòng nhập thông tin tài khoản để lấy lại mật khẩu
              </p>

              <form className="login-form" onSubmit={handleForgotPasswordSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    className={`login-input-forgot ${errors.resetAccount ? "error" : ""}`}
                    placeholder="Số điện thoại/ Email"
                    value={email}
                    onChange={handleResetAccountChange}
                    autoFocus
                  />
                  {errors.resetAccount && (
                    <p className="error-message">{errors.resetAccount}</p>
                  )}
                </div>

                <button type="submit" className="login-btn-primary login-btn-forgot">
                  Lấy lại mật khẩu
                </button>

                <div className="login-hotline">
                  <p>Đổi số điện thoại? Liên hệ Hotline 1900-6035</p>
                </div>
              </form>
            </div>

            <div className="login-right">
              <div className="login-illustration">
                <img
                  src="https://salt.tikicdn.com/ts/upload/df/48/21/b4d225f471fe06887284e1341751b36e.png"
                  alt="Tiki mascot"
                />
                <h3>Mua sắm tại Tiki</h3>
                <p>Siêu ưu đãi mỗi ngày</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;