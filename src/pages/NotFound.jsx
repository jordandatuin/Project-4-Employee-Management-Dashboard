// Importing necessary modules and components
import { useEffect  } from 'react'
import { Link } from 'react-router-dom';
import ReactiveButton from 'reactive-button';

// NotFound component
function NotFound() {

  // useEffect to set the document title when the component mounts
  useEffect(() => 
  {
    document.title = `Page Not Found - Activity 14`;
  },[]);

  // Rendering the component
  return (
    <>
      {/* Container for the 404 page */}
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100" style={{background: "#cccccc"}}>
         {/* Content wrapper */}
         <div className="d-flex flex-column align-items-center justify-content-center gap-5 py-5">
          {/* 404 message */}
          <div className="page_not_found">404 - Page Not Found</div>
            {/* Link to go back to the Dashboard */}
            <Link to="/dashboard">
              {/* ReactiveButton component */}
              <ReactiveButton
                shadow 
                color="secondary"
                idleText={"Go back to Dashboard"}
                size="large"
              />
            </Link>
         </div>
      </div>
    </>
  );
};
// Exporting the NotFound component as the default export
export default NotFound;