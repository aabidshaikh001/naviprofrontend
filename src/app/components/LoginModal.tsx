'use client';

import { X, Eye, EyeOff } from "tabler-icons-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import axios from "axios";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void; // Added onLoginSuccess prop
}

export default function LoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: LoginModalProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const validateLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const phone = formData.get("phone")?.toString().trim();
    const password = formData.get("password")?.toString().trim();

    if (!phone || !password) {
      toast.error("All fields are required.", {
        position: "top-left",
      });
      return;
    }

    try {
      const response = await axios.post(
        "https://backend.navipro.in/api/auth/login",
        { phone, password },
        { withCredentials: true }
      );

      toast.success(response.data.message, {
        position: "top-left",
      });

      localStorage.setItem("isLoggedIn", "true");
      onLoginSuccess(); // Notify parent about successful login
      onClose(); // Close modal
      router.push("/apply"); // Redirect to apply page
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed.", {
        position: "top-left",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4">Sign In</h2>
        <form className="space-y-4" onSubmit={validateLogin}>
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
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
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
