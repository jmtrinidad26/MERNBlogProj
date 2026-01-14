import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { deletePost } from '../api'

export function BlogCard({post}) {
  const [currentUser, setCurrentUser] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = sessionStorage.getItem("User");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Store both email and name for comparison
        setCurrentUser({
          email: payload.email,
          name: payload.name
        });
      } catch (e) {
        setCurrentUser(null);
      }
    }
  }, [])

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await deletePost(post._id);
      if (response.status === 200) {
        alert("Post deleted successfully!");
        window.location.reload(); // Reload to show updated posts
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("You don't have permission to delete this post");
      } else {
        alert("Failed to delete post. Please try again.");
      }
    } finally {
      setIsDeleting(false);
    }
  }

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/createblog/${post._id}`);
  }

  const isAuthor = post && currentUser && (
    post.author === currentUser.email || 
    post.author === currentUser.name ||
    post.author?.toLowerCase() === currentUser.email?.toLowerCase() ||
    post.author?.toLowerCase() === currentUser.name?.toLowerCase()
  );

  if (!post) return null;
  
  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "short", 
      day: "numeric" 
    });
  };

  return (
    <div className='blog-card-wrapper'>
      <Link to={`/readblog/${post._id}`} className='post'>
        <h1>{post.title || "Untitled"}</h1>
        <h2>{post.description || "No description available"}</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
          <h3>{formatDate(post.dateCreated)}</h3>
          {post.author && (
            <span style={{ color: 'var(--primary-color)', fontSize: '0.9rem' }}>by {post.author}</span>
          )}
        </div>
      </Link>
      {isAuthor && (
        <div className="blog-card-actions">
          <button 
            onClick={handleEdit} 
            className="icon-btn btn-edit" 
            disabled={isDeleting}
            aria-label="Edit Post"
          >
            <FaEdit /> Edit
          </button>
          <button 
            onClick={handleDelete} 
            className="icon-btn btn-delete" 
            disabled={isDeleting}
            aria-label="Delete Post"
          >
            {isDeleting ? "..." : <><FaTrash /> Delete</>}
          </button>
        </div>
      )}
    </div>
  )
}
