
# 📚 Book Shop

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

<br />

**A modern, full-featured e-commerce platform for book lovers.**
<br />
_Buy, sell, and discover books with ease._

</div>

---

## 🚀 Overview

**Book Shop** is a dynamic web application built with the latest web technologies. It provides a seamless experience for users to browse a vast collection of books, manage their cart and wishlist, and securely checkout using integrated payment gateways like SSLCommerz.

## ✨ Key Features

- **🛒 Smart Cart System:** Real-time updates, persistent state, and easy management.
- **❤️ Wishlist:** Save your favorite reads for later.
- **🔐 Secure Authentication:** Robust user login and registration system.
- **📦 Order Management:** Track your orders and purchase history.
- **💳 Payment Integration:** Secure checkout with SSLCommerz.
- **📱 Responsive Design:** Verified mobile-first approach using Tailwind CSS.
- **⚡ Fast Performance:** Powered by Next.js server-side rendering.

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) & RTK Query
- **Icons:** [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Notifications:** [React Hot Toast](https://react-hot-toast.com/)

### Backend (API)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CoderGUY47/book-shop.git
   ```

2. **Navigate to the frontend directory**
   ```bash
   cd book-shop/frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

4. **Set up Environment Variables**
   Create a `.env.local` file in the root of the `frontend` directory and add your variables:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

```bash
c2c-book-hub/
├── frontend/
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── app/              # Next.js App Router pages & layouts
│   │   ├── components/       # Reusable UI components (Shadcn, Custom)
│   │   ├── lib/              # Utilities, types, and constants
│   │   └── store/            # Redux state management (Slices, APIs)
│   ├── .env.local            # Environment variables
│   ├── next.config.ts        # Next.js configuration
│   └── tailwind.config.js    # Tailwind CSS configuration
│
├── backend/
│   ├── config/               # Database and app configuration
│   ├── controllers/          # Route logic and request handling
│   ├── middleware/           # Custom middleware (Auth, Error handling)
│   ├── models/               # Mongoose schemas and models
│   ├── routes/               # API route definitions
│   ├── services/             # Business logic services
│   ├── utils/                # Helper functions
│   ├── uploads/              # File uploads directory
│   ├── index.ts              # Entry point
│   └── verify_ssl.ts         # SSL Verification utility
│
└── README.md                 # Project documentation
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/CoderGUY47">CoderGUY47</a>
</div>