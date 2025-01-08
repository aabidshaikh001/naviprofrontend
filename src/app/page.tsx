'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import ApplyNowModal from './components/ApplyNowModal';
import LoginModal from './components/LoginModal';


interface FAQEntry {
  question: string;
  answer: string;
}
const questionsAnswers: FAQEntry[] = [
  {
    question: "How do I apply for a credit card?",
    answer: "To apply for a credit card, visit our website, select the credit card that best suits your needs, and click on the 'Apply Now' button. You'll need to provide some personal and financial information to complete your application."
  },
  {
    question: "Who do I contact for more questions?",
    answer: "For any additional questions, please contact our customer service team through our website, by phone, or visit one of our branches."
  }
  ,
  {
    question: "What are the eligibility criteria for obtaining a credit card?",
    answer: "Eligibility criteria vary by card, but generally, you must be at least 18 years old, have a stable income, and possess a good credit score. Specific requirements such as minimum income or employment type may also apply."
  },
  {
    question: "What should I do if my credit card is lost or stolen?",
    answer: "If your credit card is lost or stolen, please report it immediately to our customer service team, available 24/7. We will block your card to prevent any fraudulent transactions and issue a replacement card."
  }
 
  // You can add more questions and answers here
];
export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null); // Use TypeScript for state typing

  const toggleFAQ = (index: number): void => {
    setActiveIndex(activeIndex === index ? null : index); // Function to toggle visibility of the answer
  };
  
  

  const openLoginModal = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the default navigation behavior
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => setIsLoginModalOpen(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const openApplyModal = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the default navigation behavior
    setIsApplyModalOpen(true);
  };
  const handleLoginSuccess = () => {
    console.log("User logged in successfully!");
    // Perform any actions needed after login, e.g., update state, fetch data
  };

  const closeApplyModal = () => setIsApplyModalOpen(false);
  return (
    <div>
      <section className="bg-white text-gray-950 py-20 px-4 md:px-16 flex flex-col md:flex-row items-center justify-between md:space-x-12">
        {/* Content Section */}
        <div className="max-w-lg md:w-1/2 text-center md:text-left">
          <h2 className="sm:text-base text-sm uppercase tracking-widest text-gray-900 mb-2">
            Trusted Business Partner
          </h2>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your Gateway to Intelligent Credit Card Solutions
          </h1>
          <p className="text-lg md:text-xl text-gray-900 mb-6">
            Welcome to NaviPro: Where Smart Choices Meet Limitless Rewards
            with Our Range of Credit Cards!
          </p>
          <div className="flex items-center space-x-4">
  {/* Login Button */}
  <button
    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-800 transition duration-300"
    onClick={openLoginModal} // Attach the click handler
  >
    Login
  </button>

  {/* Apply Now Button */}
  <button
    className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-800 transition duration-300"
    onClick={openApplyModal} // Attach the click handler
  >
    Apply Now
  </button>
</div>

        </div>

        {/* Image Section */}
        <div className="relative w-full md:w-1/2 h-64 md:h-auto mt-8 md:mt-0">
          <img
            src="/image.png" // Replace with your optimized image path in the public folder
            alt="Hand holding a credit card"
            
            className="rounded-full shadow-2xl shadow-blue-300 "
            height={600}
            width={500} 
          />
        </div>
      </section>
        {/* Login Modal */}
        <LoginModal
  isOpen={isLoginModalOpen}
  onClose={closeLoginModal}
  onLoginSuccess={handleLoginSuccess}
/>
      <section className="bg-white text-gray-950 py-24 px-4 md:px-10 flex flex-col items-center text-center" id='about'>
        {/* About Us Section */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Welcome To NaviPro Consultancy Company
        </h2>
        <p className="text-lg text-gray-700 mb-4">
          We are a trusted consulting company.
        </p>
        <p className="text-lg text-gray-900 max-w-3xl mb-6">
          Welcome to NaviPro Credit Cards: Smart solutions for modern spending. 
          Explore our range of innovative cards tailored to your financial needs. 
          Start maximizing your rewards today!
        </p>
        <Link href="#more" legacyBehavior>
          <a className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-800 transition duration-300">
            More About Us
          </a>
        </Link>
      </section>
      <section className="bg-gray-50 text-gray-950 py-24 px-4 md:px-10" id='services'>
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h2>
          <p className="text-lg text-gray-700">
            All OurCompany Solutions: Silver Credit Card, Gold Credit Card, Diamond Credit Card, and Platinum Cards.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Silver Card */}
          <div className="group bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition-colors duration-300">
              Silver Credit Card
            </h3>
            <p className="text-gray-700 mb-4">
              Perfect for beginners, offering essential features and basic rewards to suit your spending needs.
            </p>
           
          </div>

          {/* Gold Card */}
          <div className="group bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition-colors duration-300">
              Gold Credit Card
            </h3>
            <p className="text-gray-700 mb-4">
              Enjoy enhanced rewards, exclusive offers, and greater financial benefits with our Gold Credit Card.
            </p>
            
          </div>

          {/* Diamond Card */}
          <div className="group bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition-colors duration-300">
              Diamond Credit Card
            </h3>
            <p className="text-gray-700 mb-4">
              Premium rewards and perks tailored for discerning customers looking for luxury and convenience.
            </p>
          
          </div>

          {/* Platinum Card */}
          <div className="group bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition-colors duration-300">
              Platinum Credit Card
            </h3>
            <p className="text-gray-700 mb-4">
              The ultimate in rewards, features, and prestige for our most valued customers.
            </p>
           
          </div>
        </div>
      </section>
      <section className="bg-gradient-to-r from-gray-100 via-white to-gray-50 text-gray-950 py-24 px-6 md:px-20 flex flex-col md:flex-row items-center justify-between">
        {/* Text Content Section */}
        <div className="max-w-lg md:w-1/2 space-y-6 text-center md:text-left">
          <h2 className="text-5xl font-extrabold text-blue-700 leading-snug hover:text-blue-800 transition-all duration-300">
            WE ARE HERE
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed hover:text-gray-900 transition-all duration-300">
            Get your free credit card within <span className="font-semibold text-blue-700">24 hours</span>. 
            Hassle-free application process tailored for you. Experience simplicity, speed, and security.
          </p>
         
            <button
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full text-lg shadow-md hover:bg-blue-800 hover:shadow-xl hover:scale-105 transition-all duration-300"
              onClick={openApplyModal} // Attach the click handler
            >
              Apply Now
            </button>
       
        </div>

        {/* Image Section */}
        <div className="relative w-full md:w-1/2 h-64 md:h-auto flex justify-center items-center">
          <div className="relative group">
            <img
              src="/card.png" // Replace with your optimized image path
              alt="Apply for Credit Card"
              
              className="transform group-hover:scale-110 transition-transform duration-300"
              height={600}
              width={400} 
            />
            {/* Decorative Circular Glow */}
            <div className="absolute -top-6 -left-6 h-full w-full rounded-full bg-blue-400 opacity-20 blur-2xl group-hover:opacity-20 group-hover:scale-125 transition-all duration-300"></div>
          </div>
        </div>
      </section>

      {/* Apply Modal */}
      <ApplyNowModal isOpen={isApplyModalOpen} onClose={closeApplyModal} />
      <section className="bg-gradient-to-b from-white to-gray-100 py-24 px-6 md:px-20 text-gray-950" id='more'>
      <div className="text-center mb-12">
        <h2 className="text-5xl font-extrabold text-blue-700 mb-4">
          Our Achievements
        </h2>
        <p className="text-lg text-gray-700">
          Here&apos;s what we’ve accomplished so far. We’re proud to deliver exceptional results and services to our clients.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Statistic Card 1 */}
        <div className="group bg-white shadow-lg rounded-lg p-8 text-center hover:shadow-xl transition-all duration-300">
          <h3 className="text-5xl font-bold text-blue-600 group-hover:text-blue-800 transition-all duration-300">
            16,645
          </h3>
          <p className="text-lg text-gray-700 mt-4 group-hover:text-gray-900 transition-all duration-300">
            Finished Projects
          </p>
        </div>

        {/* Statistic Card 2 */}
        <div className="group bg-white shadow-lg rounded-lg p-8 text-center hover:shadow-xl transition-all duration-300">
          <h3 className="text-5xl font-bold text-blue-600 group-hover:text-blue-800 transition-all duration-300">
            2543+
          </h3>
          <p className="text-lg text-gray-700 mt-4 group-hover:text-gray-900 transition-all duration-300">
            Working Hours
          </p>
        </div>

        {/* Statistic Card 3 */}
        <div className="group bg-white shadow-lg rounded-lg p-8 text-center hover:shadow-xl transition-all duration-300">
          <h3 className="text-5xl font-bold text-blue-600 group-hover:text-blue-800 transition-all duration-300">
            15,952+
          </h3>
          <p className="text-lg text-gray-700 mt-4 group-hover:text-gray-900 transition-all duration-300">
            Happy Clients
          </p>
        </div>

        {/* Statistic Card 4 */}
        <div className="group bg-white shadow-lg rounded-lg p-8 text-center hover:shadow-xl transition-all duration-300">
          <h3 className="text-5xl font-bold text-blue-600 group-hover:text-blue-800 transition-all duration-300">
            14,700
          </h3>
          <p className="text-lg text-gray-700 mt-4 group-hover:text-gray-900 transition-all duration-300">
            Issued Cards
          </p>
        </div>
      </div>
    </section>
    {/* faq section */}
    <div className="p-5 bg-gray-100 rounded-lg shadow" id='faq'>
      <h1 className="text-3xl font-light text-center mb-6 text-blue-600">Frequently Asked Questions?</h1>
      <div className="space-y-4">
        {questionsAnswers.map((qa, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
            <button
              onClick={() => toggleFAQ(index)}
              className="flex justify-between items-center w-full text-left text-lg text-gray-800 font-medium"
            >
              <span>{qa.question}</span>
              <span className="text-blue-500">{activeIndex === index ? '-' : '+'}</span>
            </button>
            {activeIndex === index && (
              <p className="mt-2 text-gray-600">{qa.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
    <section className="bg-gradient-to-b from-gray-50 to-white py-24 px-6 md:px-20 text-gray-950" id='contact'>
      <div className="text-center mb-12">
        <h2 className="text-5xl font-extrabold text-blue-700 mb-4">
          Contact Us
        </h2>
        <p className="text-lg text-gray-700">
          Have questions? We&apos;re here to help! Feel free to reach out to us using the form below or through our contact details.
        </p>
      </div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
        {/* Contact Information */}
        <div className="md:w-1/3 bg-white rounded-lg shadow-lg p-8 text-center md:text-left">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h3>
          <p className="text-gray-700 mb-4">
            We’re available Monday to Friday, 9:00 AM - 6:00 PM. Reach out to us, and we’ll get back to you promptly.
          </p>
          <p className="text-gray-900 font-semibold">
            Email: <a href="mailto:ajaykumar247pp@gmail.com" className="text-blue-600 hover:underline">ajaykumar247pp@gmail.com</a>
          </p>
          <p className="text-gray-900 font-semibold mt-2">
            Phone: <a href="tel:+917568639778" className="text-blue-600 hover:underline">+91 7568639778</a>
          </p>
          <p className="text-gray-900 font-semibold mt-2">
            Address: Vaishnavi Tech Square, Ibbaluru, Bellandur, Bengaluru, Karnataka 560103
          </p>
        </div>

        {/* Contact Form */}
        <div className="md:w-2/3 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
          <form>
            {/* Name */}
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                placeholder="Your Name"
              />
            </div>

            {/* Email */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
              
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                placeholder="Your Email"
              />
            </div>

            {/* Message */}
            <div className="mb-6">
              <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">
                Message
              </label>
              <textarea
                id="message"
               
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                placeholder="Your Message"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-bold hover:bg-blue-800 transition-all duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
    </div>
  );
}
