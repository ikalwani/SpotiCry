// src/components/Profile.js
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = ({ className, refElement }) => {
  const { user } = useAuth0();

  return (
    <article
      className={className}
    >
      {JSON.stringify(user)}
    </article>
  );
};

export default Profile;
