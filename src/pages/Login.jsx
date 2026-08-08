import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoNav from "../assets/Tempy!_logo_nav.svg";

const LOGIN_ID = "tempy1234";
const LOGIN_PASSWORD = "tempy1234";
const AUTH_STORAGE_KEY = "isLoggedIn";

function Login() {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const canSubmit = loginId.trim().length > 0 && password.length > 0;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    if (loginId.trim() !== LOGIN_ID || password !== LOGIN_PASSWORD) {
      setErrorMessage("아이디 또는 비밀번호가 맞지 않습니다.");
      return;
    }

    window.localStorage.setItem(AUTH_STORAGE_KEY, "true");
    window.dispatchEvent(new Event("tempy-auth-change"));
    navigate("/login/success");
  };

  return (
    <main className="login-page">
      <section className="login-card" aria-label="Tempy login">
        <div className="login-brand">
          <button className="login-logo-link" type="button" aria-label="Go to Home" onClick={() => navigate("/")}>
            <img src={logoNav} alt="Tempy!" draggable={false} />
          </button>
          <p>Catch your Tempo, Meet your Moment</p>
        </div>

        <div className="login-divider" aria-hidden="true">
          <span />
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            <span>이메일</span>
            <input
              value={loginId}
              onChange={(event) => {
                setLoginId(event.target.value);
                setErrorMessage("");
              }}
              autoComplete="username"
              placeholder="tempy1234"
            />
          </label>

          <label>
            <span>비밀번호</span>
            <div className="login-password-field">
              <input
                value={password}
                type={showPassword ? "text" : "password"}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setErrorMessage("");
                }}
                autoComplete="current-password"
                placeholder="tempy1234"
              />
              <button type="button" onClick={() => setShowPassword((current) => !current)}>
                {showPassword ? "숨김" : "보기"}
              </button>
            </div>
          </label>

          {errorMessage && <p className="login-error">{errorMessage}</p>}

          <button className="login-submit" type="submit" disabled={!canSubmit}>
            로그인
          </button>
        </form>

        <div className="login-helper">
          <button type="button">비밀번호 찾기</button>
          <span>계정이 없으신가요? <button type="button">회원가입</button></span>
        </div>
      </section>
    </main>
  );
}

export function LoginSuccess() {
  const navigate = useNavigate();

  return (
    <main className="login-success-page">
      <section className="login-success-orbit" aria-label="Login complete">
        <article className="login-success-card">
          <button className="login-logo-link" type="button" aria-label="Go to Home" onClick={() => navigate("/")}>
            <img src={logoNav} alt="Tempy!" draggable={false} />
          </button>
          <p>Catch your Tempo, Meet your Moment</p>
          <h1>Welcome!</h1>
          <span>로그인이 완료되었어요. 이제 나만의 음악 순간으로 이동해볼게요.</span>
          <button type="button" onClick={() => navigate("/")}>
            홈으로 가기
          </button>
        </article>
      </section>
    </main>
  );
}

export default Login;
