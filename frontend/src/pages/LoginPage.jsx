import { useState } from "react";
import { login } from "../services/authService";

function LoginPage() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

        const data = await login(email,password);
        localStorage.setItem("token", data.token);
    
        console.log("Token:", data.token);
    
      } catch (error) {
    
        console.error(error.response?.data || error.message);
    
      }
  };

  return (
    <div>

      <h2>Login</h2>

      <form onSubmit={handleLogin}>

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

        <br/>

        <button type="submit">Login</button>

      </form>

    </div>
  );
}

export default LoginPage;