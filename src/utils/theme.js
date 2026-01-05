import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const scheme = useColorScheme();

  const theme = {
    colors: {
      primary: '#007bff',
      secondary: '#6c757d',
      success: '#28a745',
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};