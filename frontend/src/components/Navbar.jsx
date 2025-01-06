import React from 'react'
import {Link} from "react-router-dom"
import { pageData } from './pageData'

export  function Navbar() {
  return (
    <div className='navbar'>
      {pageData.map((page, index) => {
        return (
            <Link to = {page.path} className='nav-item' key = {index}>
                <button className = "navButton">
                    {page.name}
                </button>
            </Link>
        );
      })}
    </div>
  )
}
