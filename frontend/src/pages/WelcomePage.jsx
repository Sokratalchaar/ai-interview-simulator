import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";


function WelcomePage(){
    
const { t, i18n } = useTranslation();

const navigate = useNavigate();



return(

  <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6">
  
  <div className="max-w-5xl w-full text-center">
  
  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
  {t("welcomeTitle")} 👋
  </h1>
  
  <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-8 md:mb-10">
  {t("welcomeSubtitle")}.
  </p>
  
  <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-12 md:mb-16">
  
  <button
  onClick={()=>navigate("/start-interview")}
  className="w-full sm:w-auto bg-blue-600 text-white px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg hover:bg-blue-700"
  >
  {t("startInterview")}
  </button>
  
  <button
  onClick={()=>navigate("/dashboard")}
  
  className="w-full sm:w-auto bg-gray-200 px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg hover:bg-gray-300"
  >
  {t("goToDashboard")}
  </button>
  
  </div>
  
  <div
    dir={i18n.language === "ar" ? "rtl" : "ltr"}
    className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-8 ${i18n.language === "ar" ? "text-right" : "text-left"}`}
  >
  
  <div className="bg-white p-5 sm:p-6 rounded-xl shadow transition transform hover:scale-105 hover:shadow-xl duration-300">
  <h3 className="font-semibold text-base sm:text-lg mb-2">
  🤖 {t("aiQuestionsTitle")}
  </h3>
  <p className="text-gray-600 text-sm sm:text-base">
  {t("aiQuestionsDesc")}.
  </p>
  </div>
  
  <div className="bg-white p-5 sm:p-6 rounded-xl shadow transition transform hover:scale-105 hover:shadow-xl duration-300">
  <h3 className="font-semibold text-base sm:text-lg mb-2">
  ⚡ {t("instantFeedbackTitle")}
  </h3>
  <p className="text-gray-600 text-sm sm:text-base">
  {t("instantFeedbackDesc")}.
  </p>
  </div>
  
  <div className="bg-white p-5 sm:p-6 rounded-xl shadow transition transform hover:scale-105 hover:shadow-xl duration-300">
  <h3 className="font-semibold text-base sm:text-lg mb-2">
  📊 {t("trackProgressTitle")}
  </h3>
  <p className="text-gray-600 text-sm sm:text-base">
  {t("trackProgressDesc")}.
  </p>
  </div>
  
  </div>
  
  </div>
  
  </div>
  
  );
}

export default WelcomePage;