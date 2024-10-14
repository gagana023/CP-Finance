import { Navigate } from "react-router-dom";
import Link from '@mui/material/Link';
const Dashboard = ({ }) => {
  return <div>Dashbaord

<Link
                  href="/login"
                  variant="body2"
                  sx={{ alignSelf: 'center' }}
                  color="inherit"
                >
                  Login
                </Link>
  </div>;
};

export default Dashboard
