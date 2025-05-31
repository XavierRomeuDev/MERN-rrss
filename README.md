
# 🌐 MERN Social Network (MERN-rrss)

A full-stack social network application built using the MERN stack (MongoDB, Express, React, Node.js). This project demonstrates how to create a social media platform with user authentication, post creation, and real-time interactions.

## 📁 Project Structure

- `backend/`: Server-side application built with Node.js and Express.
- `frontend/`: Client-side application developed with React.
- `start-project.bat`: Batch script to initialize both frontend and backend servers simultaneously (Windows only).
- `package.json`: Project metadata and dependencies.

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (Node.js package manager)
- [MongoDB](https://www.mongodb.com/) (or use a cloud service like MongoDB Atlas)

### Installation

1. Clone this repository:

   git clone https://github.com/XavierRomeuDev/MERN-rrss.git

2. Navigate into the project directory:

   cd MERN-rrss

3. Set up the backend:

   cd backend
   npm install

4. Set up the frontend:

   cd ../frontend
   npm install

5. Configure environment variables:

   - For the backend, create a `.env` file in the `backend` directory with the following content:

     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     PORT=5000

   - For the frontend, create a `.env` file in the `frontend` directory with the following content:

     REACT_APP_API_URL=http://localhost:5000/api

6. Run the backend server:

   cd ../backend
   npm start

7. Run the frontend development server:

   cd ../frontend
   npm start

8. Open your browser and navigate to:

   http://localhost:3000

   Alternatively, if you're using Windows, you can start both servers simultaneously by running the `start-project.bat` script:

   start-project.bat

## 🛠️ Features

- User authentication and authorization.
- CRUD operations for posts.
- Real-time notifications and interactions.
- Responsive user interface built with React.

## 🤝 Contributing

Contributions are welcome! If you want to add features, fix bugs, or improve the project, please open an **issue** or submit a **pull request**.

## 📄 License

This project is licensed under the **MIT** license. See the `LICENSE` file for more information.
