import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
    const navigate = useNavigate();
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const handleRegister = async (e) =>{
        e.preventDefault();

        try{
            const res = await axios.post("http://localhost:5000/api/auth/register",{
                email,
                password
            });
            console.log(res.data);
        } catch (error) {

            console.error(error.response?.data || error.message);
    }
};
return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
  
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
  
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Account
        </h2>
  
        <form onSubmit={handleRegister} className="space-y-4">
  
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
  
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
  
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Register
          </button>
          <p className="text-sm text-center mt-4">
           Already have an account?
          <span className="text-blue-600 cursor-pointer ml-1"
          onClick={()=>navigate("/login")}
          >
           Login
          </span>
          </p>
  
        </form>
  
      </div>
  
    </div>
  );
}
export default RegisterPage;