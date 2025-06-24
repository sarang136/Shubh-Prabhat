import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

    if (name === "contactNo") {
      // Allow only digits and max 10 digits
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length <= 10) {
        setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register(formData).unwrap();
      console.log("Registration Success:", response);
      navigate('/', { state: { message: response.message } });
    } catch (err) {
      // <p>{}</p>
      console.error("Registration Failed:", err.data.error);
    }
  };

  const handleNavigateToSignIn = () => {
    navigate('/');
  };


  const isFormValid =
    formData.ReporterName.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.contactNo.length === 10 &&
    formData.address.trim() !== '';

  return (
    <div className="flex flex-col md:flex-row min-h-screen font-marathi">
      {/* Left Panel */}
      <div className="flex-1 h-64 md:h-auto relative">
        <img
          src={a}
          alt="News background"
          className="absolute inset-0 w-full h-full object-cover bg-[#12294A]"
        />
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white px-6 py-6">
        <h1 className="text-5xl font-normal text-red-600 mb-4 text-center w-full">
          शुभ प्रभात
        </h1>
        <h2 className="text-2xl font-normal text-[#0F2248] mb-6 text-center w-full">
          SIGN UP
        </h2>

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
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
            inputMode="numeric"
            pattern="\d{10}"
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

          <div className='flex justify-center'>
            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className={`py-2 px-4 bg-[#0F2248] text-white rounded-full text-lg font-normal transition ${
                isLoading || !isFormValid
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#0c1b3a]"
              }`}
            >
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center">
              {error?.data?.error}
            </p>
          )}

          <p className="cursor-pointer text-center">
            Already Have Account?
            <span
              className="text-red-600 cursor-pointer hover:underline ml-1"
              onClick={handleNavigateToSignIn}
            >
              Sign In
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
