import React from 'react'
import {getPost} from "../api"
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react';


export  function ReadBlog() {

  const [post, setPost] = useState({})
  let params = useParams()
  const navigate = useNavigate()    // NAVIGATE BACK TO PREV PAGE OR OTHER PAGES
  let id = params.id


  

  useEffect(()=>{

    async function loadPost(){
      let data = await getPost(id)
      let date = new Date(data.dateCreated)
      data.dateCreated = date.toString()
      setPost(data)
    
    }  
    loadPost()
  }, [id])

  return (
    <div>
      <button onClick = {()=> navigate("/home")}>Back</button>   {/*  or -1 */}
      <h1>{post.title}</h1>
      <h2>by: {post.author}</h2>
      <h4>{post.dateCreated?.slice(4,15)}</h4>
      <h3>{post.content}</h3>
    </div>
  )
}
