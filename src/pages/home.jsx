import { useState } from "react";
import { Navigate } from "react-router-dom";

import { auth } from "./firebase";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export const Home = ({ user }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUpActive, setIsSignUpActive] = useState(true);
  const handleMethodChange = () => {
    setIsSignUpActive(!isSignUpActive);
  };
  const handleSignUp = () => {
    if (!email || !password) return;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.errormessage;
        console.log(errorCode, errorMessage);
      });
  };

  const handleSignIn = () => {
    if (!email || !password) return;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.errormessage;
        console.log(errorCode, errorMessage);
      });
  };
  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  if (user) {
    return <Navigate to="/private"></Navigate>;
  }

  return (
    <section>
      <h2>Homepage</h2>

      <form>
        {isSignUpActive && <legend>Sign UP</legend>}
        {!isSignUpActive && <legend>Log IN</legend>}

        <fieldset>
          <ul>
            <li>
              <label htmlFor="email">Email</label>
              <input type="text" id="email" onChange={handleEmailChange} />
            </li>
            <li>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                onChange={handlePasswordChange}
              />
            </li>
          </ul>
          {isSignUpActive && (
            <button type="button" onClick={handleSignUp}>
              Sign Up
            </button>
          )}
          {!isSignUpActive && (
            <button type="button" onClick={handleSignIn}>
              Log In
            </button>
          )}
        </fieldset>
        {isSignUpActive && <a onClick={handleMethodChange}> Login </a>}
        {!isSignUpActive && (
          <a onClick={handleMethodChange}> Create an Account </a>
        )}
      </form>
    </section>
  );
};
