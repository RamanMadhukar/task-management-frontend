import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { store } from '../src/app/store/store'
import { injectStore } from './utils/axiosInstance'
import App from './App'
import '../src/index.css'

// Inject store into axios so interceptors can read auth token
injectStore(store)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          gutter={8}
          toastOptions={{
            duration: 3500,
            style: {
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'DM Sans, sans-serif',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)