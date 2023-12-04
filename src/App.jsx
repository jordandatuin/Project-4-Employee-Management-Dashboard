// Importing necessary modules from React and other libraries
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from 'react';

import { getFirestore, collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import firebaseConfig from './FirebaseConfig';

import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

// Importing components
import Login from "./Login";
import CreateAccount from "./CreateAccount";
import Layout from "./pages/Layout.jsx";
import Table from "./pages/Table.jsx";
import AddEmployee from "./pages/AddEmployee.jsx";
import EditEmployee from "./pages/EditEmployee.jsx";
import NotFound from "./pages/NotFound.jsx";

// Main App component
function App() 
{
  // State for managing employee data
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Effect to fetch data when component mounts
  useEffect(() => 
  {
    const fetchData = async () => 
    {
      const db = getFirestore(firebaseConfig);
      try 
      {
        // Querying the 'db-ema' collection and ordering by 'id'
        const q = query(collection(db, 'db-ema'), orderBy('id'));

        // Listening for snapshot changes and updating state accordingly
        onSnapshot(q, (snapshot) => 
        {
          const newEmployeeList = [];

          snapshot.forEach((employee) => 
          {
            const tempEmployee = employee.data();
            tempEmployee['employee_id'] = employee.id;
            newEmployeeList.push(tempEmployee);
          });

          setEmployees(newEmployeeList);
        });
      } 
      // Handling errors and showing a notification
      catch (e) 
      {
        Swal.fire
        ({
          icon: 'error',
          title: 'Could not fetch data!',
          showConfirmButton: false,
          timer: 1500,
        });
        console.error('Error fetching data:', e);
      }
    };

    fetchData();
  }, []);

  // Function to handle editing an employee
  const handleEdit = id => 
  {
    const [employee] = employees.filter(employee => employee.id === id);

    setSelectedEmployee(employee);
    console.log(employee);
  };

  // Render the component
  return (
      <BrowserRouter>
        <Routes>
          {/* Route for Login */}
          <Route index element={<Login />} />
          {/* Route for Create account */}
          <Route path="/createaccount" element={<CreateAccount />} />
          {/* Route for Layout */}
          <Route path="/" element={<Layout />}>
          {/* Nested routes for Dashboard, AddEmployee, EditEmployee */}
          <Route path="/dashboard" element={<Table employees={employees} setEmployees={setEmployees} handleEdit={handleEdit} />} />
          <Route path="/addemployee" element={<AddEmployee employees={employees} setEmployees={setEmployees} />} />
          <Route path="/editemployee" element={<EditEmployee employees={employees} selectedEmployee={selectedEmployee} setEmployees={setEmployees} />} />
          </Route>
          {/* Route for handling 404 (Not Found) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
  );
};
// Exporting the App component as the default export
export default App;
