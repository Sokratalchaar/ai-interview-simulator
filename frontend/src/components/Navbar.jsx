import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {


   const [open,setOpen] = useState(false);
   const email = localStorage.getItem("email");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email")
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">

      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        <h1
          onClick={() => navigate("/dashboard")}
          className="text-xl font-bold text-blue-600 cursor-pointer"
        >
          AI Interview
        </h1>

        <div className="flex gap-6 items-center">

          <button
            onClick={() => navigate("/dashboard")}
            className="text-gray-700 hover:text-blue-600"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/start-interview")}
            className="text-gray-700 hover:text-blue-600"
          >
            Start Interview
          </button>

          <button
          onClick={() => navigate("/profile")}
          className="text-gray-700 hover:text-blue-600"
          >
           Profile
         </button>

         <div className="relative">

<div
  onClick={()=>setOpen(!open)}
  className="flex items-center gap-2 cursor-pointer"
>

  <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full">
    {email ? email[0].toUpperCase() : "U"}
  </div>

 

</div>

{open && (

  <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg p-2">

    <button
      onClick={()=>navigate("/profile")}
      className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
    >
      Profile
    </button>

    <button
      onClick={handleLogout}
      className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-red-500"
    >
      Logout
    </button>

  </div>

)}

</div>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;