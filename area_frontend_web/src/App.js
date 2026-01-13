import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from 'react';

import HomePage from './Pages/Home/Home';
import Register from "./Pages/Register/Register";
import Login from "./Pages/Login/Login";
import Services from "./Pages/Service/Service";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Library from "./Pages/Library/Library";
import CreateArea from "./Pages/CreateArea/CreateArea";
import MainLayout from "./Components/Templates/MainLayout/MainLayout";
import ProtectedRoute from "./Components/Atoms/ProtectedRoute/ProtectedRoute";
import Profil from "./Pages/Profil/Profil";
import ServiceDetail from "./Pages/ServiceDetail/ServiceDetail";
import AddService from "./Pages/AddService/AddService";
import AddAction from "./Pages/AddAction/AddAction";
import AddReaction from "./Pages/AddReaction/AddReaction";
import Admin from "./Pages/Admin/Admin";
import EditWorkflow from "./Pages/EditWorkflow/EditWorkflow";
import Templates from "./Pages/Templates/Templates";
import UseTemplate from "./Pages/UseTemplate/UseTemplate";
import { AuthProvider } from "./Context/AuthContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<HomePage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/workflow/:id/edit" element={<EditWorkflow />} />
                <Route path="/create" element={<CreateArea />} />
                <Route path="/services" element={<Services />} />
                <Route path="/service/:id" element={<ServiceDetail />} />
                <Route path="/library" element={<Library />} />
                <Route path="/profil" element={<Profil />} />
                <Route path="/add-service" element={<AddService />} />
                <Route path="/add-action" element={<AddAction />} />
                <Route path="/add-reaction" element={<AddReaction />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/template/:id/use" element={<UseTemplate />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
