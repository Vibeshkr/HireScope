import {Link,useNavigate,} from "react-router-dom";

function Header({user,profile,onLogout,}) {
  const navigate =useNavigate();

  const handleLogout = () => {onLogout();navigate("/");};

  return (
    <header>

      <div>
        <h2>HireScope</h2>
      </div>

      <nav>

        <Link to="/">Home</Link>
        {user && profile && (
          <>
            <Link to="/jobs"> Jobs </Link>
            <Link to="/applications"> Applications</Link>

            <Link to="/profile">Profile</Link>
             </>
        )}

      </nav>

      <div className="header-actions">

        {!user ? (
          <>
            <Link to="/login"className="profile-header-button">Login</Link>
             <Link to="/register"className="logout-button" >   Create Account </Link>
          </>
        ) : (
          <>
            {!profile && (
              <Link to="/profile" className="profile-header-button">  Create Profile</Link>
            )}

            {profile && (
               <Link to="/profile"className="profile-header-button" >My Profile</Link>
            )}

            <button  type="button" className="logout-button"onClick={handleLogout}> Logout</button>
          </>
        )}

      </div>

    </header>
  );
}

export default Header;