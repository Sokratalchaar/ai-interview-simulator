import { useState } from "react";
import axios from "axios";

function RegisterPage() {
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
return(
    <div>
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
            <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />
            <br/>
            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            />
            <button type="submit">Register</button>

        </form>
    </div>
);
}
export default RegisterPage;