import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext, AuthContextType } from '../../context/';
import Loading from '../Loading/';

interface IsPrivateProps {
  children: ReactNode;
}

const IsPrivate: React.FC<IsPrivateProps> = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuthContext() as AuthContextType;

  if (isLoading) {
    return <Loading />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default IsPrivate;
