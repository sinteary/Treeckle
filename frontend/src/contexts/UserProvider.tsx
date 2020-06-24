import React, { useState, useEffect } from "react";

type UserContextType = {
  token: string | null;
  name: string | null;
  profilePic: any;
  role: string | null;
  setUser: (
    token: string | null,
    name: string | null,
    profilePic: string | null,
    role: string | null
  ) => void;
  resetUser: () => void;
};

export const Context = React.createContext<UserContextType>({
  token: null,
  name: null,
  profilePic: null,
  role: null,
  setUser: (
    token: string | null,
    name: string | null,
    profilePic: any,
    role: string | null
  ) => {},
  resetUser: () => {},
});

type Props = {
  children: any;
};

function UserProvider(props: Props) {
  const [token, setToken] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setName(localStorage.getItem("name"));
    const getProfilePic = localStorage.getItem("profilePic");
    //console.log("Profile pic", getProfilePic);
    setProfilePic(getProfilePic ? JSON.parse(getProfilePic) : getProfilePic);
    setRole(localStorage.getItem("role"));
  }, []);

  const setUser = (
    token: string,
    name: string,
    profilePic: string,
    role: string
  ) => {
    setToken(token);
    setName(name);
    setProfilePic(profilePic);
    setRole(role);

    localStorage.setItem("token", token);
    localStorage.setItem("name", name);
    localStorage.setItem(
      "profilePic",
      profilePic ? JSON.stringify(profilePic) : profilePic
    );
    localStorage.setItem("role", role);
  };

  const resetUser = () => {
    setToken(null);
    setName(null);
    setProfilePic(null);
    setRole(null);
    localStorage.clear();
  };

  return (
    <Context.Provider
      value={{
        token: token,
        name: name,
        profilePic: profilePic,
        role: role,
        setUser: setUser as (
          token: string | null,
          name: string | null,
          profilePic: any,
          role: string | null
        ) => void,
        resetUser: resetUser as () => void,
      }}
    >
      {props.children}
    </Context.Provider>
  );
}

export default UserProvider;