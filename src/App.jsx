// Modified App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Assuming useAuth might be used in ProtectedRoute or elsewhere
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AuthNotification from './components/auth/AuthNotification';
import ServiceManager from './components/ServiceManager';

// --- Import your scenes ---
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import ServiceRatings from "./scenes/serviceRatings";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import FeedbackScene from "./scenes/feedback"; // <<< 1. IMPORT the new Feedback scene

// --- Import MUI and Theme ---
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import ApiKeyGeneratorPage from './components/ApiKeyGeneratorPage';
import useAxiosPrivate from './api/private';

// --- App Layout Component ---
const AppLayout = () => {
  const [isSidebar, setIsSidebar] = useState(true);
  return (
    <div className="app">
      <Sidebar isSidebar={isSidebar} />
      <main className="content">
        <Topbar setIsSidebar={setIsSidebar} />
        <Outlet /> {/* Nested routes will render here */}
      </main>
    </div>
  );
};

// --- Main App Component ---
function App() {
  const [theme, colorMode] = useMode();
  const [sessionReady, setSessionReady] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  useEffect(() => {
    const refreshSession = async () => {
      try {
        await axiosPrivate.get("/refresh");
        console.log("✅ Session refreshed");
      } catch (err) {
        console.warn("❌ Refresh failed:", err.message);
        // Optionally redirect to login here
      } finally {
        setSessionReady(true); // Prevent rendering app until session is checked
      }
    };

    refreshSession();
  }, [axiosPrivate]);

  // if (!sessionReady) {
  //   return <div>Loading session...</div>;
  // }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* AuthProvider should wrap Routes if ProtectedRoute uses its context */}
        <AuthProvider>
          <AuthNotification />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            {/* ProtectedRoute checks auth, if ok, renders Outlet */}
            <Route path="/" element={<ProtectedRoute />}>
              {/* AppLayout provides Sidebar/Topbar, renders Outlet for scenes */}
              <Route element={<AppLayout />}>
                {/* Define specific scene routes here */}
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="team" element={<Team />} />
                <Route path="contacts" element={<Contacts />} />
                <Route path="invoices" element={<Invoices />} />
                <Route path="form" element={<Form />} />
                <Route path="service-ratings" element={<ServiceRatings />} />
                <Route path="pie" element={<Pie />} />
                <Route path="line" element={<Line />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="geography" element={<Geography />} />
                <Route path="services" element={<ServiceManager />} />
                <Route path="feedback" element={<FeedbackScene />} /> {/* <<< 2. ADD Route for Feedback */}
                <Route path="api-key" element={<ApiKeyGeneratorPage />} />

                {/* Default route: Navigate to dashboard if logged in and at '/' */}
                {/* Alternatively, render Dashboard directly if path is exactly "/" */}
                <Route index element={<Navigate to="/dashboard" replace />} />
                {/* Or: <Route index element={<Dashboard />} /> if you want '/' to show dashboard */}

              </Route> {/* End AppLayout Outlet */}
            </Route> {/* End ProtectedRoute Outlet */}

            {/* Fallback for any other unmatched route */}
            {/* Redirects to login if not caught by protected routes */}
            <Route path="*" element={<Navigate to="/login" replace />} />

          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;