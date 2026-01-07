import React from 'react'
import {getPost, deletePost} from "../api"
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react';

export function ReadBlog() {
  const [post, setPost] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const params = useParams()
  const navigate = useNavigate()
  const id = params.id

  useEffect(() => {
    const token = sessionStorage.getItem("User");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser(payload.email || payload.name);
      } catch (e) {
        setCurrentUser(null);
      }
    }

    loadPost();
  }, [id])

  const loadPost = async () => {
    try {
      setIsLoading(true);
      const data = await getPost(id);
      if (data) {
        setPost(data);
      } else {
        alert("Post not found");
        navigate("/home");
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("Please login to view this post");
        navigate("/");
      } else {
        alert("Failed to load post");
        navigate("/home");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await deletePost(id);
      if (response.status === 200) {
        alert("Post deleted successfully!");
        navigate("/home");
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

  const handleEdit = () => {
    navigate(`/createblog/${id}`);
  }

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  }

  const isAuthor = post && currentUser && (
    post.author === currentUser || 
    post.author?.toLowerCase() === currentUser?.toLowerCase()
  );

  if (isLoading) {
    return (
      <div className="read-blog-container">
        <div className="loading">Loading post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="read-blog-container">
        <div className="error-message">Post not found</div>
        <button onClick={() => navigate("/home")} className="btn-primary">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="read-blog-container">
      <div className="read-blog-card">
        <div className="blog-header">
          <button onClick={() => navigate("/home")} className="btn-back">
            ← Back to Home
          </button>
          {isAuthor && (
            <div className="blog-actions">
              <button onClick={handleEdit} className="btn-edit" disabled={isDeleting}>
                Edit
              </button>
              <button onClick={handleDelete} className="btn-delete" disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
        </div>

        <article className="blog-article">
          <h1 className="blog-title">{post.title}</h1>
          
          <div className="blog-meta">
            <div className="blog-author">
              <span className="author-label">By:</span>
              <span className="author-name">{post.author || "Anonymous"}</span>
            </div>
            <div className="blog-date">
              {formatDate(post.dateCreated)}
            </div>
          </div>

          {post.description && (
            <p className="blog-description">{post.description}</p>
          )}

          <div className="blog-content">
            {post.content?.split('\n').map((paragraph, index) => (
              paragraph.trim() && (
                <p key={index}>{paragraph}</p>
              )
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
