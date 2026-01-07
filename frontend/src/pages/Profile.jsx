import React, { useState, useEffect } from 'react'
import { getPosts } from '../api'
import { useNavigate, Link } from 'react-router-dom'
import { BlogCard } from '../components/BlogCard'

export function Profile() {
  const [userInfo, setUserInfo] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [allPosts, setAllPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    loadUserInfo()
    loadPosts()
  }, [])

  const loadUserInfo = () => {
    const token = sessionStorage.getItem("User")
    if (!token) {
      alert("Please login to view your profile")
      navigate("/")
      return
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setUserInfo({
        name: payload.name || "User",
        email: payload.email || "No email",
        joinDate: payload.joinDate ? new Date(payload.joinDate).toLocaleDateString() : "Unknown"
      })
    } catch (error) {
      alert("Invalid session. Please login again.")
      sessionStorage.removeItem("User")
      navigate("/")
    }
  }

  const loadPosts = async () => {
    try {
      setIsLoading(true)
      const posts = await getPosts()
      if (posts) {
        setAllPosts(posts);
        const token = sessionStorage.getItem("User");
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            const userEmail = payload.email
            const filtered = posts.filter(post => 
              post.author === userEmail || 
              post.author === payload.name ||
              post.author?.toLowerCase() === userEmail?.toLowerCase()
            )
            setUserPosts(filtered.sort((a, b) => 
              new Date(b.dateCreated) - new Date(a.dateCreated)
            ))
          } catch (e) {
            setUserPosts([])
          }
        }
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("Please login to view posts")
        navigate("/")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      sessionStorage.removeItem("User")
      navigate("/")
    }
  }

  if (!userInfo) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <span>{userInfo.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="profile-info">
            <h1>{userInfo.name}</h1>
            <p className="profile-email">{userInfo.email}</p>
            <p className="profile-join-date">Member since {userInfo.joinDate}</p>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <div className="stat-number">{userPosts.length}</div>
            <div className="stat-label">Blog Posts</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{allPosts.length}</div>
            <div className="stat-label">Total Posts</div>
          </div>
        </div>

        <div className="profile-actions">
          <Link to="/createblog" className="btn-primary">
            + Create New Post
          </Link>
        </div>

        <div className="profile-posts-section">
          <h2>Your Blog Posts</h2>
          {isLoading ? (
            <div className="loading">Loading your posts...</div>
          ) : userPosts.length === 0 ? (
            <div className="no-posts">
              <p>You haven't created any blog posts yet.</p>
              <Link to="/createblog" className="btn-primary">
                Create Your First Post
              </Link>
            </div>
          ) : (
            <div className="posts">
              {userPosts.map((post) => (
                <BlogCard post={post} key={post._id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
