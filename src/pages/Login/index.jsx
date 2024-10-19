import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // Import your firebase configuration
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  margin: 'auto',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: '100%',
  padding: theme.spacing(2),
}));

export const Login = ({ user }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirm password
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false); // Error state for confirm password

  const handleMethodChange = () => {
    setIsSignUpActive(!isSignUpActive);
  };

  const handleSignUp = () => {
    if (!email || !password || !confirmPassword) {
      setEmailError(!email);
      setPasswordError(!password);
      setConfirmPasswordError(!confirmPassword);
      return;
    }
    if (password !== confirmPassword) { // Validate if passwords match
      setConfirmPasswordError(true);
      return;
    }
    
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigate('/')
        console.log("User registered:", user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Sign Up Error:", errorCode, errorMessage);
      });
  };

  const handleSignIn = () => {
    if (!email || !password) {
      setEmailError(!email);
      setPasswordError(!password);
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User signed in:", user);
        navigate('/')

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Sign In Error:", errorCode, errorMessage);
      });
  };

  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);
  const handleConfirmPasswordChange = (event) => setConfirmPassword(event.target.value); // Handle confirm password change

  return (
    <SignInContainer direction="column" justifyContent="center">
      <Card variant="outlined">
        <Typography component="h1" variant="h4" align="center">
          {isSignUpActive ? "Sign Up" : "Log In"}
        </Typography>
        <Box
          component="form"
          onSubmit={(e) => e.preventDefault()}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              error={emailError}
              helperText={emailError ? 'Please enter a valid email.' : ''}
              id="email"
              type="email"
              onChange={handleEmailChange}
              required
              fullWidth
              variant="outlined"
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              error={passwordError}
              helperText={passwordError ? 'Password is required.' : ''}
              id="password"
              type="password"
              onChange={handlePasswordChange}
              required
              fullWidth
              variant="outlined"
            />
          </FormControl>
          {isSignUpActive && ( // Show confirm password field only during signup
            <FormControl>
              <FormLabel htmlFor="confirm-password">Confirm Password</FormLabel>
              <TextField
                error={confirmPasswordError}
                helperText={confirmPasswordError ? 'Passwords must match.' : ''}
                id="confirm-password"
                type="password"
                onChange={handleConfirmPasswordChange}
                required
                fullWidth
                variant="outlined"
              />
            </FormControl>
          )}
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            onClick={isSignUpActive ? handleSignUp : handleSignIn}
          >
            {isSignUpActive ? "Sign Up" : "Log In"}
          </Button>
          <Typography sx={{ textAlign: 'center' }}>
            {isSignUpActive ? "Have an account?" : "Don't have an account?"}{" "}
            <span
              style={{ cursor: 'pointer', color: 'blue' }}
              onClick={handleMethodChange}
            >
              {isSignUpActive ? "Login" : "Create an Account"}
            </span>
          </Typography>
        </Box>
      </Card>
    </SignInContainer>
  );
};

export default Login;
