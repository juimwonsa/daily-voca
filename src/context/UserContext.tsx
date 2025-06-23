import React, { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";

// 1. 컨텍스트에서 사용할 값의 타입을 정의합니다.
interface UserContextType {
  uid: string | null;
  setUid: (newUid: string | null) => void;
}

// 2. 컨텍스트를 생성할 때 타입과 기본값(null)을 지정합니다.
const UserContext = createContext<UserContextType | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

// 3. Provider 컴포넌트의 props 타입을 정의합니다.
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [uid, setUidState] = useState<string | null>(null);

  useEffect(() => {
    const storedUid = localStorage.getItem("user-uid");
    if (storedUid) {
      setUidState(storedUid);
    }
  }, []);

  const setUid = (newUid: string | null) => {
    if (newUid) {
      localStorage.setItem("user-uid", newUid);
    } else {
      localStorage.removeItem("user-uid");
    }
    setUidState(newUid);
  };

  const value: UserContextType = { uid, setUid };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// 4. 컨텍스트를 사용하기 위한 커스텀 훅에 명확한 반환 타입을 지정합니다.
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
