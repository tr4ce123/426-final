import { useState } from 'react'
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import './App.css'
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import MainLayout from './layouts/MainLayout';
import NotFound from './pages/NotFound';
import Page from './pages/Page'

// This is new to react-router-dom version 6.28
// https://reactrouter.com/en/main/start/overview#client-side-routing
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<LandingPage />} />

      <Route element= {<MainLayout />}> 
          <Route path="/home" element={<HomePage />} />
          <Route path="/page1" element={<Page />} />
          <Route path="*" element={<NotFound />} />
      </Route>

    </>
  )
);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
