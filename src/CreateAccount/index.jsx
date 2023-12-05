// Importing necessary modules and components
import { useState,useEffect  } from 'react'
import { useNavigate,NavLink } from 'react-router-dom';

import { getAuth, createUserWithEmailAndPassword,onAuthStateChanged } from "firebase/auth";
import firebaseConfig from '../FirebaseConfig';

import Swal from 'sweetalert2/dist/sweetalert2.js';
import {Icon} from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye'

import LoginCreateBg from '../assets/images/login-create-bg.png'


function CreateAccount ()
{ 

  const navigate = useNavigate();

  const [type, setType] = useState('password');
  const [icon, setIcon] = useState(eyeOff);

  const handleToggle = () => 
  {
    if (type==='password')
    {
       setIcon(eye);
       setType('text')
    } 

    else 
    {
       setIcon(eyeOff)
       setType('password')
    }
 }

  // State for create new user account
  const [account, setAccount] = useState 
  ({
      email: '',
      password: ''
  })

  // Set the document title
  useEffect(() => 
  {
    document.title = `Create new user`;

    const auth = getAuth(firebaseConfig);
      onAuthStateChanged(auth, (user)=>
      {
        if(user)
        {
          navigate('/dashboard');
        }
      });

  },[]);
  
  // function to handle adding a new user
  const create_user = (e) => 
  {
    e.preventDefault();

    // Validation: Check if all fields are filled
    if (account.email === "" || account.password === "" || account.password.length < 6) 
    {
      return Swal.fire
      ({
          icon: 'error',
          title: 'Error!',
          text: 'All fields are required, and the password must be at least 6 characters.',
          showConfirmButton: true,
          confirmButtonColor: '#860A35',
      });
    }
    
    else 
    {
      const isEmailValid = (email) => 
      {
        // Regular expression for basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
        return emailRegex.test(email);
      };
      
      // Usage:
      const isValid = isEmailValid(account.email);
      
      if (!isValid) 
      {
        return Swal.fire
        ({
          icon: 'error',
          title: 'Error!',
          text: 'Please enter a valid email address.',
          showConfirmButton: true,
          confirmButtonColor: '#860A35',
        });
      }

      const auth = getAuth(firebaseConfig);
      createUserWithEmailAndPassword(auth, account.email, account.password)
      .then((userCredential) => 
      {
        
        const user = userCredential.user;

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
          // Display a success message using SweetAlert
          Swal.fire
          ({
            icon: 'success',
            title: 'Added!',
            text: `Account successfully registered.`,
            showConfirmButton: false,
            timer: 1500,
          });

          // Clear the form after adding an employee
          setAccount
          ({
              email: '',
              password: '',
          });

           // Navigate to dashboard after creating account
          navigate('/dashboard');
        },
      });
        
      })
      .catch((error) => 
      {
        Swal.fire
        ({
          allowOutsideClick: false,
          icon: 'error',
          title: 'Error!',
          text: 'Email already in use!',
          showConfirmButton: true,
          confirmButtonColor: '#860A35',
        });
      });
    }
  };
 
  return (
    <>
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 p-2">
      <img src={LoginCreateBg} alt="" className="z-n1 position-absolute img-fluid" />
        <div className="card p-xxl-5 shadow-lg">
          <h1 className="fw-bold mb-3">Create Account</h1>
          <form>
            {/* Input fields for employee information */}
            <label htmlFor="email" className="text-black"><span className="text-danger">*</span> Email:</label>
            <input 
              name="email" 
              id="email" 
              className="form-control" 
              type="email" 
              value={account.email}
              onChange={(e) => 
                setAccount
              ({...account,
                    email: e.target.value
              })}
              />
              <br />

              <label htmlFor="password" className="text-black"><span className="text-danger">*</span> Password:</label>
              <div className="password-input-container">
                <input
                  name="password"
                  id="password"
                  className="form-control"
                  type={type}
                  value={account.password}
                  onChange={(e) =>
                    setAccount({
                      ...account,
                      password: e.target.value,
                    })
                  }
                  autoComplete="current-password"
                />

                <span className="password-toggle" onClick={handleToggle}>
                  <Icon className="absolute mr-10" icon={icon} size={25} />
                </span>
                
              </div>

               <p className="text-black text-center pt-1">
                  <small>Password must be at least 6 characters.</small>
              </p>
                
              <button 
                type="button"
                className="btn bg-black text-white border-0 me-2"
                onClick={create_user}
              >
                Register
              </button>
              <span className="text-black">Already have an account? </span>
              <NavLink className="text-black nounderline" to='/'> Sign In.</NavLink>
          </form>
        </div>
      </div>
    </>
  );
};
export default CreateAccount;