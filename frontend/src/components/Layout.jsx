import React from 'react'
import { Navbar } from "../components/Navbar"
import { Outlet, Link } from "react-router-dom"

export function Layout() {
  return (
    <div className="layout-container">
      <header className="app-header">
        <Link to="/home" className="brand-logo">Blog.</Link>
        <Navbar />
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
