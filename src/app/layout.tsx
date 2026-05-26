import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://touchmidia.com"),
  title: {
    default: "TOUCH MIDIA | Totens Interativos com Jogos para Eventos",
    template: "%s | TOUCH MIDIA",
  },
  description:
    "Mais movimento no stand, mais leads no CRM. Totens com jogos personalizados para o seu evento: roleta, quiz, raspadinha, pênalti e mais 8 jogos. Captura de leads em tempo real.",
  keywords: [
    "totem interativo evento",
    "totem touch screen",
    "gamificação evento corporativo",
    "captura de leads evento",
    "tela touch screen",
    "jogo interativo",
    "roleta digital",
    "quiz interativo",
  ],
  authors: [{ name: "TOUCH MIDIA" }],
  creator: "TOUCH MIDIA",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "TOUCH MIDIA",
    title: "TOUCH MIDIA | Totens Interativos com Jogos para Eventos",
    description:
      "Mais filas, mais leads. Totens com jogos personalizados para o seu evento.",
    url: "https://touchmidia.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "TOUCH MIDIA | Totens Interativos com Jogos para Eventos",
    description:
      "Mais filas, mais leads. Totens com jogos personalizados para o seu evento.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-black text-white">
        {children}
      </body>
    </html>
  );
}
