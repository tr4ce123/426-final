import { useState } from 'react'
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import './App.css'
import HelloWorld from './HelloWorld';

// This is new to react-router-dom version 6.28
// https://reactrouter.com/en/main/start/overview#client-side-routing
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<HelloWorld />} />
  )
);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
