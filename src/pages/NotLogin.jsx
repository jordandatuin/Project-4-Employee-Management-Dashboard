// Importing necessary modules and components
import { useEffect  } from 'react'
import { Link } from 'react-router-dom';
import ReactiveButton from 'reactive-button';

// NotLogin component
function NotLogin() 
{

  // useEffect to set the document title when the component mounts
  useEffect(() => 
  {
    document.title = `Not Login`;
  },[]);

  // Rendering the component
  return (
    <>
      {/* Container for the 404 page */}
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100" style={{background: "#cccccc"}}>
         {/* Content wrapper */}
         <div className="d-flex flex-column align-items-center justify-content-center gap-5 py-5">
          {/* 404 message */}
          <div className="page_not_login">Hello Guest! Login to view Dashboard</div>
            {/* Link to go back to the Dashboard */}
            <Link to="/">
              {/* ReactiveButton component */}
              <ReactiveButton
                shadow 
                color="secondary"
                idleText={"Go to Login Page"}
                size="large"
              />
            </Link>
         </div>
      </div>
    </>
  );
};
// Exporting the NotLogin component as the default export
export default NotLogin;