import React, { useState, useEffect, useContext } from 'react';
import { authService } from '../../services';

export interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: any;
  storeToken: (token: string) => void;
  authenticateUser: () => void;
  logOutUser: () => void;
}

const AuthContext = React.createContext<AuthContextType | {}>({});

export const useAuthContext = () => useContext(AuthContext);

interface AuthProviderWrapperProps {
  children: React.ReactNode;
}

export const AuthContextProvider = (props: AuthProviderWrapperProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const storeToken = (token: string) => {
    localStorage.setItem('authToken', token);
  };

  const authenticateUser = () => {
    const storedToken = localStorage.getItem('authToken');

    if (storedToken) {
      authService
        .verify()
        .then((response: { data: any }) => {
          const user = response.data;
          setIsLoggedIn(true);
          setIsLoading(false);
          setUser(user);
        })
        .catch((error: any) => {
          if (error) {
            setError(error);
          }
          setIsLoggedIn(false);
          setIsLoading(false);
          setUser(null);
        });
    } else {
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
    }
  };

  const removeToken = () => {
    localStorage.removeItem('authToken');
  };

  const logOutUser = () => {
    removeToken();
    authenticateUser();
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        storeToken,
        authenticateUser,
        logOutUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
