// AuthLayout.jsx
import React from 'react'
import Navbar from '../Component/Dashboard/Navbar'
import { Outlet } from 'react-router-dom'

function AuthPage() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default AuthPage