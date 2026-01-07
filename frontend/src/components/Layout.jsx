import React from 'react'
import {Navbar} from "../components/Navbar"
import {Outlet} from "react-router-dom"

export function Layout() {
  return (
    <div className="layout-container">
      <Navbar />
      <Outlet />
    </div>
  )
}
