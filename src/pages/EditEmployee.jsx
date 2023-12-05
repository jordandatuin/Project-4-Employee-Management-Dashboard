// Importing necessary modules and components
import { useState,useEffect  } from 'react'
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2/dist/sweetalert2.js';
import withReactContent from 'sweetalert2-react-content';

import { getFirestore,updateDoc, doc, Timestamp } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import firebaseConfig from '../FirebaseConfig';



function EditEmployee ({selectedEmployee, setEmployees})
{   

  // Create a navigate function from react-router-dom
  let navigate = useNavigate();
  const auth = getAuth(firebaseConfig);
  useEffect(()=> 
  {
    onAuthStateChanged(auth, (user)=>
    {
      if(user) 
      {
          // Set document title
          document.title = `Update Employee`;
          
          // Check if selectedEmployee is null when rendering
          if (selectedEmployee === null) 
          {
            // Redirect to the main page or display an error message
            navigate('/dashboard');
            
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
                  icon: 'error',
                  title: 'Your refresh the page while updating!',
                  showConfirmButton: false,
                  timer: 1500,
                });
              },
            });
            return () => {}; 
          }
      }

      else 
      {
        navigate("/");
      }
    });

  }, [])


  // Initialize the state with the initialEmployeeState
  const initialEmployeeState = selectedEmployee
    ? {
        id: selectedEmployee.id,
        firstName: selectedEmployee.firstName || '',
        lastName: selectedEmployee.lastName || '',
        address: selectedEmployee.address || '',
        email: selectedEmployee.email || '',
        salary: selectedEmployee.salary || '',
        date: selectedEmployee.date || '',
        gender: selectedEmployee.gender || 'Male',
        position: selectedEmployee.position || '',
      }
    : {
        id: '',
        firstName: '',
        lastName: '',
        address: '',
        email: '',
        salary: '',
        date: '',
        gender: 'Male',
        position: '',
      };

  // Check if selectedEmployee is null when rendering
  if (selectedEmployee === null) 
  {
    // Redirect to the main page or display an error message
    navigate('/dashboard');

    return null;
  }

  // State to manage the employee data
  const [employee, setEmployee] = useState(initialEmployeeState);

  // Function to handle the employee update
  const edit_employee = (e) => 
  {
    e.preventDefault();

    // Validation
    if (
        !employee.firstName || 
        !employee.lastName  || 
        !employee.address   || 
        !employee.email     || 
        !employee.salary    || 
        !employee.date      ||
        !employee.gender    ||
        !employee.position
    ) 
    {
      return Swal.fire
      ({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
    }

    // Validate email using a regular expression
    const isEmailValid = (email) => 
    {
      // Regular expression for basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    // Usage:
    const isValid = isEmailValid(employee.email);

    if (!isValid) 
    {
      return Swal.fire
      ({
        icon: 'error',
        title: 'Error!',
        text: 'Please enter a valid email address.',
        showConfirmButton: true,
      });
    }

    Swal.fire
    ({
      allowOutsideClick: false,
      icon: 'warning',
      title: 'Are you sure you want to update employee data?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: '#860A35',
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel!',
    }).then(result => 
      {
      if (result.value) 
      {
        // Create an object with updated employee data
        const updatedEmployee = 
        {
          id: employee.id,
          firstName: employee.firstName,
          lastName: employee.lastName,
          address: employee.address,
          email: employee.email,
          salary: employee.salary,
          date: employee.date,
          gender: employee.gender,
          position: employee.position,
          dataUpdated: Timestamp.now()
        };

        // Initialize Cloud Firestore and get a reference to the service
        const db = getFirestore(firebaseConfig);
        const accountidString = String(employee.id);
        // Update the employee data in Firestore
        updateDoc(doc(db, "db-ema", accountidString),updatedEmployee);
        setEmployees(updatedEmployee);

        // Display a success message using SweetAlert
        const MySwal = withReactContent(Swal);
        MySwal.fire
        ({
          allowOutsideClick: false,
          icon: 'success',
          title: 'Updated!',
          text: `${updatedEmployee.firstName} ${updatedEmployee.lastName}'s data has been updated.`,
          confirmButtonColor: '#198754',
          confirmButtonText: 'Go to Dashboard',
        }).then((result) => 
        {
          if (result.isConfirmed) 
          {
            navigate('/dashboard'); // Navigate to the dashboard when the user clicks "Go to Dashboard"
          }
        });

        // Clear form after updating
        setEmployee
        ({
          id: '',
          firstName: '',
          lastName: '',
          address: '',
          email: '',
          salary: '',
          date: '',
          gender: 'Male',
          position: '',
        });
      }
    });


    
  };
    
return (
    <div className="d-flex flex-column align-items-center justify-content-center m-4">
      <h1 className="fw-bold mb-3">Edit Employee</h1>
      <form>
        {/* Input fields for employee information */}
        <div className="row mb-3">
          <div className="col">
          <label htmlFor="firstname">Fisrt Name:</label>
            <input 
              name="firstname" 
              id="firstname" 
              className="form-control" 
              type="text" 
              placeholder="John"
              maxLength="25"  
              value={employee.firstName}
              onChange={(e) => 
              setEmployee
              ({...employee,
                firstName: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
              })}
              />
          </div>

          <div className="col">
          <label htmlFor="lastname">Last Name:</label>
          <input 
            name="lastname" 
            id="lastname" 
            className="form-control" 
            type="text" 
            placeholder="Doe"
            maxLength="25" 
            value={employee.lastName}
            onChange={(e) => 
              setEmployee
              ({...employee,
                lastName: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
              })}
              />
          </div>
        </div>
        
          
        <label htmlFor="address">Address:</label>
        <textarea
          name="address"
          id="address"
          className="form-control mb-3"
          maxLength="500"
          rows="2"
          value={employee.address}
          onChange={(e) =>
            setEmployee({
              ...employee,
              address: e.target.value,
            })
          }
        />
          
        <label htmlFor="gender">Gender:</label>
          <div className="mb-3">
            <label>
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={employee.gender === 'Male'}
                onChange={(e) => 
                  setEmployee
                  ({...employee, 
                    gender: e.target.value 
                  })}
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={employee.gender === 'Female'}
                onChange={(e) => 
                  setEmployee
                  ({...employee, 
                    gender: e.target.value 
                  })}
              />
              Female
            </label>
          </div>

        <label htmlFor="position">Position:</label>
        <select
          name="position"
          id="position"
          className="form-control mb-3"
          value={employee.position}
          onChange={(e) => 
            setEmployee
            ({...employee, 
              position: e.target.value 
            })}
        >
          <option value="">Select Position</option>
          <option value="Manager">Manager</option>
          <option value="Developer">Developer</option>
          <option value="Designer">Designer</option>
          {/* Add more options as needed */}
        </select>

        <label htmlFor="email">Email:</label>
        <input 
          name="email" 
          id="email" 
          className="form-control mb-3" 
          type="email" 
          placeholder="JohnDoe@gmail.com"
          maxLength="25"
          value={employee.email}
          onChange={(e) => 
            setEmployee
            ({...employee,
              email: e.target.value
            })}
              required
          />

        <label htmlFor="salary">Salary (₱):</label>
        <input 
          name="salary" 
          id="salary" 
          className="form-control mb-3" 
          type="number"
          max={999999999}
          min={0}
          value={employee.salary}
          onChange={(e) => 
            setEmployee
            ({...employee,
              salary: e.target.value
            })}
            />

          <label htmlFor="date">Date hired:</label>
          <input
            className="text-black mb-4 "
            id="date"
            type="date"
            name="date"
            readOnly
            value={employee.date}
            onChange={(e) => 
              setEmployee
              ({...employee,
                date: e.target.value
              })}
          />

          <div className="row">
            <div className="col d-flex flex-column align-items-center justify-content-center">
              <button
                type="button"
                className="btn btn-dark"
                onClick={edit_employee}
              >
              Update
              </button>
            </div>
          </div>
        
      </form>
    </div>
  );
};
export default EditEmployee;