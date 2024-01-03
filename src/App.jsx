// Importing necessary modules from React and other libraries
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
          <Route path="/dashboard" element={<Table />} />
          <Route path="/addemployee" element={<AddEmployee />} />
          <Route path="/editemployee/:id" element={<EditEmployee />} />
          </Route>
          {/* Route for handling 404 (Not Found) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
  );
};
// Exporting the App component as the default export
export default App;
