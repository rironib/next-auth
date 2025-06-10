import {Provider} from "@/app/provider";
import Header from "@/components/layout/Header";
import {poppins} from "@/config/fonts";
import {siteConfig} from "@/config/site";
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

export default function RootLayout({children}) {
    return (
        <html lang="en" className={poppins.className} suppressHydrationWarning>
        <body className="bg-default-50">
        <Provider>
            <div className="flex h-screen flex-col justify-between">
                <Header/>
                <main className="mx-auto w-11/12 max-w-screen-xl flex-grow px-4 py-16 sm:px-6 lg:px-8">
                    {children}
                </main>
                {/*<Footer />*/}
            </div>
        </Provider>
        </body>
        </html>
    );
}
