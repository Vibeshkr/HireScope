import {useEffect,useState,} from "react";
import {Routes,Route,Navigate,} from "react-router-dom";
import Header from "./components/Header";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Profile from "./Pages/Profile";
import Jobs from "./Pages/Jobs";
import JobDetails from "./Pages/JobDetails";
import Match from "./Pages/Match";
import Resources from "./Pages/Resources";
import Applications from "./Pages/Applications";
import { getUserById,} from "./services/authService";
import {getProfile,} from "./services/profileService";

function App() {
  const [user, setUser] =
    useState(null);

  const [profile, setProfile] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const loadCurrentUser =
    async () => {
      try {
        setLoading(true);

        const userId =
          localStorage.getItem(
            "hireScopeUserId"
          );

        if (!userId) {
          setUser(null);
          setProfile(null);
          return;
        }

        const currentUser =
          await getUserById(
            userId
          );

        setUser(currentUser);

        const profiles =
          await getProfile(
            userId
          );

        const currentProfile =
          profiles.length > 0
            ? profiles[0]
            : null;

        setProfile(
          currentProfile
        );
      } catch (error) {
        console.error(
          "LOAD USER ERROR:",
          error
        );

        localStorage.removeItem(
          "hireScopeUserId"
        );

        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const handleRegister =
    async (newUser) => {
      try {
        localStorage.setItem(
          "hireScopeUserId",
          String(newUser.id)
        );

        setUser(newUser);

        setProfile(null);
      } catch (error) {
        console.error(
          "REGISTER SESSION ERROR:",
          error
        );
      }
    };

  const handleLogin =
    async (loggedUser) => {
      try {
        localStorage.setItem(
          "hireScopeUserId",
          String(loggedUser.id)
        );

        setUser(loggedUser);

        const profiles =
          await getProfile(
            loggedUser.id
          );

        const currentProfile =
          profiles.length > 0
            ? profiles[0]
            : null;

        setProfile(
          currentProfile
        );
      } catch (error) {
        console.error(
          "LOGIN PROFILE ERROR:",
          error
        );

        setProfile(null);
      }
    };

  const handleLogout = () => {
    localStorage.removeItem(
      "hireScopeUserId"
    );

    setUser(null);
    setProfile(null);
  };

  const ProtectedRoute = ({
    children,
  }) => {
    if (!user) {
      return (
        <Navigate
          to="/login"
          replace
        />
      );
    }

    if (!profile) {
      return (
        <Navigate
          to="/profile"
          replace
        />
      );
    }

    return children;
  };

  if (loading) {
    return (
      <div className="app-loading">
        <h2>
          Loading HireScope...
        </h2>
      </div>
    );
  }

  return (
    <>
      <Header
        user={user}
        profile={profile}
        onLogout={handleLogout}
      />

      <Routes>

        <Route
          path="/"
          element={
            <Home
              user={user}
              profile={profile}
            />
          }
        />

        <Route
          path="/register"
          element={
            user ? (
              <Navigate
                to={
                  profile
                    ? "/"
                    : "/profile"
                }
                replace
              />
            ) : (
              <Register
                onRegister={
                  handleRegister
                }
              />
            )
          }
        />

        <Route
          path="/login"
          element={
            user ? (
              <Navigate
                to={
                  profile
                    ? "/"
                    : "/profile"
                }
                replace
              />
            ) : (
              <Login
                onLogin={
                  handleLogin
                }
              />
            )
          }
        />

        <Route
          path="/profile"
          element={
            user ? (
              <Profile
                user={user}
                profile={profile}
                refreshProfile={
                  loadCurrentUser
                }
              />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs/:id"
          element={
            <ProtectedRoute>
              <JobDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs/:id/match"
          element={
            <ProtectedRoute>
              <Match />
            </ProtectedRoute>
          }
        />

        <Route
          path="/resources/:id"
          element={
            <ProtectedRoute>
              <Resources />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <Applications />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </>
  );
}

export default App;
