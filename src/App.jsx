import { BrowserRouter, Routes, Route } from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";
import { ProtectedRoute } from "./components/protectedRoutes";

import { Home } from "./pages/home";
import Login  from "./pages/Login";
import Signup  from "./pages/Signup";
import Dashboard  from "./pages/Dashboard";
import Transaction from './pages/Transaction';
import Account from './pages/Account';
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
      console.log('user11',user)
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
            {/* <Route
              path="/private"
              element={
                <ProtectedRoute user={user} isPrivate={true}>
                  <Private></Private>
                </ProtectedRoute>
              }
            ></Route> */}
            <Route  path="/login" element={<ProtectedRoute user={user} isPrivate={false}><Login /></ProtectedRoute>}></Route>
            <Route  path="/signup" element={<ProtectedRoute user={user} isPrivate={false}><Signup /></ProtectedRoute>}></Route>
            <Route  path="/dashboard" element={<ProtectedRoute user={user} isPrivate={true}><Dashboard /></ProtectedRoute>}></Route>
            <Route  path="/account" element={<ProtectedRoute user={user} isPrivate={true}><Account /></ProtectedRoute>}></Route>
            <Route  path="/transaction" element={<ProtectedRoute user={user} isPrivate={true}><Transaction /></ProtectedRoute>}></Route>
            <Route index path="*" element={<ProtectedRoute user={user} isPrivate={true}><Dashboard user={user}></Dashboard></ProtectedRoute>}></Route>
          </Routes>
        </BrowserRouter>
    </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
