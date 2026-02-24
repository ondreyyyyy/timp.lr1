import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Edit from "./pages/Edit";
import Delete from "./pages/Delete";
import Form from "./pages/Form";
import Navbar from "./components/Navbar";
import { AuthProvider } from './auth/AuthContext';
import PrivateRoute from './auth/PrivateRoute';
import Login from './auth/Login';
import Register from './auth/Register';

const Layout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute><Layout><Home /></Layout></PrivateRoute>} />
          <Route path="/detail" element={<PrivateRoute><Layout><Detail /></Layout></PrivateRoute>} />
          <Route path="/detail/:id" element={<PrivateRoute><Layout><Detail /></Layout></PrivateRoute>} />
          <Route path="/edit" element={<PrivateRoute><Layout><Edit /></Layout></PrivateRoute>} />
          <Route path="/edit/:id" element={<PrivateRoute><Layout><Edit /></Layout></PrivateRoute>} />
          <Route path="/delete" element={<PrivateRoute><Layout><Delete /></Layout></PrivateRoute>} />
          <Route path="/delete/:id" element={<PrivateRoute><Layout><Delete /></Layout></PrivateRoute>} />
          <Route path="/add" element={<PrivateRoute><Layout><Form /></Layout></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;