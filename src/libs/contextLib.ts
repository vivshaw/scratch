import { createContext, useContext } from "react";

export const AppContext = createContext({ isAuthenticated: false });

export function useAppContext() {
  return useContext(AppContext);
}
