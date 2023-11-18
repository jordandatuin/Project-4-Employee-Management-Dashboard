import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

function Layout() 
{
  return (
    <>
      {/* Main container */}  
      <main className="d-flex flex-column min-vh-100 " style={{ backgroundColor: `#cccccc`}}>
        {/* Navigation bar */}
        <Navbar />
        {/* Content container */}
        <div className="container-fluid p-0">
          {/* Outlet for rendering nested routes */}
          <Outlet></Outlet>
        </div>
        {/* Footer */}
        <Footer />
      </main>
    </>
  )
}

export default Layout;