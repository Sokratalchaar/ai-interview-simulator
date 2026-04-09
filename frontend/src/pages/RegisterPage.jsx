import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
    const [error,setError] = useState("");
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const handleRegister = async (e) =>{
        e.preventDefault();
          setError("");
          setLoading(true);
        try{
            const res = await axios.post("http://localhost:5000/api/auth/register",{
                email,
                password
            });
            console.log(res.data);
            navigate("/welcome",{replace:true});
        } catch (error) {

          if(error.response){
            setError(error.response.data.error);
          } else {
            setError("Server error. Try again later.");
          }
      
        } finally {
          setLoading(false);
        }
      };
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md w-full max-w-md">
      
            <h2 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6 text-center">
              Create Account
            </h2>
      
            <form onSubmit={handleRegister} className="space-y-3 sm:space-y-4">
      
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 sm:p-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
      
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 sm:p-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
      
              {error && (
                <p className="text-red-500 text-xs sm:text-sm text-center">
                  ❌ {error}
                </p>
              )}
      
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2.5 sm:py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 text-sm sm:text-base"
              >
                {loading ? "Creating account..." : "Register"}
              </button>
      
              <p className="text-xs sm:text-sm text-center mt-3 sm:mt-4">
                Already have an account?
                <span
                  className="text-blue-600 cursor-pointer ml-1"
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