import { Link, useLocation } from "react-router-dom";

export default function NavigationComponent() {
  const location = useLocation();
  console.log("Render NavigationComponent", location);



  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Team Up
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className={
                  "nav-link" + (location.pathname === "/" ? " active" : "")
                }
                aria-current="page"
                to="/"
              >
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className={
                  "nav-link" + (location.pathname === "/writepost" ? " active" : "")
                }
                to="/writepost"
              >
                Write a Post
              </Link>
            </li>

            <li className="nav-item">

              <Link
                className={
                  "nav-link" + (location.pathname === "/dashboard" ? " active" : "")
                }
                to="/dashboard"
              >
                Dashboard
              </Link>
            </li>  

            <li className="nav-item">

              <Link
                className={
                  "nav-link" + (location.pathname === "/login" ? " active" : "")
                }
                to="/login"
              >
                Sign in/up
              </Link>
            </li>  
          </ul>
        </div>
      </div>
    </nav>
  );
}