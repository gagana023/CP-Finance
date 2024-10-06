import { signOut } from "firebase/auth";
import { auth } from "./firebase";

export const Private = () => {
  const handleSignOut = () => {
    signOut(auth)
      .then(() => console.log("Sign out"))
      .catch((error) => console.log(error));
  };
  return (
    <section>
      <h2>Private Page</h2>
      <button onClick={handleSignOut}>Sign Out</button>
    </section>
  );
};
