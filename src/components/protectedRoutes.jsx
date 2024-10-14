import { Navigate } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const ProtectedRoute = ({ children, user, isPrivate }) => {
  return isPrivate ? user ? (<>
  <Header /> 
    {children} 
  <Footer />
  </>) : <Navigate to="/login"></Navigate> : <><Header /> 
    {children} 
  <Footer /></>;
};
