import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import CreateContactPage from './pages/CreateContactPage'
import {ProtectedRoute, AuthInitializer,SnackbarProvider} from './index.js';
const router = createBrowserRouter(
  createRoutesFromElements(

    <Route  path='/' element={<Layout/>}>
      <Route  index element={<ProtectedRoute> <HomePage/> </ProtectedRoute>} />
      <Route path='login' element={<LoginPage/>} />
      <Route path='signup' element={<SignupPage/>} />
      <Route path='new' element={<ProtectedRoute> <CreateContactPage /></ProtectedRoute>} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StrictMode>
      <AuthInitializer>
        <SnackbarProvider>
          <RouterProvider router={router} />
        </SnackbarProvider>
      </AuthInitializer>
    </StrictMode>
  </Provider>
)
