import { useEffect, useState } from "react";

function UserAuthenticator() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  
    useEffect(() => {
      const token = localStorage.getItem("auth_token");
      if (token) {
          setIsUserLoggedIn(true);
        }
      }, []);
    }
  function handleSignOut() {
    localStorage.clear();
  }

  function checkIfUserLoggedIn() {
    console.log("In the authenticator: " + UserAuthenticator.isUserLoggedIn);
    return UserAuthenticator.isUserLoggedIn;
  }

export {checkIfUserLoggedIn};
export default handleSignOut;