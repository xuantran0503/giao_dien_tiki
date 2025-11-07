import React, { useState } from "react";
import "./Login.css";

const Login = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: phone input, 2: email login, 3: phone password, 4: forgot password
  const [phoneNumber, setPhoneNumber] = useState(""); 
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [resetAccountError, setResetAccountError] = useState("");

  
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    
    const onlyNumbers = value.replace(/[^0-9]/g, "");
    setEmail(onlyNumbers);
    
  };

  const handleContinue = () => {
    const phone = email.trim();

    if (!phone) {
      setPhoneError("Số điện thoại không được để trống");
      return;
    }
    
    if (!validatePhoneNumber(phone)) {
      setPhoneError("Số điện thoại không đúng định dạng");
      return;
    }

    setPhoneNumber(phone);

    setStep(3);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    let hasError = false;
    
    if (!trimmedEmail) {
      setEmailError("Email không được để trống");
      hasError = true;
    } else if (!validateEmail(trimmedEmail)) {
      setEmailError("Email không đúng định dạng");
      hasError = true;
    } 
    
    if (!trimmedPassword) {
      setPasswordError("Mật khẩu không được để trống");
      hasError = true;
    } else if (trimmedPassword.length < 6) {
      setPasswordError("Mật khẩu phải có ít nhất 6 ký tự");
      hasError = true;
    } 
    
    if (!hasError) {
      console.log("Đăng nhập với:", trimmedEmail, trimmedPassword);
      
      alert("Đăng nhập thành công!");
    }
  };

  const handlePhoneLogin = (e) => {
    e.preventDefault();

    const trimmedPassword = password.trim();
    
    if (!trimmedPassword) {
      setPasswordError("Mật khẩu không được để trống");
      return;
    }

    if (trimmedPassword.length < 6) {
      setPasswordError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    
    setPasswordError("");
    console.log("Đăng nhập với số điện thoại:", phoneNumber, trimmedPassword);
    alert("Đăng nhập thành công!");
  };

  const handleResetAccountChange = (e) => {
    setEmail(e.target.value);
    
  };

  const handleForgotPasswordSubmit = (e) => {
    // e.preventDefault();

    const account = email.trim();
    
    if (!account) {
      setResetAccountError("Vui lòng nhập số điện thoại hoặc email");
      return;
    }
    
    const isPhone = /^[0-9]+$/.test(account);
    const isEmail = validateEmail(account);

    if (isPhone) {
      if (!validatePhoneNumber(account)) {
        setResetAccountError("Số điện thoại không đúng định dạng");
        return;
      }
    } else if (!isEmail) {
      setResetAccountError("Email không đúng định dạng");
      return;
    }

    // Nếu hợp lệ, xử lý gửi yêu cầu reset
    setResetAccountError("");
    console.log("Gửi yêu cầu reset mật khẩu cho:", account);
    alert(
      "Đã gửi yêu cầu lấy lại mật khẩu. Vui lòng kiểm tra " +
        (isPhone ? "SMS" : "email") +
        " của bạn."
    );
  };

  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    setStep(4);
    setEmail("");
    setResetAccountError("");
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    setStep(1);
    setPhoneNumber("");
    
  }

  const handleBack = () => {
    setStep(1);
    setEmail("");
    setPassword("");
    setPhoneNumber("");
    setPhoneError("");
    setEmailError("");
    setPasswordError("");
    setResetAccountError("");
  };

  return (
    <div className="login-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="login-close-btn" onClick={onClose}>
          ×
        </button>

        {step === 1 ? (
          // Step 1: Enter phone number
          <div className="login-content">
            <div className="login-left">
              <h2 className="login-title">Xin chào,</h2>
              <p className="login-subtitle">Đăng nhập hoặc Tạo tài khoản</p>

              <div className="login-form">
                <input
                  type="text"
                  className={`login-input ${phoneError ? "error" : ""}`}
                  placeholder="Số điện thoại"
                  value={email}
                  onChange={handlePhoneChange}
                  onKeyPress={(e) => e.key === "Enter" && handleContinue()}
                  maxLength="11"
                />
                {phoneError && <p className="error-message">{phoneError}</p>}

                <button className="login-btn-primary" onClick={handleContinue}>
                  Tiếp Tục
                </button>

                <button className="login-email-link" onClick={() => setStep(2)}>
                  Đăng nhập bằng email
                </button>

                <div className="login-divider">
                  <span>Hoặc tiếp tục bằng</span>
                </div>

                <div className="login-social-buttons">
                  <button className="login-social-btn facebook-btn">
                    {/* <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="#1877f2"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />

                    </svg> */}
                    <img
                      src="https://salt.tikicdn.com/ts/upload/3a/22/45/0f04dc6e4ed55fa62dcb305fd337db6c.png"
                      alt="facebook"
                    />
                  </button>
                  <button className="login-social-btn google-btn">
                    {/* <svg width="20" height="20" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg> */}
                    <img
                      src="https://salt.tikicdn.com/ts/upload/1c/ac/e8/141c68302262747f5988df2aae7eb161.png"
                      alt="google"
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
        ) : step === 2 ? (
          // Step 2: Email login form
          <div className="login-content">
            <div className="login-email-form-container">
              <img
                className="login-back-btn"
                src="https://salt.tikicdn.com/ts/upload/0b/43/2f/7c7435e82bce322554bee648e748c82a.png"
                alt="back"
                onClick={handleBack}
              />
              <h2 className="login-title">Đăng nhập bằng email</h2>
              <p className="login-subtitle">
                Nhập email và mật khẩu tài khoản Tiki
              </p>

              <form className="login-form" onSubmit={handleLogin}>
                <div className="form-group">
                  <input
                    type="email"
                    className={`login-input-email ${emailError ? "error" : ""}`}
                    placeholder="abc@email.com"
                    value={email}
                    onChange={handleEmailChange}
                  />
                  {emailError && <p className="error-message">{emailError}</p>}
                </div>

                <div className="form-group">
                  <div className="login-password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`login-input-email ${
                        passwordError ? "error" : ""
                      }`}
                      placeholder="Mật khẩu"
                      value={password}
                      onChange={handlePasswordChange}
                    />
                    <button
                      type="button"
                      className="login-toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Ẩn" : "Hiện"}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="error-message">{passwordError}</p>
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
                    <a href="#" 
                    className="login-link-register" 
                    onClick={handleRegisterClick}>
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
        ) : step === 3 ? (
          // Step 3: Phone password input
          <div className="login-content">
            <div className="login-email-form-container">
              <img
                className="login-back-btn"
                src="https://salt.tikicdn.com/ts/upload/0b/43/2f/7c7435e82bce322554bee648e748c82a.png"
                alt="back"
                onClick={handleBack}
              />
              <h2 className="login-title">Nhập mật khẩu</h2>
              <p className="login-subtitle">
                Vui lòng nhập mật khẩu Tiki của số điện thoại {phoneNumber}
              </p>

              <form className="login-form" onSubmit={handlePhoneLogin}>
                <div className="form-group">
                  <div className="login-password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`login-input-email ${
                        passwordError ? "error" : ""
                      }`}
                      placeholder="Mật khẩu"
                      value={password}
                      onChange={handlePasswordChange}
                      autoFocus
                    />
                    <button
                      type="button"
                      className="login-toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Ẩn" : "Hiện"}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="error-message">{passwordError}</p>
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
        ) : step === 4 ? (
          // Step 4: Forgot Password
          <div className="login-content">
            <div className="login-email-form-container">
              <img
                className="login-back-btn"
                src="https://salt.tikicdn.com/ts/upload/0b/43/2f/7c7435e82bce322554bee648e748c82a.png"
                alt="back"
                onClick={handleBack}
              />
              <h2 className="login-title">Quên mật khẩu ?</h2>
              <p className="login-subtitle">
                Vui lòng nhập thông tin tài khoản để lấy lại mật khẩu
              </p>

              <form
                className="login-form"
                onSubmit={handleForgotPasswordSubmit}
              >
                <div className="form-group">
                  <input
                    type="text"
                    className={`login-input-forgot ${
                      resetAccountError ? "error" : ""
                    }`}
                    placeholder="Số điện thoại/ Email"
                    value={email}
                    onChange={handleResetAccountChange}
                    autoFocus
                  />
                  {resetAccountError && (
                    <p className="error-message">{resetAccountError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="login-btn-primary login-btn-forgot"
                >
                  Lấy lại mật khẩu
                </button>

                <div className="login-hotline">
                  <p>
                    Đổi số điện thoại? Liên hệ Hotline 1900-6035
                    {/* <a href="tel:19006035" className="hotline-link">
                      Liên hệ Hotline 1900-6035
                    </a> */}
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
        ) : null}
      </div>
    </div>
  );
};

export default Login;
