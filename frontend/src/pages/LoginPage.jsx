import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

function LoginPage() {

  const navigate = useNavigate();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

        const data = await login(email,password);
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", email);
    
        console.log("Token:", data.token);
        navigate("/welcome");
        
    
      } catch (error) {
    
        console.error(error.response?.data || error.message);
    
      }
  };
 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
  
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md w-full max-w-md">
  
        <h2 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6 text-center">
          Login
        </h2>
  
        <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
  
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 sm:p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
  
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 sm:p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
  
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 sm:py-2 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
          >
            Login
          </button>
  
          <p className="text-xs sm:text-sm text-center mt-3 sm:mt-4">
            Don't have an account?
            <span
              className="text-blue-600 cursor-pointer ml-1"
              onClick={()=>navigate("/register",{replace:true})}
            >
              Register
            </span>
          </p>
  
        </form>
  
      </div>
  
    </div>
  );
}

export default LoginPage;