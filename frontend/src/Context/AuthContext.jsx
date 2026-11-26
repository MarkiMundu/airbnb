import React, { createContext, useState } from "react";

export const authDataContext = createContext(null);
function AuthContext({ children }) {
  const serverUrl = (import.meta.env.VITE_SERVER_URL || "https://airbnbin-backend.onrender.com").replace(/\/$/, "");
  const [loading, setLoading] = useState(false);
  return <authDataContext.Provider value={{ serverUrl, loading, setLoading }}>{children}</authDataContext.Provider>;
}
export default AuthContext;
