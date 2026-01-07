import React, { useState, useEffect } from "react";
import { createPost, updatePost } from "../api";
import { useNavigate, useParams } from "react-router-dom";
import { getPost } from "../api";
import axios from "axios";

export function CreateBlog() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  useEffect(() => {
    const token = sessionStorage.getItem("User");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setAuthor(payload.name || payload.email || "Anonymous");
      } catch (e) {
        setAuthor("Anonymous");
      }
    } else if (!isEditMode) {
      navigate("/");
      return;
    }

    if (isEditMode) {
      loadPost();
    }
  }, [id, isEditMode, navigate]);

  const loadPost = async () => {
    try {
      const post = await getPost(id);
      if (post) {
        setTitle(post.title || "");
        setDescription(post.description || "");
        setContent(post.content || "");
        setAuthor(post.author || "");
      }
    } catch (error) {
      alert("Failed to load post. Redirecting...");
      navigate("/home");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    } else if (description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    } else if (description.length > 200) {
      newErrors.description = "Description must be less than 200 characters";
    }

    if (!content.trim()) {
      newErrors.content = "Content is required";
    } else if (content.length < 50) {
      newErrors.content = "Content must be at least 50 characters";
    } else if (content.length > 10000) {
      newErrors.content = "Content must be less than 10,000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const submitObject = {
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        author: author,
        dateCreated: isEditMode ? undefined : new Date(),
      };

      let response;
      if (isEditMode) {
        response = await updatePost(id, submitObject);
      } else {
        response = await createPost(submitObject);
      }

      if (response && (response.status === 200 || response.status === 201)) {
        alert(isEditMode ? "Blog updated successfully!" : "Blog created successfully!");
        navigate("/home");
      } else {
        throw new Error("Failed to save blog");
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("Authentication failed. Please login again.");
        sessionStorage.removeItem("User");
        navigate("/");
      } else {
        alert(error.response?.data?.message || "Failed to save blog. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-blog-container">
      <div className="create-blog-card">
        <h1>{isEditMode ? "Edit Blog Post" : "Create New Blog Post"}</h1>
        <form onSubmit={handleSubmit} className="blog-form">
          <div className="form-group">
            <label htmlFor="title">Blog Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className={errors.title ? "error" : ""}
              placeholder="Enter a catchy title..."
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
            <span className="char-count">{title.length}/100</span>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <input
              type="text"
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
              className={errors.description ? "error" : ""}
              placeholder="A brief description of your blog post..."
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
            <span className="char-count">{description.length}/200</span>
          </div>

          <div className="form-group">
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={10000}
              rows={15}
              className={errors.content ? "error" : ""}
              placeholder="Write your blog post content here..."
            />
            {errors.content && <span className="error-message">{errors.content}</span>}
            <span className="char-count">{content.length}/10,000</span>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate("/home")} 
              className="btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : isEditMode ? "Update Post" : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
