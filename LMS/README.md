# Citipolytechnic Leave Management System - Frontend 🎯

A modern, responsive web application for managing leave requests and approvals at Citipolytechnic.

## Features 🌟

- 🔐 **Authentication System**

  - Secure login and registration
  - Role-based access control (Staff, HOD, Dean, Admin)
  - Profile management

- 📅 **Leave Management**

  - Submit leave requests
  - Track leave status
  - View leave history
  - Interactive calendar view
  - Real-time notifications

- 📊 **Dashboard**

  - Overview of leave statistics
  - Pending requests
  - Leave balance
  - Recent activities

- 👥 **User Management**
  - Profile settings
  - Department management
  - Role assignments

## Tech Stack 💻

- ⚛️ **React** - Frontend library
- 🎨 **Tailwind CSS** - Styling
- 📦 **Vite** - Build tool
- 🔄 **React Router** - Navigation
- 🎭 **Radix UI** - UI components
- 📅 **date-fns** - Date manipulation
- 🎯 **TypeScript** - Type safety
- 🔄 **Axios** - API requests

## Getting Started 🚀

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/ochuko1996/citi-lms.git
cd citi-lms
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

## Project Structure 📁

```
src/
├── components/        # Reusable UI components
├── context/          # React context providers
├── hooks/            # Custom React hooks
├── lib/             # Utility functions
├── pages/           # Page components
├── services/        # API service layer
├── styles/          # Global styles
└── types/           # TypeScript type definitions
```

## Available Scripts 📝

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

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
Project Link: https://github.com/ochuko1996/citi-lms
