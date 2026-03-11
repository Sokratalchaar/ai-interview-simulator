import { useState } from "react";
import { useNavigate } from "react-router-dom";

function StartInterviewPage(){

 const [role,setRole] = useState("");
 const [level,setLevel] = useState("");
 const [tech,setTech] = useState("");

 const navigate = useNavigate();

 const handleStart = () => {

   navigate("/interview",{
     state:{
       role,
       level,
       tech
     }
   });

 };

 return(
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
  
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
  
        <h1 className="text-2xl font-bold mb-6 text-center">
          Start AI Interview
        </h1>
  
        <div className="space-y-4">
  
          <div>
            <p className="text-sm font-medium mb-1">Role</p>
            <input
              value={role}
              onChange={(e)=>setRole(e.target.value)}
              placeholder="Backend Developer"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <div>
            <p className="text-sm font-medium mb-1">Level</p>
            <select
              value={level}
              onChange={(e)=>setLevel(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Level</option>
              <option value="Junior">Junior</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
            </select>
          </div>
  
          <div>
            <p className="text-sm font-medium mb-1">Tech Stack</p>
            <input
              value={tech}
              onChange={(e)=>setTech(e.target.value)}
              placeholder="Node.js / React / Java"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <button
            onClick={handleStart}
            disabled={!role || !level || !tech}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition mt-4"
          >
            Start Interview
          </button>
  
        </div>
  
      </div>
  
    </div>
  );
}

export default StartInterviewPage;