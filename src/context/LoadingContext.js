import React from 'react';
import LoadingEffect from '../app/(components)/loadingEffect';
import { createContext } from 'react';

export const LoadingContext = createContext(false);

export default function LoadingContextProvide({ children }) {
  const [loading, setLoading] = React.useState(false); 

  React.useEffect(() => {
    
  });

  return (
    <LoadingContext.Provider value={{ loading }}>
      {loading ? <LoadingEffect /> : children}
    </LoadingContext.Provider>
  );
}