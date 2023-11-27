// Importing necessary modules and components
'use client';

import { useEffect, useState } from "react";
import { NavLink } from 'react-router-dom';

import Pie from './Pie'

import { getFirestore, deleteDoc, doc } from "firebase/firestore";
import firebaseConfig from '../FirebaseConfig';

import { DataTable } from 'mantine-datatable';
import { ActionIcon, TextInput, Group, Modal} from '@mantine/core';
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
function Table({employees, handleEdit}) 
{

  const handleRowClick = (employee) => 
  {
    setSelectedEmployee(employee);
    open(); // Open the modal
  };

  const [opened, { open, close }] = useDisclosure(false);


  // State for the current page and records to be displayed
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState(employees.slice(0, PAGE_SIZE));
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filteredData, setFilteredData] = useState(employees); // Add this state

 
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
              { accessor: "id", 
                width: 50,
                title:"ID",
                textAlign: "center",
              },
              { accessor: "Name",
                render: ({ firstName, lastName }) => `${firstName} ${lastName}`,
                width: 300,
                textAlign: "center", 
                filter: (
                  <TextInput
                    label="Employees"
                    description="Show employees whose names include the specified text"
                    placeholder=" Search employees..."
                    style={{ padding: "8px" }}
                    rightSection=
                    {
                      <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setQuery('')}>
                        <IconX size={16} />
                      </ActionIcon>
                    }
                    value={query}
                    onChange={(e) => setQuery(e.currentTarget.value)}
                  />
                ),
                filtering: query !== '',
              },
              { accessor: "email", 
                width: 250,
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
          <Modal opened={opened} onClose={() => { close(); setSelectedEmployee(null); }} title="Employee data" size="md" centered>
          {selectedEmployee && (
            <div className="card p-3 m-3">
              <p>First Name: {`${selectedEmployee.firstName}`}</p>
              <p>Last Name: {`${selectedEmployee.lastName}`}</p>
              <p>Gender: {selectedEmployee.gender}</p>
              <p>Position: {selectedEmployee.position}</p>
              <p>Address: {selectedEmployee.address}</p>
              <p>Email: {selectedEmployee.email}</p>
              <p>Salary: {formatter.format(selectedEmployee.salary)}</p>
              <p>Date hired: {selectedEmployee.date}</p>
            </div>
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