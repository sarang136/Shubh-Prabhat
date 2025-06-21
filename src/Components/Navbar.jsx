import React, { useState } from 'react';
import { FaUserCircle, FaBars, FaUser } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useLogoutMutation } from '../Redux/post';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Navbar = ({ toggleSidebar }) => {
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);
  const toggleProfileSidebar = () => setIsProfileSidebarOpen(!isProfileSidebarOpen);

  const auth = useSelector((state) => state.auth);
  const reporter = auth?.user?.reporter;
  const token = auth?.user?.token;

  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsProfileSidebarOpen(false);

    setTimeout(async () => {
      toast.success("Logout Successful");
      navigate('/signin');

      try {
        await logout({ token }).unwrap();
        localStorage.clear();
      } catch (err) {
        console.error('Logout failed:', err);
      }
    }, 300);
  };



  return (
    <div className="relative w-full font-marathi bg-[#12294A]">
      <div className="flex justify-between items-center px-4 sm:px-6 md:px-10 py-4 sm:py-5">
        <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-normal">Dashboard</h1>
        <FaUserCircle
          className="text-white text-2xl sm:text-3xl cursor-pointer"
          onClick={toggleProfileSidebar}
        />
      </div>

      <div className={`fixed top-0 right-0 h-full w-64 bg-[#1E3A8A] text-white shadow-lg transform transition-transform duration-300 z-50 ${isProfileSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6">
          <button className="text-white text-xl mb-4" onClick={toggleProfileSidebar}>✕</button>

          <div className='h-[80vh] flex flex-col justify-between'>
            <div className='flex flex-col items-left gap-4'>
              <FaUser size={40} className='border rounded-full' />
              <p className="text-2xl font-bold">{reporter?.name}</p>
              <p className="text-sm text-gray-300">{reporter?.email}</p>
              <p className="text-sm text-gray-300">{reporter?.phone}</p>
            </div>

            <div className='flex justify-center'>
              <button
                className='border py-2 px-4 rounded-xl hover:bg-white hover:text-[#1E3A8A] transition-all duration-300'
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {isProfileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={toggleProfileSidebar}
        />
      )}
    </div>
  );
};

export default Navbar;
