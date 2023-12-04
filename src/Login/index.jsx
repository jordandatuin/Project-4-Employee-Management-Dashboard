// Importing necessary modules and components
import { useState,useEffect } from 'react';
import { useNavigate,NavLink } from 'react-router-dom';

import { getAuth, signInWithEmailAndPassword,sendPasswordResetEmail,onAuthStateChanged } from "firebase/auth";
import firebaseConfig from '../FirebaseConfig';

import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Button, Form, Input } from 'antd';

import LoginCreateBg from '../assets/images/login-create-bg.png'

function Login ()  
{

  const navigate = useNavigate();

  // State variables for email and password
  const [useremail, setUserEmail] = useState('');
  const [userpassword, setUserPassword] = useState('');

    // Set the document title
    useEffect(() => 
    {
      document.title = `Login`;

      const auth = getAuth(firebaseConfig);
      onAuthStateChanged(auth, (user)=>
      {
        if(user)
        {
          navigate('/dashboard');
        }
      });

    }, []);

  // Function to handle form submission when login is successful
  const onFinish = async () => 
  {
    const auth = getAuth(firebaseConfig);
    signInWithEmailAndPassword(auth, useremail, userpassword)
      .then((userCredential) => 
      {
        const user = userCredential.user;

        // Display a loading indicator using SweetAlert
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
              title: 'Successfully logged in!',
              showConfirmButton: false,
              timer: 1500,
            });
              setUserEmail('');
              setUserPassword('');
              navigate('/dashboard');
          },
        });
      })
      .catch((error) => 
      {
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
            Swal.fire
            ({
              allowOutsideClick: false,
              icon: 'error',
              title: 'Error!',
              text: 'Invalid Credentials!',
              showConfirmButton: true,
              confirmButtonColor: '#860A35',
              confirmButtonText: 'Try again',
            }).then(() =>
            {
              console.log("hello")
              setUserEmail('');
              setUserPassword('');
            });
           
          },
        });
      });
  };
  
  // Function to handle form submission when login fails
  const onFinishFailed = () => 
  {
    // Display an error message using SweetAlert
    if(useremail === "" || userpassword === "")
    {
        Swal.fire
      ({

        icon: 'error',
        title: 'Error!',
        text: 'Please input your email and password',
        showConfirmButton: true,
        confirmButtonColor: '#860A35',

      });
    }
  };

  // Function to handle forgot password
  const forgoPassword = async () =>
  {
    const { value: useremail } = await Swal.fire
    ({
      title: "Input email address",
      input: "email",
      inputLabel: "Your email address",
      inputPlaceholder: "Ex. JohnDoe@gmail.com",
      confirmButtonColor: '#557C55',
      confirmButtonText: 'Send',
    });
    if (useremail) 
    {
      Swal.fire(`Email has been sent: ${useremail}`);
      
      const auth = getAuth(firebaseConfig);
      sendPasswordResetEmail(auth, useremail)
        .then(() => 
        {
          // Password reset email sent!
          setUserEmail('');
          setUserPassword('');
          
        })
        .catch((error) => 
        {
          const errorCode = error.code;
          const errorMessage = error.message;
        });
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <img src={LoginCreateBg} alt="" className="z-n1 position-absolute img-fluid" />
        <div className="container-fluid">
          <div className="row d-flex align-items-center justify-content-center">
            <div className="col-sm-3">
            <div className="card p-5 shadow-lg">
              {/* Ant Design Form for user input */}
              <Form
                  name="basic"
                  labelCol=
                      {{
                          span: 8,
                      }}
                  wrapperCol=
                      {{
                          span: 16,
                      }}
                  style=
                      {{
                          maxWidth: 600,
                      }}
                  initialValues=
                      {{
                          remember: true,

                      }}
                      onFinish={onFinish}
                      onFinishFailed={onFinishFailed}
                      autoComplete="off"
                      
                  >
                  {/* Input field for email */}
                  <Form.Item
                      label="Email"
                      name="email"
                      onChange={e => setUserEmail(e.target.value)}
                      rules=
                          {[
                          {   
                              type: 'email',
                              required: true,
                              message: 'Please input your email!',
                          },
                          ]}
                  >
                  <Input />
                  </Form.Item>

                  {/* Input field for password */}  
                  <Form.Item
                      label="Password"
                      name="password"
                      onChange={e => setUserPassword(e.target.value)}
                      rules=
                          {[
                          {
                              required: true,
                              message: 'Please input your password!',
                          },
                          ]}
                  >
                  <Input.Password />
                  </Form.Item>

                  {/* Submit button */}
                  
                  <div className="container-fluid">
                    <div className="row d-flex align-items-center justify-content-center">
                      <div className="col">
                        <Form.Item
                          wrapperCol=
                          {{
                              offset: 4,
                              span: 16,
                          }}
                          >
                          <Button 
                              type="primary" 
                              htmlType="submit"
                              style={{ background: "black"}}      
                          >
                          Sign In
                          </Button>
                          <span className="ms-2">Or <NavLink to="/createaccount" className="text-dark ms-1">Register now!</NavLink></span>
                      </Form.Item>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-end justify-content-center">
                    <div className="row">
                      <span><NavLink onClick={forgoPassword} className="text-dark">Forgot password?</NavLink></span>   
                    </div>
                  </div>
              </Form>
            </div>
            </div>
          </div>
          
        </div>
    </div>
  );
};
export default Login;
