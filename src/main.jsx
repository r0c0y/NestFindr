import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store/store';
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';
import './index.css';

const queryClient = new QueryClient({  
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  </ErrorBoundary>
);
