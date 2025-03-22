# Citipolytechnic Leave Management System - Backend 🖥️

A robust Node.js backend service for the Citipolytechnic Leave Management System.

## Features 🌟

- 🔐 **Authentication & Authorization**

  - JWT-based authentication
  - Role-based access control
  - Password hashing with bcrypt
  - Token management

- 📊 **Database Management**

  - MySQL database integration
  - Efficient data models
  - Transaction support
  - Data validation

- 🛣️ **API Routes**

  - RESTful API endpoints
  - Leave request management
  - User management
  - Leave type management
  - Leave balance tracking

- 🔒 **Security**
  - CORS configuration
  - Input validation
  - Error handling
  - Rate limiting

## Tech Stack 💻

- 🟢 **Node.js** - Runtime environment
- 🚂 **Express** - Web framework
- 🎯 **TypeScript** - Type safety
- 🗄️ **MySQL** - Database
- 🔑 **JWT** - Authentication
- 🔒 **bcrypt** - Password hashing
- ✨ **cors** - CORS middleware
- 🌍 **dotenv** - Environment configuration

## Getting Started 🚀

### Prerequisites

- Node.js (v18 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/ochuko1996/citi-lms-server.git
cd citi-lms-server
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=citi_lms

# JWT Configuration
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=24h
```

4. Set up the database:

```bash
# Run MySQL scripts
mysql -u root -p < src/config/schema.sql
```

5. Start the development server:

```bash
npm run dev
# or
yarn dev
```

## Project Structure 📁

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── utils/           # Utility functions
└── index.ts         # Application entry point
```

## API Endpoints 🛣️

### Authentication

- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- GET `/api/auth/profile` - Get user profile
- PUT `/api/auth/profile` - Update user profile

### Leave Management

- POST `/api/leave/request` - Create leave request
- GET `/api/leave/requests` - Get all leave requests
- PUT `/api/leave/requests/:id` - Update leave request
- DELETE `/api/leave/requests/:id` - Delete leave request

### Leave Types

- GET `/api/leave/types` - Get all leave types
- POST `/api/leave/types` - Create leave type
- PUT `/api/leave/types/:id` - Update leave type
- DELETE `/api/leave/types/:id` - Delete leave type

### Leave Balance

- GET `/api/leave/balance` - Get user's leave balance
- PUT `/api/leave/balance/:userId` - Update leave balance

## Available Scripts 📝

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## Database Schema 🗄️

### Users Table

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  staff_id VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  department VARCHAR(100) NOT NULL,
  role ENUM('staff', 'hod', 'dean', 'admin') NOT NULL
);
```

### Leave Requests Table

```sql
CREATE TABLE leave_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  type_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL,
  status ENUM('pending', 'approved', 'rejected') NOT NULL
);
```

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License 📄

This project is licensed under the ISC License.

## Contact 📧

Your Name - Ochuko Samuel George
Project Link: https://github.com/ochuko1996/citi-lms-server
