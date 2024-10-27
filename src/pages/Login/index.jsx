import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  margin: "auto",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100%",
  padding: theme.spacing(2),
}));

export const Login = ({ user }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const handleMethodChange = () => {
    setIsSignUpActive(!isSignUpActive);
  };

  useEffect(() => {
    // Reset form when switching between login and signup
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }, [isSignUpActive]);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setEmailError(false);
    setPasswordError(false);
    setConfirmPasswordError(false);
  };

  const handleSignUp = () => {
    if (!email || !password || !confirmPassword) {
      setEmailError(!email);
      setPasswordError(!password);
      setConfirmPasswordError(!confirmPassword);
      toast.error("Please fill all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError(true);
      toast.error("Passwords do not match.");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        toast.success("User registered successfully.");
        navigate("/");
        resetForm(); // Reset form after successful sign-up
      })
      .catch((error) => {
        const errorMessage = error.message;
        if (error.message.includes("auth/email-already-in-use")) {
          toast.error("Email already in use.");
        } else {
          toast.error(`Sign Up Error: ${errorMessage}`);
        }
      });
  };

  const handleSignIn = () => {
    if (!email || !password) {
      setEmailError(!email);
      setPasswordError(!password);
      toast.error("Please fill all required fields.");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        toast.success("Login successful.");
        navigate("/");
        resetForm(); // Reset form after successful login
      })
      .catch((error) => {
        const errorMessage = error.message;
        if (error.message.includes("auth/invalid-credential")) {
          toast.error("Invalid credentials.");
        } else {
          toast.error(`Sign In Error: ${errorMessage}`);
        }
      });
  };

  return (
    <SignInContainer direction="column" justifyContent="center">
      <Card variant="outlined">
        <Typography component="h1" variant="h4" align="center">
          {isSignUpActive ? "Sign Up" : "Log In"}
        </Typography>
        <Box
          component="form"
          onSubmit={(e) => e.preventDefault()}
          sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}
        >
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              error={emailError}
              helperText={emailError ? "Please enter a valid email." : ""}
              id="email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              fullWidth
              variant="outlined"
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              error={passwordError}
              helperText={passwordError ? "Password is required." : ""}
              id="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              fullWidth
              variant="outlined"
            />
          </FormControl>
          {isSignUpActive && (
            <FormControl>
              <FormLabel htmlFor="confirm-password">Confirm Password</FormLabel>
              <TextField
                error={confirmPasswordError}
                helperText={confirmPasswordError ? "Passwords must match." : ""}
                id="confirm-password"
                type="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
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
          <Typography sx={{ textAlign: "center" }}>
            {isSignUpActive ? "Have an account?" : "Don't have an account?"}{" "}
            <span
              style={{ cursor: "pointer", color: "blue" }}
              onClick={handleMethodChange}
            >
              {isSignUpActive ? "Login" : "Create an Account"}
            </span>
          </Typography>
        </Box>
      </Card>

      <ToastContainer />
    </SignInContainer>
  );
};

export default Login;
