import type { Metadata } from "next";
import { Bricolage_Grotesque, Lexend_Deca } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/authcontext";


const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "500", "600", "700", "800"],
  variable: '--font-bricolage',
  display: 'swap' 
});

const lexend = Lexend_Deca({
  subsets: ["latin"],
  weight: ["100", "200", "300", "500", "600", "700", "800"],
  variable: '--font-lexend',
  display: 'swap'
});

export const metadata: Metadata = {
  title: "Convo",
  description: "Convert pdf to xml",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${lexend.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}