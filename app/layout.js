import { AppContextProvider } from './context/AppContext'
import Header from '@/components/Header'
import './globals.css'
import { Inter } from 'next/font/google'
import Footer from '@/components/Footer'
import toast, { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'LangSwap - Connect, Learn and Enjoy ',
  description: 'LangSwap is a language exchange app that connects people from all over the world to learn new languages and make new friends.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppContextProvider>
          <Header />
          <main className='flex-grow'>
            <Toaster />
            {children}
          </main>
          <Footer />
        </AppContextProvider>
      </body>
    </html>
  )
}