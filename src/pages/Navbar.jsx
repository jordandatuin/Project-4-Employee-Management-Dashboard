// Importing necessary modules and components
import { Link, NavLink } from "react-router-dom";

import Logout from "../Logout";
import WebLogo from "../assets/web_icon/webicon.svg"

// Navbar component
function Navbar() 
{
  return (
    <>
      <div className="container-flex">
      {/* Navigation bar */}
      <nav className="navbar fs-5 navbar-expand-md shadow pb-3 bg-dark border-bottom border-body" data-bs-theme="dark">
          <div className="container-fluid">
            {/* Brand/logo section */}
            <div className="navbar-brand fw-bold pt-3">
            {/* Link to the home page */}
            <Link className="navbar-brand fw-bold" to="/dashboard">
              {/* Logo */}
              <img src={WebLogo} alt="Logo" width="30" height="24" className="navbar_logo"/>
              {/* App name */}
              Employee Management App
              </Link>
            </div>
            {/* Navbar toggle button for small screens */}
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
            {/* Navbar links */}
            <div className="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
            <div className="navbar-nav pe-5 nav-pills pt-3">
              {/* NavLink for Dashboard */}
              <NavLink className="nav-link" to="/dashboard">Dashboard</NavLink>
              {/* NavLink for adding a new employee */}
              <NavLink className="nav-link" to="/addemployee">Register new employee</NavLink>
              {/* Logout component */}
              <Logout />
            </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};
// Exporting the Navbar component as the default export
export default Navbar;