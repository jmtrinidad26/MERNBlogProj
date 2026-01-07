import React from 'react'
import {getPosts} from '../api'
import {useState, useEffect} from 'react'
import { BlogCard } from '../components/BlogCard'
import { useNavigate } from 'react-router-dom'

export function Home() {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadAllPosts()
  }, [])

  const loadAllPosts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getPosts()
      
      if (data && Array.isArray(data)) {
        const sorted = data.sort((d1, d2) => {
          const date1 = d1.dateCreated ? new Date(d1.dateCreated).getTime() : 0;
          const date2 = d2.dateCreated ? new Date(d2.dateCreated).getTime() : 0;
          return date2 - date1;
        });
        setPosts(sorted)
      } else {
        setPosts([])
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError("Please login to view posts")
        setTimeout(() => {
          navigate("/")
        }, 2000)
      } else {
        setError("Failed to load posts. Please try again later.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="posts">
        <div className="loading">Loading posts...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="posts">
        <div className="error-message">{error}</div>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="posts">
        <div className="no-posts">
          <p>No blog posts yet. Be the first to create one!</p>
        </div>
      </div>
    )
  }

  return (
    <div className='posts'>
      {posts.map((post) => {
        return (
          <BlogCard post={post} key={post._id} />
        )
      })}
    </div>
  )
}
