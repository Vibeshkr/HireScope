import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

import { registerUser } from "../services/authService";

function Register({ onRegister }) {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const validateName = (value) => {
    const nameRegex = /^[A-Za-z ]+$/;

    return (
      value.trim().length >= 2 &&
      nameRegex.test(value.trim())
    );
  };

  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      value.trim()
    );
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateName(name)) {
      alert("Please enter a valid name.");
      return;
    }

    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const user = await registerUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      onRegister(user);

      navigate("/profile");
    } catch (error) {
      console.error(
        "REGISTER ERROR:",
        error
      );

      alert(
        error.message ||
          "Failed to create account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-container">

        <div className="auth-header">
          <p className="page-label">
            HIRE SCOPE ACCOUNT
          </p>

          <h1>Create Your Account</h1>

          <p>
            Create an account to build your
            candidate profile and start using
            HireScope.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleRegister}
        >
          <div className="form-group">
            <label>Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Minimum 6 characters"
            />
          </div>

          <button
            type="submit"
            className="auth-submit-button"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}

            {!loading && <FaArrowRight />}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?
          </p>

          <Link to="/login">
            Login
          </Link>
        </div>

      </div>
    </main>
  );
}

export default Register;