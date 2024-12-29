import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import dataApi from './api/dataApi';
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getMe } from "./redux/actions/userActions";
import { unwrapResult } from "@reduxjs/toolkit";
import firebase from 'firebase';

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [productList, setProductList] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProductList = async () => {
      try {
        const params = {
          _page: 1,
          _limit: 10,

        };
        const response = await dataApi.getAll(params);
        console.log(response);
        setProductList(response.data);
      } catch (error) {
        console.log('Failed to fetch product list: ', error);
      }
    }

    fetchProductList();
  }, []);

  // Handle firebase auth changed
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        // user logs out, handle something here
        console.log('User is not logged in');
        return;
      }

      // Get me when signed in
      // const action = getMe();
      try {
        const actionResult = await dispatch(getMe());
        const currentUser = unwrapResult(actionResult);
        console.log('Logged in user: ', currentUser);
      } catch (error) {
        console.log('Failed to login ', error.message);
        // show toast error
      }
    });

    return () => unregisterAuthObserver();
  }, []);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/geography" element={<Geography />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
