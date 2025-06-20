import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddPostMutation, useVerifyMutation } from "../Redux/post";
import a from "../assets/newsbg.png";

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [reporterId, setReporterId] = useState("");
  const [addPost, { isLoading, error }] = useAddPostMutation();
  const [verify] = useVerifyMutation();

  const handleVerify = async () => {
    try {
      const response = await addPost({ email }).unwrap();
      console.log("OTP sent:", response);
      if (response?.reporterId) {
        setReporterId(response.reporterId);
      }
    } catch (err) {
      console.error("OTP send failed:", err);
      alert("Failed to send OTP. Please try again.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await verify({ email, otp, reporterId }).unwrap();
      console.log("Login Success:", response);
      
      navigate("/dashboard");
    } catch (err) {
      console.error("Login Failed:", err);
      alert("Something went wrong. Please check your OTP and try again.");
    }
  };

  return (
    <div className="flex flex-col font-marathi md:flex-row min-h-screen">
      {/* Left Panel */}
      <div className="relative flex-1 w-full h-64 md:h-auto">
        <div className="absolute inset-0">
          <img
            src={a}
            alt="News background"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full md:max-w-md flex flex-col justify-center items-center bg-white px-6 py-12">
        <h1 className="text-5xl font-normal text-red-600 mb-4 md:mb-6 text-center w-full md:-ml-28">
          शुभ प्रभात
        </h1>
        <h2 className="text-2xl font-normal text-[#0F2248] mb-6 md:mb-12 text-center w-full md:-ml-28">
          LOGIN
        </h2>

        <form onSubmit={handleLogin} className="w-full space-y-6 md:-ml-28">
          {/* Email + Verify */}
          <div className="relative w-full">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-12 px-4 pr-28 border border-[#0F2248] rounded-full text-[#0F2248] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#0F2248]"
            />
            <button
              type="button"
              onClick={handleVerify}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 bg-green-600 text-white text-sm rounded-full hover:bg-green-700 transition"
            >
              Verify
            </button>
          </div>

          {/* OTP */}
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full h-12 px-4 border border-[#0F2248] rounded-full text-[#0F2248] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#0F2248]"
          />

          {/* Submit/Login */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-28 mx-36 h-12 bg-[#0F2248] text-white rounded-full text-lg font-medium hover:bg-[#0c1b3a] transition"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          {error && (
            <p className="text-red-600 text-sm">
              Login failed. Please try again.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default SignUp;
