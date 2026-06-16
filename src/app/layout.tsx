import { Metadata } from 'next';
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-slate-50 text-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: "Seattle Tracker | Finanzas Personales",
  description: "Plataforma integral para el control de metas de ahorro y tipos de cambio.",
};