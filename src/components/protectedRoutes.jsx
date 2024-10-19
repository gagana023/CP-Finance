import { Navigate } from "react-router-dom";
import { Header } from "./Header";
import Footer from "./Footer";

export const ProtectedRoute = ({ children, user, isPrivate }) => {
  console.log('user', user);

  // If the route is private and there's no user, redirect to login
  if (isPrivate && !user) {
    return <Navigate to="/login" />;
  }

  // Render the layout with Header and Footer
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};
