'use client'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import ApplyNowModal from './ApplyNowModal';
import LoginModal from './LoginModal';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    setIsLoggedIn(false);
    router.push('/'); // Redirect to the home page

  };
  const handleLoginSuccess = () => {
    localStorage.setItem('isLoggedIn', 'true'); // Update localStorage
    setIsLoggedIn(true); // Update state
  };
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
        <div>
  <Link href="/" legacyBehavior>
    <a>
      <Image
        src="/logobg.png" // Path to your logo image
        alt="Logo"
        width={150} // Adjust width as needed
        height={50} // Adjust height as needed
        priority // Optimizes loading for your logo
      />
    </a>
  </Link>
</div>
          <div className="space-x-6 hidden md:flex">
            <Link href="/" legacyBehavior><a className="text-gray-700 hover:text-blue-600">Home</a></Link>
            <Link href="/#about" legacyBehavior><a className="text-gray-700 hover:text-blue-600">About</a></Link>
            <Link href="/#services" legacyBehavior><a className="text-gray-700 hover:text-blue-600">Services</a></Link>

            {!isLoggedIn ? (
              <>
                <button onClick={() => setIsSignupModalOpen(true)} className="text-gray-700 hover:text-blue-600">
                  Apply Now
                </button>
                <button onClick={() => setIsLoginModalOpen(true)} className="text-gray-700 hover:text-blue-600">
                  Login
                </button>
              </>
            ) : (
              <button onClick={handleLogout} className="text-gray-700 hover:text-blue-600">
                Logout
              </button>
            )}
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <svg className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-md py-4">
            <Link href="/" legacyBehavior><a className="block px-4 py-2 text-gray-700 hover:text-blue-600">Home</a></Link>
            <Link href="/#about" legacyBehavior><a className="block px-4 py-2 text-gray-700 hover:text-blue-600">About</a></Link>
            <Link href="/#services" legacyBehavior><a className="block px-4 py-2 text-gray-700 hover:text-blue-600">Services</a></Link>

            {!isLoggedIn ? (
              <>
                <button onClick={() => setIsSignupModalOpen(true)} className="block w-full text-left px-4 py-2 text-gray-700 hover:text-blue-600">
                  Apply Now
                </button>
                <button onClick={() => setIsLoginModalOpen(true)} className="block w-full text-left px-4 py-2 text-gray-700 hover:text-blue-600">
                  Login
                </button>
              </>
            ) : (
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-700 hover:text-blue-600">
                Logout
              </button>
            )}
          </div>
        )}
      </div>
      <ApplyNowModal isOpen={isSignupModalOpen} onClose={() => setIsSignupModalOpen(false)} />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}  onLoginSuccess={handleLoginSuccess} />
    </header>
  );
}
