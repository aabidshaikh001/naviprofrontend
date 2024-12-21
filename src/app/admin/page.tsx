'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';


const AdminDashboard = () => {
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
      const response = await axios.post('http://localhost:5000/api/upload-qr', formData, {
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
  const [activeTab, setActiveTab] = useState<'users' | 'userDetails' | 'qrCode'>('users'); // Add 'qrCode' tab

  // Function to handle admin login
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/admin/login', loginData);
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

  // Function to fetch admin-related user data
  const fetchAdminDetails = async () => {
    try {
      const response = await axios.get('http://localhost:5000/admin/users');
      setAdminDetails(response.data.users);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching admin details:', error);
    }
  };

  // Fetch user details separately
  const fetchUserDetails = async () => {
    try {
      const response = await axios.get('http://localhost:5000/admin/userDetails');
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

      {/* Users Table */}
      {activeTab === 'users' && (
        <div className="overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
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
              {adminDetails.map((user, index) => (
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

      {/* User Details Table */}
      {activeTab === 'userDetails' && (
        <div className="overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">User Details</h2>
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
              </tr>
            </thead>
            <tbody>
              {Details.map((detail, index) => (
                <tr key={index}>
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
                </tr>
              ))}
            </tbody>
          </table>
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
