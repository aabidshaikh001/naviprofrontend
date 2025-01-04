'use client';

import {
  
  IconMail,
  IconPhone,
  IconMapPin,
  
} from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-6 md:px-20">
      {/* Footer Container */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
        <div className='mb-5'>
  <Link href="/" legacyBehavior>
    <a>
      <img
        src="/logobg.jpg" // Path to your logo image
        alt="Logo"
        width={180} // Adjust width as needed
        height={50} // Adjust height as needed
        
      />
    </a>
  </Link>
</div>
          <p className="text-gray-400 mb-4">
            OurCompany is your trusted partner in providing innovative credit card solutions. Discover seamless, secure, and rewarding experiences with us.
          </p>
          <p className="text-gray-400">
            © {new Date().getFullYear()} OurCompany. All rights reserved.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <a href="/#about" className="hover:text-blue-500 transition duration-300">
                About Us
              </a>
            </li>
            <li>
              <a href="/#services" className="hover:text-blue-500 transition duration-300">
                Our Services
              </a>
            </li>
            <li>
              <a href="/#contact" className="hover:text-blue-500 transition duration-300">
                Contact Us
              </a>
            </li>
            <li>
              <a href="/#faq" className="hover:text-blue-500 transition duration-300">
                FAQs
              </a>
            </li>
          </ul>
        </div>

        {/* Our Services */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Our Services</h4>
          <ul className="space-y-2">
            <li>
              <a  className="hover:text-blue-500 transition duration-300">
                Silver Credit Card
              </a>
            </li>
            <li>
              <a  className="hover:text-blue-500 transition duration-300">
                Gold Credit Card
              </a>
            </li>
            <li>
              <a  className="hover:text-blue-500 transition duration-300">
                Diamond Credit Card
              </a>
            </li>
            <li>
              <a  className="hover:text-blue-500 transition duration-300">
                Platinum Credit Card
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Details */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Contact Us</h4>
          <p className="text-gray-400 mb-2 flex items-center">
            <IconMail className="h-5 w-5 mr-2 text-blue-500" />
            <a href="mailto:ajaykumar247pp@gmail.com" className="hover:underline">
            ajaykumar247pp@gmail.com
            </a>
          </p>
          <p className="text-gray-400 mb-2 flex items-center">
            <IconPhone className="h-5 w-5 mr-2 text-blue-500" />
            <a href="tel:+917568639778" className="hover:underline">
              +91 7568639778
            </a>
          </p>
          <p className="text-gray-400 flex items-center">
            <IconMapPin className="mr-2 text-blue-500" size={50} />
            Vaishnavi Tech Square, Ibbaluru, Bellandur, Bengaluru, Karnataka 560103
          </p>
        </div>
      </div>

       </footer>
  );
}
