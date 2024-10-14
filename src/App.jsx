import { BrowserRouter, Routes, Route } from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";
import { ProtectedRoute } from "./components/protectedRoutes";

import { Home } from "./pages/home";
import Login  from "./pages/Login";
import Signup  from "./pages/Signup";
import Dashboard  from "./pages/Dashboard";
import { Private } from "./pages/private";
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { StyledEngineProvider } from '@mui/material';

import "./App.css";
import { useEffect, useState } from "react";
import { auth } from "./pages/firebase";

function App() {
  const [user, setUser] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsFetching(false);
        return;
      }

      setUser(null);
      setIsFetching(false);
    });
    return () => unsubscribe();
  }, []);

  if (isFetching) {
    return <h2>Loading...</h2>;
  }

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route index path="/" element={<Home user={user}></Home>}></Route>
            <Route
              path="/private"
              element={
                <ProtectedRoute user={user}>
                  <Private></Private>
                </ProtectedRoute>
              }
            ></Route>
            <Route  path="/login" element={<Login />}></Route>
            <Route  path="/signup" element={<Signup />}></Route>
            <Route  path="/dashboard" element={<Dashboard />}></Route>
          </Routes>
        </BrowserRouter>
    </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
