# 🔐 Authentication System

A full-stack authentication system with features including user registration, login, email verification via OTP, password reset, and cookie-based session management.

This project is built using **React** for the frontend, **Node.js** and **Express.js** for the backend, and **MongoDB** for the database.

## 🌐 Features

- ✅ **User Registration**  
  Users can create accounts with email and password.

- 🔓 **User Login**  
  Secure login system with credential validation.

- 📧 **Email Verification with OTP**  
  After signup, an OTP is sent to the user's email for email verification.

- 🔁 **Password Reset via OTP**  
  Users can request password reset, verified using an OTP sent to their email.

- 🍪 **Cookie-based Authentication**  
  Session handling is implemented using HTTP cookies.

---

## 🛠️ Tech Stack

### Frontend
- [React.js](https://reactjs.org/) with Vite
- Axios (for HTTP requests)
- TailWindCSS (for styling)

### Backend
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Nodemailer](https://nodemailer.com/) (for sending OTP emails)
- [bcrypt.js](https://github.com/kelektiv/node.bcrypt.js) (for password hashing)
- [cookie-parser](https://www.npmjs.com/package/cookie-parser)

### Database
- [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)

---

## 📦 Installation & Running the Project

### 1. Clone the Repository

```bash
git clone https://github.com/GlenFonceca/AuthenticationSystem.git
cd AuthenticationSystem
```

### 2. Setup Server
```bash
cd server
npm install
```

Add following environmental variables in .env file in the server directory:
```bash
MONGODB_URI=your_mongodb_connection_uri
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development

SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SENDER_EMAIL=youremail@example.com
```
Run the backend server:

```bash
npm run server
```

### 3.Setup Client
```bash
cd client
npm install
npm run dev
```
---

# 🚀 Future Enhancements

- 👤 Add user roles (e.g., admin, user)

- 📲 Enable 2FA (Two-Factor Authentication)

- 🧪 Add unit and integration tests

# 🤝 Contributing
Contributions, issues, and feature requests are welcome!
Feel free to fork this repository and submit a pull request.
 
