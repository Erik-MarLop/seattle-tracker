import './globals.css'
import { Metadata } from 'next';
import { Toaster } from 'sonner';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Seattle Tracker | Finanzas Personales",
  description: "Plataforma integral para el control de metas de ahorro y tipos de cambio.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-100 text-slate-900`}>
        <main className="max-w-5xl mx-auto p-4 md:p-8">
          {children}
        </main>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  )
}