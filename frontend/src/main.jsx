import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './Layout'
import {ProtectedRoute, AuthInitializer,SnackbarProvider, Person, UserAccountPage, LabelFilterPage} from './index.js';
import {EditContactPage,CreateContactPage,SignupPage,LoginPage,HomePage,FavoritesPage} from './index'
const router = createBrowserRouter(
  createRoutesFromElements(

    <Route  path='/' element={<Layout/>}>
      <Route  index element={<ProtectedRoute> <HomePage/> </ProtectedRoute>} />
      <Route path='login' element={<LoginPage/>} />
      <Route path='signup' element={<SignupPage/>} />
      <Route path='new' element={<ProtectedRoute> <CreateContactPage /></ProtectedRoute>} />
      <Route path="person/:id" element={<ProtectedRoute><Person /></ProtectedRoute>} />
      <Route path="person/:id/edit" element={<ProtectedRoute><EditContactPage /></ProtectedRoute>} />
      <Route path="favorites" element={<ProtectedRoute> <FavoritesPage showFavorites /> </ProtectedRoute>} />
      <Route path="account" element={<ProtectedRoute> <UserAccountPage /> </ProtectedRoute>} />
      <Route path="label/:id" element={<ProtectedRoute> <LabelFilterPage /> </ProtectedRoute>} />
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
