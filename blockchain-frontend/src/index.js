import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'C:/Users/16692/Projects/Blockchain-For-Supply-Chain/Blockchain-For-Supply-Chain-1/blockchain-frontend/src/Theme.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>
);
