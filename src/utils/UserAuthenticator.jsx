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
  let isLoggedIn = localStorage.getItem("auth_token") !== undefined && localStorage.getItem("auth_token") !== null;
  return isLoggedIn;
}

export { checkIfUserLoggedIn };
export default handleSignOut;