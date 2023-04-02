import { createContext, useContext } from "react";

export interface loginData {
  id: number;
  rol: number;
  clave: string;
  nombre: string;
}
export interface LoginContent {
  user: loginData | null;
  setUser: (c: loginData) => void;
}
export const MyLoginContext = createContext<LoginContent>({
  user: { id: -1, rol: -1, clave: "-1", nombre: "fakei" }, // set a default value
  setUser: () => {},
});
export const useLoginContext = () => useContext(MyLoginContext);
