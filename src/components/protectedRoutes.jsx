import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, user }) => {
  return user ? (<>
  <Header /> 
    {children} 
  <Footer />
  </>) : <Navigate to="/"></Navigate>;
};
