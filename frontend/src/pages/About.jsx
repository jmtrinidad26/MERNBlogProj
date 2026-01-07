import React from 'react'

export function About() {
  return (
    <div className="about-container">
      <div className="about-card">
        <h1>About Our Blog Platform</h1>
        
        <section className="about-section">
          <h2>Welcome to Our Community</h2>
          <p>
            We're a modern blogging platform designed to help you share your thoughts, 
            ideas, and stories with the world. Whether you're a seasoned writer or just 
            starting out, our platform provides the tools you need to create, publish, 
            and manage your blog posts with ease.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            Our mission is to provide a simple, intuitive, and powerful platform for 
            content creators. We believe everyone has a story to tell, and we're here 
            to make sharing those stories as easy and enjoyable as possible.
          </p>
        </section>

        <section className="about-section">
          <h2>Features</h2>
          <ul className="features-list">
            <li>✨ Easy-to-use blog creation and editing</li>
            <li>🔐 Secure user authentication</li>
            <li>📝 Rich text content support</li>
            <li>👤 Personal profile management</li>
            <li>🎨 Modern and responsive design</li>
            <li>⚡ Fast and reliable performance</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Get Started</h2>
          <p>
            Ready to start sharing your stories? Create an account today and join our 
            growing community of writers and content creators. It's free, easy, and 
            takes just a few minutes to get started!
          </p>
        </section>

        <section className="about-section">
          <h2>Technology Stack</h2>
          <p>
            This platform is built with modern web technologies including React, Node.js, 
            Express, and MongoDB, ensuring a fast, secure, and scalable experience for 
            all our users.
          </p>
        </section>
      </div>
    </div>
  )
}
