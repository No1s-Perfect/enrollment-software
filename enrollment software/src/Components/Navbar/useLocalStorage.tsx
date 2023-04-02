import { useState } from "react";

export function useLocalStorage(initialValue: any) {
  const [user, setUserLocal] = useState<any>(() => {
    try {
      const item: any = window.localStorage.getItem("user");
      return item ? JSON.parse(item) : initialValue;
    } catch (e) {
      return initialValue;
    }
  });

  const setUser = (value: any) => {
    try {
        setUserLocal(value);
      window.localStorage.setItem("user", JSON.stringify(value));
    } catch (e) {}
  };
  return [user, setUser];
}

export default useLocalStorage;
