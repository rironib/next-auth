import { Provider } from "@/app/provider";
import Header from "@/components/layout/Header";
import { poppins } from "@/config/fonts";
import { siteConfig } from "@/config/site";
import "./globals.css";

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.className} suppressHydrationWarning>
      <body>
        <Provider>
          <div className="flex h-[100dvh] flex-col justify-between">
            <Header />
            <main className="mx-auto w-full max-w-screen-xl flex-grow px-2 py-4 sm:px-4 lg:px-6 lg:py-8 xl:px-0">
              {children}
            </main>
          </div>
        </Provider>
      </body>
    </html>
  );
}
