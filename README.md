# 🚀 HeroUI v2.7.8 + TailwindCSS v3.4.17 Template

A modern, fully customizable **HeroUI** template built with [**Next.js 15.3.2**](https://nextjs.org/docs/getting-started) and powered by [**TailwindCSS v3.4.17**](https://v3.tailwindcss.com/). This version uses the **App Router** architecture for better routing flexibility and performance.

> 🧰 Uses **PNPM v10.11.0** as the package manager.

---

## ⚙️ Getting Started

Install dependencies and start the development server:

```bash
pnpm install
pnpm run dev
```

### 📦 Recommended VS Code Extensions

- [Prettier – Code Formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)  
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)  
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)  

---

## 🚀 Deploying

Build and deploy your project:

```bash
pnpm build
pnpm deploy
```

---

## Folder Structure

```
src/
├── app/
│ ├── api/
│ │ ├── auth/
│ │ │ └── [...nextauth]/route.js # NextAuth.js handler
│ │ ├── register/route.js # User registration
│ │ ├── verify/route.js # Email verification
│ │ ├── forgot/route.js # Send password reset email
│ │ ├── reset/route.js # Handle password reset
│ ├── auth/
│ │ ├── login/page.js # Login UI
│ │ ├── register/page.js # Registration UI
│ │ ├── verify/page.js # UI for token-based verification
│ │ ├── forgot/page.js # Forgot password UI
│ │ └── reset/page.js # Reset password UI
│ ├── dashboard/page.js # Protected route (post-login)
│ ├── favico.ico
│ ├── globals.css
│ ├── layout.js
│ ├── page.js
│ └── provider.js
├── components/
│ ├── layout/
│ │ └── Header.js # Navbar/Header
│ ├── AuthProvider.js # NextAuth session provider
│ ├── Loading.js
│ └── ThemeSwitcher.js
├── config/
│ ├── fonts.js
│ ├── nextAuth.js # NextAuth config (Google + Credentials)
│ └── site.js
├── lib/
│ ├── mailer.js # Resend-based email functions
│ └── mongodb.js # MongoDB connection (native driver)
├── middleware.js # Protect routes using NextAuth
.env.example
README.md

```


## 📚 Included Libraries

- 🔗 [Next.js 15.3.2](https://nextjs.org/docs/getting-started) – React framework for production  
- 🎨 [HeroUI v2.7.8](https://www.heroui.com/docs/guide/introduction) – UI components for TailwindCSS  
- 💨 [TailwindCSS v3.4.17](https://v3.tailwindcss.com/) – Utility-first CSS framework  
- 🎥 [Framer Motion](https://www.framer.com/motion/) – Animation library for React  
- 🌗 [next-themes](https://github.com/pacocoursey/next-themes) – Dark mode support  
- 🧼 [Prettier](https://prettier.io/) – Code formatting  
- 🔠 [react-icons](https://react-icons.github.io/react-icons/) – Popular icon sets in React  

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.