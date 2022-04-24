import { useContext, createContext } from "react";

export const adminContext = createContext(null);

export function useAdminContext() {
  return useContext(adminContext);
}