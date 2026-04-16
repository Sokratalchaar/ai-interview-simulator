import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import ReactCountryFlag from "react-country-flag";
import { ArrowLeft } from "lucide-react";
import { Home, User, LogOut } from "lucide-react";
import { useLocation } from "react-router-dom";




function Navbar() {


   const [open,setOpen] = useState(false);
   const email = localStorage.getItem("email");
   const { i18n } = useTranslation();
   const [openLang, setOpenLang] = useState(false);
   const [lang, setLang] = useState("en");
   const langRef = useRef(null);
   const profileRef = useRef(null);

   const navigate = useNavigate();
   const location = useLocation();
   const token = localStorage.getItem("token");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email")
    localStorage.removeItem("user");
    
  Object.keys(localStorage).forEach((key) => {
    if (
      key.startsWith("insightsCache_") ||
      key.startsWith("translationCache_") ||
      key.startsWith("interviewCache_") ||
      key.startsWith("interview_")
    ) {
      localStorage.removeItem(key);
    }
  });
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        langRef.current &&
        !langRef.current.contains(e.target)
      ) {
        setOpenLang(false);
      }
  
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/welcome");
    }
  };

  const hideBackButton =
  location.pathname === "/login" ||
  location.pathname === "/welcome";

  const isAuthPage =
  location.pathname === "/login" ||
  location.pathname === "/register";

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
  
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
  
       
        <div
          onClick={() => navigate("/dashboard")}
          className="text-lg md:text-2xl font-bold text-blue-600 cursor-pointer tracking-tight text-start"
        >
          AI Interview
        </div>
  
      
        <div className="flex items-center gap-2 md:gap-4">
  
          
          <div ref={langRef} className="relative flex items-center gap-2">
  
  {/* 🔙 Back Arrow */}
  {!hideBackButton && (
  <button
    onClick={handleBack}
    className="p-2 rounded-full hover:bg-blue-50 hover:text-blue-600 transition"
  >
    <ArrowLeft size={18} />
  </button>
)}
  
            <button
              onClick={() => setOpenLang(!openLang)}
              className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-100 transition text-xs md:text-sm"
            >
              {lang === "en" && <ReactCountryFlag countryCode="GB" svg style={{ width: 16 }} />}
              {lang === "fr" && <ReactCountryFlag countryCode="FR" svg style={{ width: 16 }} />}
              {lang === "ar" && <ReactCountryFlag countryCode="SA" svg style={{ width: 16 }} />}
  
              <span className="uppercase font-medium">{lang}</span>
              <span className="text-xs opacity-70">▼</span>
            </button>
  
            {openLang && (
              <div className="absolute top-full right-0 mt-2 w-40 md:w-44 max-w-[90vw] z-50 bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden">
  
                <button
                  onClick={() => {
                    i18n.changeLanguage("en");
                    setLang("en");
                    setOpenLang(false);
                  }}
                  className="flex items-center gap-3 px-3 md:px-4 py-2 hover:bg-gray-100 w-full text-xs md:text-sm text-start"
                >
                  <ReactCountryFlag countryCode="GB" svg />
                  English
                </button>
  
                <button
                  onClick={() => {
                    i18n.changeLanguage("fr");
                    setLang("fr");
                    setOpenLang(false);
                  }}
                  className="flex items-center gap-3 px-3 md:px-4 py-2 hover:bg-gray-100 w-full text-xs md:text-sm text-start"
                >
                  <ReactCountryFlag countryCode="FR" svg />
                  Français
                </button>
  
                <button
                  onClick={() => {
                    i18n.changeLanguage("ar");
                    setLang("ar");
                    setOpenLang(false);
                  }}
                  className="flex items-center gap-3 px-3 md:px-4 py-2 hover:bg-gray-100 w-full text-xs md:text-sm text-start"
                >
                  <ReactCountryFlag countryCode="SA" svg />
                  العربية
                </button>
  
              </div>
            )}
  
          </div>
  
          {!isAuthPage && token && (
          <div ref={profileRef} className="relative">
  
            <div
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center rounded-full font-semibold shadow text-sm md:text-base">
                {email ? email[0].toUpperCase() : "U"}
              </div>
            </div>
  
            {open && (
              <div className="absolute end-0 mt-2 w-44 bg-white/70 backdrop-blur-md border border-gray-200 shadow-2xl rounded-2xl p-2">
                <button
                 onClick={() => {navigate("/dashboard",{replace:true});
                 setOpen(false);
            }}
               className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 text-blue-600  text-xs md:text-sm"
               >
               <Home size={16} />
                 Home
               </button>
            <div className="h-px bg-gray-200 my-1"></div>
                <button
                  onClick={() => {navigate("/profile");
                    setOpen(false);
                  }}
                   className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-xs md:text-sm"
                >
                  <User size={16} />
                  Profile
                </button>
  
                <button
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-red-500 text-xs md:text-sm"

                >
                  <LogOut size={16} />
                  Logout
                </button>
  
              </div>
            )}
  
          </div>
      )}
            {isAuthPage && !token && (
              <button
               onClick={() => navigate("/login")}
               className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs md:text-sm hover:bg-blue-700 transition"
               >
               Sign In
             </button>
            )}
        </div>
        
  
      </div>
    </nav>
  );
}

export default Navbar;