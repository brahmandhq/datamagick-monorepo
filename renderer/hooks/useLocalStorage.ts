import { useRouter } from "next/router";
import { useState, useEffect } from "react";

function getStorageValue(key, defaultValue) {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(key);
    try {
      const initial = saved !== null ? JSON.parse(saved) : defaultValue;
      return initial;
    } catch (e) {
      return defaultValue || "";
    }
  }
}

export const useLocalStorage = (defaultValue?: any, lsKey?: any) => {
  const router = useRouter();
  const { isReady, pathname } = router;

  const key = lsKey || !isReady ? lsKey : pathname;

  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // console.log(e);
    }
  }, [key, value]);

  return [value, setValue];
};
