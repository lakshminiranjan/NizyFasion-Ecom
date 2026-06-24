import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { ClerkProvider } from '@clerk/react'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import * as Sentry from "@sentry/react";



// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

const queryClient = new QueryClient()

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  dataCollection: {
    // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/react/configuration/options/#dataCollection
    // userInfo: false,
    // httpBodies: []
    sendDefaultPii: true,
    enableLogs: true,

    integrations: [
      Sentry.replayIntegration()
    ],
    // Session Replay
    replaysSessionSampleRate: 1.0, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0 // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ClerkProvider>
    </BrowserRouter>
  </React.StrictMode>,
)