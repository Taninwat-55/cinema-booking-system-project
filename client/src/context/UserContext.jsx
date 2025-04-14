import { createContext, useState } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  // const [user, setUser] = useState(
  //   JSON.parse(localStorage.getItem('user')) || null
  // );
  
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return null;

    const parsedUser = JSON.parse(storedUser);

    if (parsedUser.expiry && parsedUser.expiry < new Date().getTime()) {
      localStorage.removeItem('user'); // Expired
      return null;
    }

    return parsedUser;
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
