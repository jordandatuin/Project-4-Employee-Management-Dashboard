// Importing necessary modules and components
import { useNavigate } from 'react-router-dom';

import { getAuth, signOut } from "firebase/auth";
import firebaseConfig from '../FirebaseConfig';

import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Icon } from '@iconify/react';

function Logout() 
{ 
  // React router hook to navigate to different pages
  const navigate = useNavigate();

  // Show a confirmation dialog using SweetAlert
  const handleLogout = () => 
  {
    // Show a confirmation dialog using SweetAlert
    Swal.fire
    ({
      icon: 'question',
      title: 'Logging Out',
      text: 'Are you sure you want to log out?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: '#860A35',
    }).then(result => 
      {
      // Check if the user clicked "Yes" in the confirmation dialog
      if (result.value) 
      {
        // Show a loading indicator with a timer
        Swal.fire
        ({
          timer: 1500,
          showConfirmButton: false,
          willOpen: () => 
          {
            Swal.showLoading();
          },
          willClose: () => 
          {
            // Navigate to the home page after successful logout
            navigate('/');

            // Get the authentication instance and sign out the user
            const auth = getAuth(firebaseConfig);
            signOut(auth).then(() => 
            {
              
            }).catch((error) => 
            {
              // Handle errors if any during the logout process
              const errorCode = error.code;
              const errorMessage = error.message;
              alert(errorCode)
              alert(errorMessage)
            });
          
          },
        });
      }
    });
  };

  return (
    <>
      {/* Render a button with an icon for logging out */}
        <span className="mt-1">
          <button className="btn p-0">
            <Icon 
              icon="ri:logout-box-r-line" 
              color="white" width="30" 
              height="30" 
              // Attach the handleLogout function to the click event of the icon
              onClick={handleLogout} 
            />
          </button>
        </span>
    </>
            
  );
};
export default Logout;
