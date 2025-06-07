import { createContext } from 'react';

const SnackbarContext = createContext({
  showSnackbar: () => {},
});

export default SnackbarContext;