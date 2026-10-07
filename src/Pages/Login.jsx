import {useState,} from "react";

import {Link,useNavigate,} from "react-router-dom";

import {FaArrowRight,} from "react-icons/fa";

import {loginUser,} from "../services/authService";

function Login({onLogin,}) {
  const navigate =useNavigate();

  const [email, setEmail] =useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] =useState(false);

  const handleLogin = async (e) => {e.preventDefault();

      if (!email.trim()) {
        alert( "Please enter your email.");
        return;
      }

      if (!password) {
        alert("Please enter your password.");
        return;
      }

      try {
        setLoading(true);

        const user =await loginUser( email.trim().toLowerCase(),password);

        onLogin(user);

        navigate("/");
      } catch (error) {
        console.error(
          "LOGIN ERROR:",
          error
        );

        alert(error.message ||"Invalid email or password.");
      } finally {
        setLoading(false);
      }
    };

  return (
    <main className="auth-page">

      <div className="auth-container">

        <div className="auth-header">

          <p className="page-label">
            WELCOME BACK
          </p>

          <h1>
            Login to HireScope
          </h1>

          <p>
            Login with the email and
            password you used when
            creating your account.
          </p>

        </div>

        <form
          className="auth-form"
          onSubmit={handleLogin}
        >

          <div className="form-group">

            <label>
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>setEmail(e.target.value
                )
              }
              placeholder="Enter your email"
            />

          </div>

          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              placeholder="Enter your password"
            />

          </div>

          <button
            type="submit"
            className="auth-submit-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}

            {!loading && (
              <FaArrowRight />
            )}
          </button>

        </form>

        <div className="auth-footer">

          <p>
            Don't have an account?
          </p>

          <Link to="/register">
            Create Account
          </Link>

        </div>

      </div>

    </main>
  );
}

export default Login;