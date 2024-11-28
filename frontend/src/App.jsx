import { useEffect, useState } from 'react'
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Navigate,
} from 'react-router-dom'
import './App.css'
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import MainLayout from './layouts/MainLayout'
import NotFound from './pages/NotFound'
import Page from './pages/Page'
import Login from './pages/Login'
import ProtectedRoute from './ProtectedRoute'
import axiosInstance from './axios'
import Register from './pages/Register'

function App() {
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setLoading(false)
        return;
      }

      try {
        const { data } = await axiosInstance.get('/protected')
        setUser(data.user)
      } catch (error) {
        console.error('Authentication failed:', error)
        localStorage.removeItem('authToken')
        setUser(null)
      } finally {
        setLoading(false)
      }
    };

    checkAuth()
  }, [])

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path="/"
          element={user ? <Navigate to="/home" /> : <LandingPage />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/home" /> : <Login setUser={setUser} />}
        />
        <Route
          path="/register"
          element={
            user ? <Navigate to="/home" /> : <Register setUser={setUser} />
          }
        />

        <Route element={<MainLayout setUser={setUser} />}>
          <Route
            path="/home"
            element={
              <ProtectedRoute user={user}>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/page1"
            element={
              <ProtectedRoute user={user}>
                <Page />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </>
    )
  )

  if (loading) {
    return (
      <div className="flex justify-center h-screen align-center">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    )
  }

  return <RouterProvider router={router} />
}

export default App
