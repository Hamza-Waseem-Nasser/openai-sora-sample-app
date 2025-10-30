import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aries AI Video Studio | AI-Powered Video Generation",
  description:
    "Professional video generation platform powered by Aries AI and Sora. Create stunning marketing videos with AI.",
  icons: {
    icon: "/sora-2.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const systemThemeScript = `(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = (isDark) => {
      const root = document.documentElement;
      root.classList.toggle('dark', isDark);
      root.style.colorScheme = isDark ? 'dark' : 'light';
    };
    applyTheme(mediaQuery.matches);
    const listener = (event) => applyTheme(event.matches);
    mediaQuery.addEventListener ? mediaQuery.addEventListener('change', listener) : mediaQuery.addListener(listener);
  })();`;

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased h-full bg-background text-foreground`}
      >
        <script
          dangerouslySetInnerHTML={{ __html: systemThemeScript }}
        />
        {children}
      </body>
    </html>
  );
}
