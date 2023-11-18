import { BrowserRouter, Routes, Route, } from "react-router-dom";
import { useState,useEffect } from 'react'

import { getFirestore, collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseConfig from './FirebaseConfig';

import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

import Login from "./Login"
import CreateAccount from "./CreateAccount"
import NotLogin from "./pages/NotLogin.jsx";
import Layout from "./pages/Layout.jsx";
import Table from "./pages/Table.jsx";
import AddEmployee from "./pages/AddEmployee.jsx";
import EditEmployee from "./pages/EditEmployee.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() 
{
  // State for managing employee data
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => 
  {
    const fetchData = async () => 
    {
      const db = getFirestore(firebaseConfig);
      try 
      {
        const q = query(collection(db, 'db-ema'), orderBy('id'));
  
        onSnapshot(q, (snapshot) => 
        {
          const newStudentList = [];
  
          snapshot.forEach((employee) => 
          {
            const tempEmployee = employee.data();
            tempEmployee['student_id'] = employee.id;
            newStudentList.push(tempEmployee);
          });
  
          setEmployees(newStudentList);
        });
      } catch (e) 
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

  const auth = getAuth(firebaseConfig);
  const [user, setUser] = useState(null);

  useEffect(() => 
  {
    const unsubscribe = onAuthStateChanged(auth, (user) => 
    {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  if (user) 
  {
    return (
      <>
          {/* Router setup */}
          <BrowserRouter>
            <Routes>
            <Route path="/createaccount" element={<CreateAccount />} />
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
        </>
    );
  } 
  
  else 
  {
    return (
      <>
        {/* Router setup */}
        <BrowserRouter>
          <Routes>
          <Route path="/createaccount" element={<CreateAccount />} />
          <Route index element={<Login />} />
            {/* Route for user not login */}
          <Route path="*" element={<NotLogin />} />
          </Routes>
        </BrowserRouter>
      </>
    );
  }


  
}

export default App
