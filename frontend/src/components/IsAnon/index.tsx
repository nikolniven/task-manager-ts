import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext, AuthContextType } from '../../context';
import Loading from '../Loading';

interface IsAnonProps {
  children: ReactNode;
}

const IsAnon: React.FC<IsAnonProps> = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuthContext() as AuthContextType;

  if (isLoading) {
    return <Loading />;
  }

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default IsAnon;
