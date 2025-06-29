import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useRegisterMutation } from '../'; // ✅ Adjust path as per your structure
import a from '../assets/newsbg.png';
import { useRegisterMutation } from '../Redux/post';

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ReporterName: '',
    email: '',
    contactNo: '',
    address: '',
  });

  const [register, { isLoading, error }] = useRegisterMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register(formData).unwrap();
      console.log("Registration Success:", response);
      navigate('/signin'); // ✅ Redirect after success
    } catch (err) {
      console.error("Registration Failed:", err);
    }
  };

  const handleNavigateToSignIn = () => {
    navigate('/signin');
  };

  return (
    <div className="flex flex-col font-marathi md:flex-row min-h-screen">
      {/* Left panel */}
      <div className="relative flex-1 w-full h-64 md:h-auto">
        <div className="absolute inset-0">
          <img src={a} alt="News background" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full md:max-w-md flex flex-col justify-center items-center bg-white px-6 py-6">
        <h1 className="text-5xl font-normal text-red-600 mb-4 md:mb-4 text-center w-full md:-ml-28">
          शुभ प्रभात
        </h1>
        <h2 className="text-2xl font-normal text-[#0F2248] mb-6 md:mb-6 text-center w-full md:-ml-28">
          SIGN UP
        </h2>

        <form onSubmit={handleSubmit} className="w-full space-y-6 md:-ml-28">
          <input
            type="text"
            name="ReporterName"
            placeholder="Name"
            value={formData.ReporterName}
            onChange={handleChange}
            required
            className="w-full h-12 px-4 border border-[#0F2248] rounded-full text-[#0F2248] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#0F2248]"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full h-12 px-4 border border-[#0F2248] rounded-full text-[#0F2248] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#0F2248]"
          />
          <input
            type="text"
            name="contactNo"
            placeholder="Contact No"
            value={formData.contactNo}
            onChange={handleChange}
            required
            className="w-full h-12 px-4 border border-[#0F2248] rounded-full text-[#0F2248] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#0F2248]"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full h-12 px-4 border border-[#0F2248] rounded-full text-[#0F2248] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#0F2248]"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-28 mx-36 h-12 bg-[#0F2248] text-white rounded-full text-lg font-normal hover:bg-[#0c1b3a] transition"
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>

          {error && <p className="text-red-600 text-sm">Registration failed. Please try again.</p>}

          <h1 className="text-xl font-normal ml-16">
            Already Have Account?{' '}
            <span
              className="text-red-600 cursor-pointer hover:underline"
              onClick={handleNavigateToSignIn}
            >
              Sign In
            </span>
          </h1>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
