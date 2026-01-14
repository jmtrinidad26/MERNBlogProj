const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
require('dotenv').config();

const SALT_ROUNDS = 6;

// Sample data
const sampleUsers = [
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123"
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123"
  },
  {
    name: "Bob Johnson",
    email: "bob@example.com",
    password: "password123"
  },
  {
    name: "Alice Williams",
    email: "alice@example.com",
    password: "password123"
  },
  {
    name: "Charlie Brown",
    email: "charlie@example.com",
    password: "password123"
  }
];

const samplePosts = [
  {
    title: "Getting Started with React",
    content: "React is a powerful JavaScript library for building user interfaces. In this post, we'll explore the basics of React and how to get started with your first component. React uses a component-based architecture that makes it easy to build complex UIs from simple pieces.",
    author: "John Doe",
    tags: ["react", "javascript", "tutorial"]
  },
  {
    title: "Understanding Node.js",
    content: "Node.js is a runtime environment that allows you to run JavaScript on the server side. It's built on Chrome's V8 JavaScript engine and provides an event-driven, non-blocking I/O model that makes it lightweight and efficient. Perfect for building scalable network applications!",
    author: "Jane Smith",
    tags: ["nodejs", "backend", "javascript"]
  },
  {
    title: "MongoDB Basics",
    content: "MongoDB is a NoSQL database that stores data in flexible, JSON-like documents. Unlike traditional relational databases, MongoDB doesn't require a predefined schema, making it perfect for applications that need to handle diverse data types. Let's dive into collections, documents, and queries!",
    author: "Bob Johnson",
    tags: ["mongodb", "database", "nosql"]
  },
  {
    title: "CSS Grid vs Flexbox",
    content: "Both CSS Grid and Flexbox are powerful layout tools, but they serve different purposes. Flexbox is one-dimensional and works great for layouts in a single direction, while Grid is two-dimensional and excels at creating complex layouts. Learn when to use each!",
    author: "Alice Williams",
    tags: ["css", "webdev", "design"]
  },
  {
    title: "Introduction to Express.js",
    content: "Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. It simplifies server-side programming and makes it easy to build RESTful APIs. Let's create our first Express server!",
    author: "Charlie Brown",
    tags: ["express", "nodejs", "api"]
  },
  {
    title: "JavaScript ES6 Features",
    content: "ES6 brought many new features to JavaScript including arrow functions, classes, template literals, destructuring, and more. These features make JavaScript code more readable and maintainable. Let's explore the most important ES6 features you should know!",
    author: "John Doe",
    tags: ["javascript", "es6", "programming"]
  },
  {
    title: "Building RESTful APIs",
    content: "REST (Representational State Transfer) is an architectural style for designing networked applications. A RESTful API uses HTTP requests to perform CRUD operations. In this guide, we'll build a complete REST API with proper endpoints, status codes, and best practices.",
    author: "Jane Smith",
    tags: ["api", "rest", "backend"]
  },
  {
    title: "React Hooks Deep Dive",
    content: "React Hooks revolutionized how we write React components. useState, useEffect, useContext, and custom hooks allow functional components to have state and side effects. Learn how to use hooks effectively and avoid common pitfalls!",
    author: "Bob Johnson",
    tags: ["react", "hooks", "javascript"]
  },
  {
    title: "Responsive Web Design",
    content: "Creating websites that work on all devices is crucial in today's mobile-first world. Responsive design uses flexible layouts, images, and CSS media queries to adapt to different screen sizes. Learn the principles and techniques of responsive design!",
    author: "Alice Williams",
    tags: ["responsive", "css", "webdev"]
  },
  {
    title: "Authentication with JWT",
    content: "JSON Web Tokens (JWT) provide a secure way to transmit information between parties. They're commonly used for authentication and authorization in web applications. Learn how to implement JWT authentication in your Node.js applications!",
    author: "Charlie Brown",
    tags: ["jwt", "authentication", "security"]
  }
];

async function seedDatabase() {
  const client = new MongoClient(process.env.ATLAS_URI);

  try {
    console.log('🔄 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB!');

    const db = client.db('blogData');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await db.collection('users').deleteMany({});
    await db.collection('posts').deleteMany({});
    console.log('✅ Existing data cleared!');

    // Insert users
    console.log('👥 Creating users...');
    const usersToInsert = await Promise.all(
      sampleUsers.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
        return {
          name: user.name,
          email: user.email,
          password: hashedPassword,
          joinDate: new Date(),
          posts: []
        };
      })
    );

    const usersResult = await db.collection('users').insertMany(usersToInsert);
    console.log(`✅ Created ${usersResult.insertedCount} users!`);

    // Get user IDs to associate with posts
    const users = await db.collection('users').find({}).toArray();
    const userMap = {};
    users.forEach(user => {
      userMap[user.name] = user._id;
    });

    // Insert posts
    console.log('📝 Creating blog posts...');
    const postsToInsert = samplePosts.map(post => ({
      title: post.title,
      content: post.content,
      author: post.author,
      authorId: userMap[post.author],
      tags: post.tags,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
      updatedAt: new Date(),
      likes: Math.floor(Math.random() * 50),
      comments: []
    }));

    const postsResult = await db.collection('posts').insertMany(postsToInsert);
    console.log(`✅ Created ${postsResult.insertedCount} blog posts!`);

    // Update users with their post IDs
    console.log('🔗 Linking posts to users...');
    for (const post of postsToInsert) {
      const insertedPost = await db.collection('posts').findOne({ title: post.title });
      await db.collection('users').updateOne(
        { name: post.author },
        { $push: { posts: insertedPost._id } }
      );
    }
    console.log('✅ Posts linked to users!');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${usersResult.insertedCount}`);
    console.log(`   Posts: ${postsResult.insertedCount}`);
    console.log('\n👤 Sample Login Credentials:');
    sampleUsers.forEach(user => {
      console.log(`   Email: ${user.email} | Password: ${user.password}`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n👋 Database connection closed');
  }
}

// Run the seed function
seedDatabase();