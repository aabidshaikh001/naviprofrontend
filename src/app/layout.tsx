import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import Header from './components/header'
import { ToastContainer } from "react-toastify";
import Footer from './components/footer';
import 'react-toastify/dist/ReactToastify.css';
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Navi Pro Credit Card - Rewards, Low Interest & Hassle-Free Applications',
  description: 'Explore Navi Pro, your ultimate credit card solution offering exclusive rewards, low interest rates, and easy online applications. Secure your financial freedom today!',
  keywords: 'Navi Pro Credit Card, credit card rewards, low interest credit card, hassle-free applications, online credit card, financial freedom, exclusive rewards',
  
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header/>
        <ToastContainer/>
        {children}
        <Footer/>
        </body>
    </html>
  )
}
