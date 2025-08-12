import React from 'react'
import Navbar from './Component/Navbar'
import Footer from './Component/Footer'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <>
    <Navbar/>
    <Outlet />
    <Footer />
    </>
  )
}

export default Layout