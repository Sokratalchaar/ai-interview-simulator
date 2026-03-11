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
    <div>
        <h1>Start AI Interview</h1>

        <div>
            <p>Role</p>
            <input
            value={role}
            onChange={(e)=>setRole(e.target.value)}
            placeholder="Backend Developer"
            />
            <p>Level</p>
            <select onChange={(e)=>setLevel(e.target.value)}>
                <option value="">Select Level</option>
                <option value="Junior">Junior</option>
                <option value="Mid">Mid</option>
                <option value="Senior">Senior</option>
            </select>

            <p>Tech</p>
            <input
            value={tech}
            onChange={(e)=>setTech(e.target.value)}
            placeholder="Node.js / React/ Java"
            />
            <br/> <br/>
            <button onClick={handleStart}>Start Interview</button>
        </div>
    </div>
 );
}

export default StartInterviewPage;