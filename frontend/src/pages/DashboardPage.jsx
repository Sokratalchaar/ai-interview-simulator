import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getMyInterviews,deleteInterview,getDashboardStats,getAIInsights,translateInsights } from "../services/interviewService";
import { useTranslation } from "react-i18next";
import ScoreChart from "../components/ScoreChart";



function DashboardPage() {
   const [stats, setStats] = useState(null);
   const [range, setRange] = useState("week");
   const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [showDeleteModal,setShowDeleteModal] = useState(false);
    const [selectedInterview,setSelectedInterview] = useState(null);
    const [interviews, setInterviews] = useState([]);
    const [insights, setInsights] = useState(null);
    const [insightsCache, setInsightsCache] = useState({});
    const hasFetched = useRef(false);
    useEffect(()=>{
        const fetchData = async()=>{
          if (hasFetched.current) return;

    hasFetched.current = true;

    console.log("🚀 FETCH ONCE");
            try{
              console.log("🔥 DASHBOARD useEffect RUNNING");
              console.log("📦 RANGE:", range);
                const data = await getMyInterviews();
                

                setInterviews(data);
                const statsData = await getDashboardStats(); 
                setStats(statsData);

                const shouldRefresh = localStorage.getItem("forceInsightsRefresh") === "true";

                const saved = localStorage.getItem(`insightsCache_${range}`);
                console.log("🧠 SHOULD REFRESH:", shouldRefresh);
console.log("💾 SAVED CACHE:", saved);

               // 🔥 إذا في refresh → تجاهل الكاش بالكامل
                if (shouldRefresh) {
                console.log("🚀 BEFORE API CALL");

                const insightsData = await getAIInsights(range);

                const cache = { en: insightsData };

                setInsightsCache(cache);

                localStorage.setItem(
               `insightsCache_${range}`,
                JSON.stringify(cache)
                );

               localStorage.removeItem("forceInsightsRefresh");

               return;
               }
                if (saved) {
                  console.log("⚡ USING CACHE");
                  setInsightsCache(JSON.parse(saved));
                  return;
                }
                console.log("🚀 BEFORE API CALL");
                const insightsData = await getAIInsights(range);
               
                const cache = { en: insightsData };

                setInsightsCache(cache);

                localStorage.setItem(
                  `insightsCache_${range}`,
                  JSON.stringify(cache)
                );
            }catch (error) {

                console.error(error);

            }
        };
        fetchData(); 
    },[range]);
    
    useEffect(() => {
      hasFetched.current = false;
    }, [range]);

    useEffect(() => {
      const handleTranslation = async () => {
        if (!insightsCache.en) return;
    
        // إذا موجود cache → استخدمه
        if (insightsCache[i18n.language]) {
          return;
        }

       
        // إذا مش موجود → ترجم
        const translated = await translateInsights(
          insightsCache.en,
          i18n.language
        );
    
        setInsightsCache(prev => {
          const updated = {
            ...prev,
            [i18n.language]: translated
          };
        
          localStorage.setItem(
            `insightsCache_${range}`,
            JSON.stringify(updated)
          );
        
          return updated;
        });
      };
    
      handleTranslation();
    }, [i18n.language, insightsCache]);

    const currentInsights =
  insightsCache[i18n.language] || insightsCache.en;


    const handleDelete = async(id)=>{
      
        try{
          await deleteInterview(id);
          setInterviews(interviews.filter(i=>i.id !== id));
        }catch(error){
          console.error(error);
        }
      }

      

      const now = new Date();

      const filtered = interviews.filter(i => {
        if (!i.score) return false;
      
        const date = new Date(i.createdAt);
        const diffDays = (now - date) / (1000 * 60 * 60 * 24);
      
        if (range === "week") return diffDays <= 7;
        if (range === "month") return diffDays <= 30;
      
        return true;
      });
      
      let chartData = filtered
        .map(i => ({
          date: new Date(i.createdAt).toLocaleString(i18n.language === "ar" ? "ar-EG" : "en-US", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
          }),
          score: Number(i.score)
        }))
        .reverse();
      
      // ✅ هون الحل
      if (range === "week") {
        chartData = chartData.slice(-10);
      }


      return (
        <div
  dir={i18n.language === "ar" ? "rtl" : "ltr"}
  className="max-w-6xl mx-auto"
>
      
          <h1 className="text-3xl font-bold mb-6">{t("dashboard")}</h1>
      
          {/* Start Interview */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/start-interview")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              {t("startInterview")}
            </button>
          </div>
      
          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mb-10">

  <div className="bg-white shadow rounded-lg p-5">
    <p className="text-gray-500">{t("totalInterviews")}</p>
    <h2 className="text-2xl font-bold">{stats?.totalInterviews}</h2>
  </div>

  <div className="bg-white shadow rounded-lg p-5">
    <p className="text-gray-500">{t("completed")}</p>
    <h2 className="text-2xl font-bold">{stats?.completed}</h2>
  </div>

  <div className="bg-white shadow rounded-lg p-5">
    <p className="text-gray-500">{t("averageScore")}</p>
    <h2 className="text-2xl font-bold">{stats?.averageScore}</h2>
  </div>

  <div className="bg-white shadow rounded-lg p-5">
    <p className="text-gray-500">{t("bestScore")}</p>
    <h2 className="text-2xl font-bold">{stats?.bestScore}</h2>
  </div>

</div>

{currentInsights && (
  <div className="bg-white shadow rounded-lg p-5 mb-6">
    <h2 className="text-lg font-semibold mb-2">AI Insights</h2>

    <p>📊 {t("trend")}: {currentInsights?.trend}</p>
    <p>💪 {t("strength")}: {currentInsights?.strength}</p>
    <p>⚠️ {t("weakness")}: {currentInsights?.weakness}</p>
    <p>🚀 {t("advice")}: {currentInsights?.advice}</p>
  </div>
)}
<div className="flex gap-2 mb-4">
  <button
    onClick={() => setRange("week")}
    className={`px-3 py-1 rounded ${range === "week" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
  >
    Week
  </button>

  <button
    onClick={() => setRange("month")}
    className={`px-3 py-1 rounded ${range === "month" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
  >
    Month
  </button>
</div>

<ScoreChart data={chartData} />

<br/>

      
          {/* Interview History */}
          <h2 className="text-xl font-semibold mb-4">{t("previousInterviews")}</h2>
      
          <div className="space-y-4">
      
            {interviews.map((interview,index) => (
             
              <div
                key={interview.id}
                className="bg-white shadow rounded-lg p-5 flex justify-between items-center"
              >
      
                <div>
                  <h3 className="font-semibold">{t("interview")} #{interviews.length - index}</h3>
                  <p className="text-gray-500">
                    {new Date(interview.createdAt).toLocaleDateString()}
                  </p>
      
                  <p className="mt-1">
                    {t("score")}:{" "}
                    {interview.score !== null
                      ? `${interview.score} / 10`
                      : t("notCompleted")}
                  </p>
                </div>
      
                <div className="flex gap-3">
      
                  <button
                    onClick={() => navigate(`/interview/${interview.id}`,{
                    state:{interviewNumber: interviews.length - index}
                    })}
                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                  >
                    {t("viewDetails")}
                  </button>
      
                  <button
                    onClick={() => {
                      setSelectedInterview(interview.id);
                      setShowDeleteModal(true);
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    {t("delete")}
                  </button>
      
                </div>
      
              </div>
      
            ))}
      
          </div>
      
      
          {/* DELETE MODAL */}
          {showDeleteModal && (
      
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      
              <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
      
                <h2 className="text-xl font-semibold mb-3">
                  {t("deleteInterview")}
                </h2>
      
                <p className="text-gray-600 mb-6">
                  {t("confirmEndInterview")}
                </p>
      
                <div className="flex justify-end gap-3">
      
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    {t("cancel")}
                  </button>
      
                  <button
                    onClick={() => {
                      handleDelete(selectedInterview);
                      setShowDeleteModal(false);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    {t("delete")}
                  </button>
      
                </div>
      
              </div>
      
            </div>
      
          )}
      
        </div>
      );
}

export default DashboardPage;