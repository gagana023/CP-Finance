import { Navigate } from "react-router-dom";
import Link from '@mui/material/Link';
export const Header = ({ }) => {
    return <div>header
        <Link
            href="/login"
            variant="body2"
            sx={{ alignSelf: 'center' }}
            color="inherit"
        >
            Logout
        </Link>
    </div>;
};
