import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { AuthProvider } from '@/hooks/useAuth';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "mulakintola",
  description: "Interface amigável para visualização de vídeos e cursos do Google Drive",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className={`${inter.className} h-full`}>
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
} 