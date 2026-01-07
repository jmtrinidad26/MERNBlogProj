import React from 'react'
import { Link } from 'react-router-dom'

export function BlogCard({post}) {
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
    <Link to={`/readblog/${post._id}`} className='post'>
      <h1>{post.title || "Untitled"}</h1>
      <h2>{post.description || "No description available"}</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <h3>{formatDate(post.dateCreated)}</h3>
        {post.author && (
          <span style={{ color: '#667eea', fontSize: '0.9rem' }}>by {post.author}</span>
        )}
      </div>
    </Link>
  )
}
