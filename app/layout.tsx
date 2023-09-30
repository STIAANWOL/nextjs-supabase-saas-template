import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Roboto } from "next/font/google";
import { ThemeProvider } from "@/providers/theme";
import ReactQueryProvider from "@/providers/reactQuery";

export const metadata = {
  title: "Saas-Template",
  description: "A SaaS template made with NextJS and Supabase.",
};

const fontRoboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-roboto",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-full overflow-y-hidden">
        <main
          className={`h-full ${fontRoboto.variable} font-roboto flex flex-col items-center`}
        >
          <ReactQueryProvider>
            <ThemeProvider>
              {children}
              <Analytics />
            </ThemeProvider>
          </ReactQueryProvider>
        </main>
      </body>
    </html>
  );
}
