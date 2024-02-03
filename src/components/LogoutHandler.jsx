import { redirect } from "react-router-dom";

const LogoutHandler = () => {
    window.localStorage.clear();
    // window.location.reload();
};

export default LogoutHandler;
