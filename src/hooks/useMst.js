import * as React from 'react';

const MstContext = React.createContext(null);
export const { Provider: MstProvider } = MstContext;

export const useMst = () => {
  const store = React.useContext(MstContext);
  return store;
};
