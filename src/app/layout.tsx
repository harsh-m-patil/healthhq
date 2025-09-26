import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/custom/navbar";
import { ThemeProvider } from "@/components/providers/theme";

const lora = Lora();

export const metadata: Metadata = {
  title: "HealthHQ",
  description: "Your Gateway to Simplified Medical News",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${lora.className} antialiased bg-gradient-to-tl min-h-screen from-primary/10 via-background/85 to-primary/10`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
