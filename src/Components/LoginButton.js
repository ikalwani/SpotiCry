// src/components/LoginButton.js
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = ({ className, refElement }) => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      className={className}
      ref={refElement}
      onClick={() => loginWithRedirect()}
    >
      Get Started
    </button>
  );
};

export default LoginButton;
