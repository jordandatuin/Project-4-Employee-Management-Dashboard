// Importing necessary modules and components
import { useState, useEffect } from "react";

import { Chart } from "react-google-charts";

import { getFirestore, collection, query, orderBy, onSnapshot } from "firebase/firestore";
import firebaseConfig from '../FirebaseConfig';


import Swal from 'sweetalert2';

function PieChart()
{
  // State hook to store employee data    
  const [employees, setEmployees] = useState([]);

  useEffect(() => 
  {
    // Function to fetch data from Firestore
    const fetchData = async () => 
    {
      const db = getFirestore(firebaseConfig);
      try 
      {
        // Firestore query to order data by 'id'
        const q = query(collection(db, 'db-ema'), orderBy('dataCreated'));

        // Snapshot listener to update state when data changes
        onSnapshot(q, (snapshot) => 
        {
          const newEmployeeList = [];

          // Loop through the snapshot and populate the employee list
          snapshot.forEach((employee) => 
          {
            const tempEmployee = employee.data();
            tempEmployee['employee_id'] = employee.id;
            newEmployeeList.push(tempEmployee);
          });

          // Update state with the new employee list
          setEmployees(newEmployeeList);
        });
      } 
      
      catch (e) 
      {
        // Error handling with SweetAlert2
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

    // Call the fetch data function when the component mounts
    fetchData();
  }, []);

  // Count positions
  const positionCount = 
  {
    Manager: 0,
    Developer: 0,
    Designer: 0,
  };

  // Loop through employees and count positions
  employees.forEach((employee) => 
  {
    const position = employee.position;

    if (positionCount.hasOwnProperty(position)) 
    {
      positionCount[position]++;
    }
  });

  // Update data array for the pie chart
  const data = 
  [
    ["Position", "Count"],
    ["Manager", positionCount.Manager],
    ["Developer", positionCount.Developer],
    ["Designer", positionCount.Designer],
  ];

  // Chart options
  const options = 
  {
    is3D: true,
    backgroundColor: "transparent",
  };

  // Return the Chart component with the specified data and options
  return (
    <Chart
      chartType="PieChart"
      data={data}
      options={options}
      width={"100%"}
      height={"380px"}
    />
  );
};

export default PieChart;
