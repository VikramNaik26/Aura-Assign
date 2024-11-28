'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import SignupButton from '@/components/auth/SignupButton'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="backdrop-blur-md py-4 sticky top-0 z-50 transition-colors duration-300 mb-6 md:mb-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">
            Aura Assign
          </Link>
          <nav className="hidden md:block">
            <ul className="flex justify-center items-center space-x-6">
              <li><Link href="#features" className="text-gray-300 hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#team" className="text-gray-300 hover:text-white transition-colors">Team</Link></li>
              <li><SignupButton className="bg-white text-black px-4 py-2 rounded transition-colors">Sign In</SignupButton></li>
            </ul>
          </nav>
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {isMenuOpen && (
          <nav className="mt-4 md:hidden bg-gray-900/80 backdrop-blur-md rounded-lg p-4">
            <ul className="flex flex-col space-y-2">
              <li><Link href="#features" className="text-gray-300 hover:text-white transition-colors block py-2" onClick={() => setIsMenuOpen(false)}>Features</Link></li>
              <li><Link href="#team" className="text-gray-300 hover:text-white transition-colors block py-2" onClick={() => setIsMenuOpen(false)}>Team</Link></li>
              <li><SignupButton className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors w-full text-center">Sign In</SignupButton></li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}


