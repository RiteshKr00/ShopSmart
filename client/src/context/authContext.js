import { useState, useContext, useEffect, createContext } from "react";
//create a context which can be a wraaped arround children
import axios from "axios";
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  //create some state which need to be accesed globally
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });
  //axios default
  axios.defaults.headers.common.Authorization = auth?.token;

  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const parseData = JSON.parse(data);
      // console.log(parseData);
      setAuth({ ...auth, user: parseData.user, token: parseData.accessToken });
    }
  }, []);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

//customHook to read context(so that we can read value provided in authcontext above)
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
