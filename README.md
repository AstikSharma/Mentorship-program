# Mentorship Matching Platform

A web-based platform where users can sign up as mentors or mentees, set up profiles, and find matches based on skills and interests. The platform enables meaningful mentorship connections with intuitive user interactions and robust matchmaking capabilities.

## Features

### User Interface
- **User Registration and Login:** Secure user registration, login, and logout.
- **Profile Setup:** Create and edit profiles with roles (mentor/mentee), skills, interests, and bio.
- **User Discovery:** Browse through profiles with filters for roles, skills, and interests.

### Functionality
- **User Authentication:** Secure authentication with input validation and error handling.
- **Profile Management:** Add, update, and delete user profiles.
- **Connection Requests:** Send, receive, and get notified about connection requests.
- **Notifications:** Simple notifications for connection updates.

### Database
- **Relational Database:** PostgreSQL for storing user information, profiles, connections and notifications.
- **Deployed on Vercel:** Ensures scalability and availability.
- **Secure Data Handling:** Adheres to best practices for sensitive information management.

### Deployment
- **Frontend:** Deployed on Render.
- **Backend:** Deployed on Render.

---

## Tech Stack

### Frontend
- **Framework:** React
- **Styling:** Tailwind CSS / MaterialUI
- **Deployment:** Render

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Deployment:** Render (backend) and Vercel (database)

### Other Tools
- **Version Control:** Git/GitHub
- **Hosting:** Render (Frontend & Backend), Vercel (Database)

---

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/AstikSharma/Mentorship-program.git
   cd Mentorship-program
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

   - Create a `.env` file in the `backend` folder with the following variables:
     ```env
     DATABASE_URL=<your_vercel_database_url>
     JWT_SECRET=<your_jwt_secret>
     ```

   - Start the backend server:
     ```bash
     node server.js
     ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

  - Create a `.env` file in the `backend` folder with the following variables:
     ```env
     VITE_BACKEND_URL=<your_backend_URL>/api/users
     VITE_JWT_SECRET=<your_jwt_secret>  
     ```

   - Start the frontend server:
     ```bash
     npm run dev
     ```

---

## Folder Structure

```plaintext
Mentorship-program
├── frontend    # React-based frontend code
└── backend     # Node.js-based backend code
```

---


## Deployment Links

- **Frontend:** [[Deployed on Render](https://mentorship-program-1.onrender.com/)](#)
- **Backend:** [[Deployed on Render](https://mentorship-program-av9z.onrender.com/)](#)
- **GitHub Repository:** [Mentorship Program Repo](https://github.com/AstikSharma/Mentorship-program)

---

## Future Enhancements
- Advanced matching algorithm with machine learning.
- Real-time chat functionality for mentors and mentees.
- Email and push notifications.

---

