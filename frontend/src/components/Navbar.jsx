import React, { useState, useEffect } from 'react'
import {Link, useNavigate} from "react-router-dom"
import { pageData } from './pageData'

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const token = sessionStorage.getItem("User")
    if (token) {
      setIsLoggedIn(true)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUserName(payload.name || payload.email || "User")
      } catch (e) {
        setIsLoggedIn(false)
      }
    } else {
      setIsLoggedIn(false)
    }
  }, [])

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      sessionStorage.removeItem("User")
      setIsLoggedIn(false)
      navigate("/")
    }
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className='navbar'>
      {pageData.map((page, index) => {
        return (
          <Link to={page.path} className='nav-item' key={index}>
            <button className="navButton">
              {page.name}
            </button>
          </Link>
        );
      })}
      <button className="navButton btn-logout" onClick={handleLogout}>
        Logout
      </button>
    </div>
  )
}
