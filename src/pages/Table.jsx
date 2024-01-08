// Importing necessary modules and components
'use client';

import { useEffect, useState } from "react";
import { NavLink, useNavigate } from 'react-router-dom';

import Pie from './Pie'

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, query, orderBy,deleteDoc, doc, } from 'firebase/firestore';
import firebaseConfig from '../FirebaseConfig';

import { DataTable } from 'mantine-datatable';
import { ActionIcon, TextInput, Group, Modal, Loader} from '@mantine/core';
import { useDebouncedValue,useDisclosure  } from '@mantine/hooks';
import { IconX, IconEdit,IconTrash, IconEye } from "@tabler/icons-react";
import { MantineProvider } from "@mantine/core";


// Importing styles for Mantine components
import Swal from 'sweetalert2';
import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';

// Constant defining the number of records per page in the table
const PAGE_SIZE = 10;

// Table component
function Table() 
{
  
  let navigate = useNavigate();

  // Initialize Cloud Firestore and get a reference to the service
  const auth = getAuth(firebaseConfig);
  const db = getFirestore(firebaseConfig);

  // State for managing employee data
  const [employees, setEmployees] = useState([]);

  // State for the current page and records to be displayed
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState(employees.slice(0, PAGE_SIZE));
  const [querys, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(querys, 200);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filteredData, setFilteredData] = useState(employees);
  const [fetching, setFetching] = useState(true);


  useEffect(()=> 
  {
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

    // Effect to fetch data when component mounts
    useEffect(() => 
    {
      const fetchData = async () => 
      {
        setFetching(true);
        try 
        {
          // Querying the 'db-ema' collection and ordering by 'id'
          const q = query(collection(db, 'db-ema'), orderBy('dataCreated'));
  
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
            setFetching(false);
          });
        } 
        // Handling errors and showing a notification
        catch (e) 
        {
          setFetching(false);
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

  const [opened, { open, close }] = useDisclosure(false);

  // useEffect to filter records based on the debounced query
  useEffect(() => 
  {
    document.title = `Dashboard`;

    // Filter records based on the debounced query
    const dataAfterFilter = employees.filter(({ firstName, lastName }) => 
    {
      if (
        debouncedQuery !== '' &&
        !`${firstName} ${lastName}`.toLowerCase().includes(debouncedQuery.trim().toLowerCase())
      ) 
      {
        return false;
      }
      return true;
    });

    // Update the totalRecords to reflect the filtered data
    setFilteredData(dataAfterFilter);

    // Reset the page to 1 when applying a new filter
    setPage(1);
  }, [debouncedQuery, employees]);

  useEffect(() => 
  {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;

    // Update the records based on the filteredData
    setRecords(filteredData.slice(from, to));
  }, [page, filteredData]);

  // Formatting salary with currency
  const formatter = new Intl.NumberFormat("en-US", 
  {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: null,
  });

  
  const handleRowClick = (employee) => 
  {
    setSelectedEmployee(employee);
    open(); // Open the modal
  };



  // Function to handle editing an employee
  const handleEdit = id => 
  {
    const [employee] = employees.filter(employee => employee.id === id);

    navigate(`/editemployee/${id}`, { state: { selectedEmployee: employee } });
  };

  const handleDelete = id => 
  {
    Swal.fire
    ({
      allowOutsideClick: false,
      icon: 'warning',
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: '#860A35',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then(result => 
      {
      if (result.value) 
      {
        
        const [employee] = employees.filter(employee => employee.id === id);

        Swal.fire
        ({
          icon: 'success',
          title: 'Deleted!',
          text: `${employee.firstName} ${employee.lastName}'s data has been deleted.`,
          showConfirmButton: false,
          timer: 1500,
        });

        const employeeId = String(id);
        const db = getFirestore(firebaseConfig);
        (
          deleteDoc(doc(db, "db-ema", employeeId))
        );
        setPage(1);
      }
    });
  };

  // Rendering the component
  return (
    <>
      <div className="align-items-center justify-content-center table-container">
        <div className="row">
          <div className="col-sm-5">
          <h1 className="display-4 mb-4">Roles Percentage</h1>
            <Pie />
          </div>

          <div className="col-sm-7">
          <h1 className="display-4 mb-4">Employee List</h1>
        <MantineProvider>
          <DataTable
            fetching={fetching}
            loaderType="bars"
            loaderSize="xl"
            loaderColor="grey"
            loaderBackgroundBlur={3}
            borderRadius="sm"
            shadow="xl"
            striped
            highlightOnHover
            horizontalSpacing="md"
            verticalSpacing="md"
            fz="lg"
            paginationActiveBackgroundColor="#212529"
            height={380}
            records={records}
            noRecordsText="No records to show"
            columns={[
              { accessor: "Name",
                render: ({ firstName, lastName }) => `${firstName} ${lastName}`,
                width: 300,
                textAlign: "center", 
                filter: (
                  <>
                    <TextInput
                      label="Employees"
                      description="Show employees whose names include the specified text"
                      placeholder="Search employees..."
                      className="m-4"
                      rightSection=
                      {
                        <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setQuery('')}>
                          <IconX size={14} />
                        </ActionIcon>
                      }
                      value={querys}
                      onChange={(e) => setQuery(e.currentTarget.value)}
                    />
                  </>
                ),
                filtering: querys !== '',
              },
              { accessor: "email", 
                width: 200,
                textAlign: "center",
              },
              { accessor: "Date hired", 
               render: ({ date }) => `${date}`,
               width: 200,
               textAlign: "center",
              },
              {
                accessor: 'actions',
                width: 80,
                textAlign: "center",
                render: (employee) => (
                  <Group gap={6} justify="center" wrap="nowrap">
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      color="black"
                      onClick={() => handleRowClick(employee)}
                    >
                      <IconEye size={16} />
                    </ActionIcon>

                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      color="green"
                      onClick={() => handleEdit(employee.id)}
                    >
                      <NavLink to="/editemployee" className="nav-link btn btn-info bg-transparent">
                        <IconEdit size={20} />
                      </NavLink>
                      
                    </ActionIcon>
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      color="red"
                      onClick={() => handleDelete(employee.id)}
                    >
                      <IconTrash size={20} />
                    </ActionIcon>
                  </Group>
                ),
              },
            ]}
            
            totalRecords={employees.length}
            recordsPerPage={PAGE_SIZE}
            page={page}
            onPageChange={(p) => setPage(p)}
          />
          <Modal opened={opened} onClose={() => { close(); setSelectedEmployee(null); }} size="md" centered>
          {selectedEmployee && 
          (
            <>
            <h6 className="display-6 text-center">Employee Data</h6>
            <div className="card p-3 m-3">
              <p>Employee ID: {`${selectedEmployee.id}`}</p>
              <p>First Name: {`${selectedEmployee.firstName}`}</p>
              <p>Last Name: {`${selectedEmployee.lastName}`}</p>
              <p>Gender: {selectedEmployee.gender}</p>
              <p>Position: {selectedEmployee.position}</p>
              <p>Address: {selectedEmployee.address}</p>
              <p>Email: {selectedEmployee.email}</p>
              <p>Salary: {formatter.format(selectedEmployee.salary)}</p>
              <p>Date hired: {selectedEmployee.date}</p>
            </div>
            </>
          )}
        </Modal>
        </MantineProvider>
          </div>
        </div>
      </div>
    </>
  );
}
export default Table;