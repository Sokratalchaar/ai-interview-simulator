import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ReactCountryFlag from "react-country-flag";




function Navbar() {


   const [open,setOpen] = useState(false);
   const email = localStorage.getItem("email");
   const { i18n } = useTranslation();
   const [openLang, setOpenLang] = useState(false);
const [lang, setLang] = useState("en");

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
        <div className="relative">

  <button
    onClick={() => setOpenLang(!openLang)}
    className="flex items-center gap-2 border rounded-lg px-3 py-1 hover:bg-gray-100"
  > 
    {lang === "en" && (
      <ReactCountryFlag countryCode="GB" svg style={{ width: "20px", height: "20px" }} />
    )}
    {lang === "fr" && (
      <ReactCountryFlag countryCode="FR" svg style={{ width: "20px", height: "20px" }} />
    )}
    {lang === "ar" && (
      <ReactCountryFlag countryCode="SA" svg style={{ width: "20px", height: "20px" }} />
    )}
    <span className="uppercase">{lang}</span>
    <span className="text-xs">▼</span>

    
  </button>

  {openLang && (
    <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-40">

      <button
        onClick={() => {
          i18n.changeLanguage("en");
          setLang("en");
          setOpenLang(false);
        }}
        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full"
      >
        <ReactCountryFlag countryCode="GB" svg style={{ width: "20px", height: "20px" }} />
        English
      </button>

      <button
        onClick={() => {
          i18n.changeLanguage("fr");
          setLang("fr");
          setOpenLang(false);
        }}
        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full"
      >
        <ReactCountryFlag countryCode="FR" svg style={{ width: "20px", height: "20px" }} />
        Français
      </button>

      <button
        onClick={() => {
          i18n.changeLanguage("ar");
          setLang("ar");
          setOpenLang(false);
        }}
        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full"
      >
        <ReactCountryFlag countryCode="SA" svg style={{ width: "20px", height: "20px" }} />
        العربية
      </button>

    </div>
  )}

</div>

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