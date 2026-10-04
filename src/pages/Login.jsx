import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import loginIllustration from "../assets/login-illustration.png";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (error) setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email.trim() || !formData.password) {
      setError("Enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      // TODO: connect your backend here, for example:
      // const { data } = await axios.post("/api/auth/login", formData);
      // then navigate by role: "/hr", "/employee" or "/job-seeker"

      navigate("/hr");
    } catch {
      setError("Login failed. Check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-visual">
          <img
            src={loginIllustration}
            alt="HR team working with a candidate profile"/>
        </div>

        <div className="login-panel">
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <h1>
              Hello,
              <br />
              Welcome back
            </h1>

            <label className="login-field">
              <span className="login-sr-only">Email</span>
              <input
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange} />
            </label>

            <label className="login-field">
              <span className="login-sr-only">Password</span>
              <input
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange} />
            </label>

            <div className="login-options">
              <label className="login-remember">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange} />
                Remember me
              </label>

              <Link to="/forgot-password" className="login-forgot">
                Forgot password?
              </Link>
            </div>

            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="login-signup">
              Don't have an account? <Link to="/signup">Click here</Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Login;