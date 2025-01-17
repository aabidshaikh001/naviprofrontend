'use client';

import { X, Eye, EyeOff } from 'tabler-icons-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function ApplyNowModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const validateSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const phone = formData.get('phone')?.toString().trim();
    const applyFor = formData.get('applyFor')?.toString().trim();
    const income = formData.get('income')?.toString().trim();
    const password = formData.get('password')?.toString().trim();

    if (!name || !email || !phone || !applyFor || !income || !password) {
      toast.error('All fields are required.',{
        position: 'top-left',
      });
      return;
    }

    try {
      await axios.post('https://backend.navipro.in/api/auth/register', {
        name,
        email,
        phone,
        applyFor,
        income,
        password,
      });
      toast.success('Registration Successful. Please Login',{
        position: 'top-left',
      });
      onClose();
      
      router.push('/apply');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed.',{
        position: 'top-left',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4">Apply Now</h2>
        <form className="space-y-4" onSubmit={validateSignup}>
          <input type="text" name="name" placeholder="Full Name" className="w-full px-4 py-2 border rounded-lg focus:outline-none" />
          <input type="email" name="email" placeholder="Email" className="w-full px-4 py-2 border rounded-lg focus:outline-none" />
          <input type="text" name="phone" placeholder="Phone" className="w-full px-4 py-2 border rounded-lg focus:outline-none" />
          <select name="applyFor" className="w-full px-4 py-2 border rounded-lg focus:outline-none">
            <option value="Credit Card">Credit Card</option>
          </select>
          <input type="number" name="income" placeholder="Income" className="w-full px-4 py-2 border rounded-lg focus:outline-none" />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">Apply Now</button>
        </form>
      </div>
    </div>
  );
}
