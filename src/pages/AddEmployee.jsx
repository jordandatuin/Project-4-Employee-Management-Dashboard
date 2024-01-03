// Importing necessary modules and components
import { useState,useEffect  } from 'react'
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import Swal from 'sweetalert2/dist/sweetalert2.js';

import { getFirestore, doc, addDoc, updateDoc, Timestamp, collection } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import firebaseConfig from '../FirebaseConfig';


function AddEmployee ()
{ 

  let navigate = useNavigate();
  const auth = getAuth(firebaseConfig);
  const db = getFirestore(firebaseConfig);

  useEffect(()=> 
  {
    document.title = `Register New Employee`;

    onAuthStateChanged(auth, (user)=>
    {
      if(user) 
      {
       
      }
      
      else 
      {
        navigate("/");
      }
    });

  }, [])


    // State for managing the employee data
    const [employee, setEmployee] = useState 
    ({
        firstName: '',
        lastName: '',
        address: '',
        email: '',
        salary:'',
        date:moment().format('YYYY-MM-DD'),
        gender: '', 
        position: ''
    })

    
    // Function to handle adding a new employee
    const add_employee = async (e) => 
    {
      e.preventDefault();

      // Validation: Check if all fields are filled
      if (
          !employee.firstName || 
          !employee.lastName  || 
          !employee.address   || 
          !employee.email     || 
          !employee.salary    || 
          !employee.date      ||
          !employee.gender    ||
          !employee.position)
      {
        return Swal.fire
        ({
            icon: 'error',
            title: 'Error!',
            text: 'All fields are required.',
            showConfirmButton: true,
        });
      }

      // Email validation using regex
      const isEmailValid = (email) => 
        {
          // Regular expression for basic email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
          return emailRegex.test(email);
        };
        
        // Check if the email is valid
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

 
      const newEmployee = 
      {
        firstName: employee.firstName,
        lastName: employee.lastName,
        address: employee.address,
        email: employee.email,
        salary: employee.salary,
        date: employee.date,
        gender: employee.gender, 
        position: employee.position,
        dataCreated: Timestamp.now()

      };
      
      const docRef = await addDoc(collection(db, 'db-ema'),newEmployee);

      await updateDoc(doc(db, 'db-ema', docRef.id), 
      {
        id: encodeURIComponent(docRef.id),
      });
 
    
      // Clear the form after submitting
      setEmployee
      ({
        firstName: '',
        lastName: '',
        address: '',
        email: '',
        salary: '',
        date: moment().format('YYYY-MM-DD'),
        gender: '',
        position: ''
      });

      console.log(newEmployee);

      // Show success message
      Swal.fire
      ({
        icon: 'success',
        title: 'Added!',
        text: `${employee.firstName} ${employee.lastName}'s data has been Added.`,
        showConfirmButton: false,
        timer: 1500,
      });
    };
    
return (
    <>
      <div className="d-flex flex-column align-items-center justify-content-center m-4">
        <h1 className="fw-bold mb-3 text-center">Add Employee</h1>
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
              setEmployee
              ({...employee,
                address: e.target.value
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
              className="text-black mb-4"
              id="date"
              type="date"
              name="date"
              min={moment().format('YYYY-MM-DD')}
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
                    onClick={add_employee}
                  >
                  Add
                  </button>
                </div>
            </div>
        </form>
      </div>
    </>
  );
};
export default AddEmployee;