# 🚀 HeroUI v2.7.8 + TailwindCSS v3.4.17 Template

<div align="center">

[![GitHub stars](https://img.shields.io/github/stars/rironib/next-auth?style=for-the-badge)](https://github.com/rironib/next-auth/stargazers)

[![GitHub forks](https://img.shields.io/github/forks/rironib/next-auth?style=for-the-badge)](https://github.com/rironib/next-auth/network)

[![GitHub issues](https://img.shields.io/github/issues/rironib/next-auth?style=for-the-badge)](https://github.com/rironib/next-auth/issues)

[![GitHub license](https://img.shields.io/github/license/rironib/next-auth?style=for-the-badge)](LICENSE)

[![Next.js](https://img.shields.io/badge/next.js-v15.3.2-blue.svg)](https://nextjs.org/)

[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-v4.24.11-blue.svg)](https://next-auth.js.org/)

**A starter template for NextAuth.js v4.24.11 with Next.js v15.3.2**

[Live Demo](https://authsix.vercel.app)

</div>

## 📖 Overview

This project provides a ready-to-use starter template for building applications with Next.js v15.3.2 and NextAuth.js v4.24.11.  It streamlines the authentication process, offering a robust and secure foundation for your Next.js projects.  This template is ideal for developers who want a quick start with NextAuth.js and its various authentication providers, without the overhead of setting up a new project from scratch.

## ✨ Features

- **NextAuth.js Integration:**  Seamlessly integrates NextAuth.js for authentication.
- **Next.js v15.3.2 Compatibility:** Built using the latest version of Next.js.
- **Environment Variable Configuration:**  Uses a `.env.example` file for managing sensitive information.
- **Tailwind CSS Styling:**  Includes Tailwind CSS for rapid UI development.
- **ESLint and Prettier Configuration:** Pre-configured for consistent code style.


## 🛠️ Tech Stack

**Frontend:**
- Next.js v15.3.2
- React
- Tailwind CSS

**Backend:**
- Next.js API Routes (for authentication)
- NextAuth.js

**Authentication:**
- NextAuth.js (supports various providers - check `.env.example`)


## 🚀 Quick Start

### Prerequisites

- Node.js (version 16 or higher - check `.env.example` for compatibility information)
- npm or yarn (pnpm is recommended as specified in `pnpm-workspace.yaml`)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rironib/next-auth.git
   cd next-auth
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Configure your environment variables in .env (NEXTAUTH_URL, providers, etc.)
   ```  Refer to the `.env.example` file for details on required variables and their configuration based on the providers you choose to enable.

4. **Start the development server:**
   ```bash
   pnpm dev
   ```

5. **Open your browser:**
   Visit `http://localhost:3000`


## 📁 Project Structure

```
next-auth/
├── src/              
│   └── pages/         # Application pages
│   └── ...           # other pages
├── public/            # Static assets (empty in this starter)
├── .env.example       # Example environment variables
├── package.json       # Project dependencies
└── ...                # other config files
```

## ⚙️ Configuration

### Environment Variables

The `.env` file contains environment variables crucial for NextAuth.js configuration, including:

- `NEXTAUTH_URL`: The URL of your application.
- Provider-specific secrets (e.g., `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`).  See the `.env.example` file for a complete list.


### Configuration Files

- `.env`:  Contains environment variables.
- `next.config.mjs`:  Next.js configuration.
- `tailwind.config.js`:  Tailwind CSS configuration.
- `postcss.config.js`: PostCSS configuration.
- `eslint.config.mjs`: ESLint configuration.
- `jsconfig.json`: TypeScript configuration.
- `pnpm-workspace.yaml`: Pnpm workspace configuration.


## 🔧 Development

### Available Scripts

| Command       | Description                                  |

|---------------|----------------------------------------------|

| `pnpm dev`     | Starts the development server                |

| `pnpm build`   | Builds the application for production        |

| `pnpm lint`    | Runs ESLint                                  |

| `pnpm format`  | Formats the code with Prettier              |


## 🚀 Deployment

Deploy to Vercel, Netlify, or any platform supporting Next.js deployments.  Remember to set your environment variables in your deployment platform's settings.  The `pnpm build` command will generate the production-ready build artifacts.


## 📄 License

This project is licensed under the [GNU General Public License v3.0](LICENSE) - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

</div>

