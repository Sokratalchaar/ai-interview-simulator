import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getMyInterviews,deleteInterview,getDashboardStats,getAIInsights,translateInsights } from "../services/interviewService";
import { useTranslation } from "react-i18next";
import ScoreChart from "../components/ScoreChart";
import interviewImg from "../assets/undraw_interview_yz52.svg";



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
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [loadingInsights, setLoadingInsights] = useState(false);
    const [loadingTranslation, setLoadingTranslation] = useState(false);
    useEffect(() => {
      if (!userId) return;
      const user = JSON.parse(localStorage.getItem("user"));
      setUserId(user?.id);
    }, []);
    useEffect(()=>{
        const fetchData = async()=>{
        

   

    console.log("🚀 FETCH ONCE");
            try{
              console.log("🔥 DASHBOARD useEffect RUNNING");
              console.log("📦 RANGE:", range);
                setLoading(true);
                const data = await getMyInterviews();
                setLoading(false);

                setInterviews(data);
                const statsData = await getDashboardStats(); 
                setStats(statsData);

                const shouldRefresh = localStorage.getItem("forceInsightsRefresh") === "true";

                const cacheKey = `insightsCache_${userId}_${range}`;
                const saved = localStorage.getItem(cacheKey);
                console.log("🧠 SHOULD REFRESH:", shouldRefresh);
                console.log("💾 SAVED CACHE:", saved);

               // 🔥 إذا في refresh → تجاهل الكاش بالكامل
                if (shouldRefresh) {
                console.log("🚀 BEFORE API CALL");
                setLoadingInsights(true);
                const insightsData = await getAIInsights(range);
                if (!insightsData || !insightsData.trend || insightsData.trend === "No data yet") {
                  setInsightsCache({});
                  return;
                }
                

                const cache = { en: insightsData };

                setInsightsCache(cache);
                setLoadingInsights(false);
                localStorage.setItem(cacheKey, JSON.stringify(cache));

               localStorage.removeItem("forceInsightsRefresh");

               return;
               }
               if (saved) {
                const parsed = JSON.parse(saved);
              
                // 🛑 إذا الكاش خربان → تجاهلو
                if (!parsed.en) {
                  localStorage.removeItem(cacheKey);
                } else {
                  setInsightsCache(parsed);
                  return;
                }
              }
                console.log("🚀 BEFORE API CALL");
                setLoadingInsights(true);
                const insightsData = await getAIInsights(range);
               
                const cache = { en: insightsData };

                setInsightsCache(cache);
                setLoadingInsights(false);
                localStorage.setItem(cacheKey, JSON.stringify(cache));
            }catch (error) {

                console.error(error);

            }
        };
        fetchData(); 
    },[range,userId]);
    
  

    useEffect(() => {
      const handleTranslation = async () => {
    
        // 🔥 تأكد في data
        if (!insightsCache?.en) return;
    
        // 🔥 إذا already مترجمة
        if (insightsCache[i18n.language]) return;
    
        try {
          setLoadingTranslation(true);
          const translated = await translateInsights(
            insightsCache.en,
            i18n.language
          );
    
          const cacheKey = `insightsCache_${userId}_${range}`;
    
          setInsightsCache(prev => {
            const updated = {
              ...prev,
              [i18n.language]: translated
            };
    
            localStorage.setItem(cacheKey, JSON.stringify(updated));
            setLoadingTranslation(false);
            return updated;
          });
    
        } catch (err) {
          console.error("Translation error:", err);
        }
      };
    
      handleTranslation();
    
    }, [i18n.language, insightsCache?.en]);

    const currentInsights =
  insightsCache[i18n.language] || insightsCache.en || null;;


    const handleDelete = async(id)=>{
      
        try{
          await deleteInterview(id);
          setInterviews(interviews.filter(i=>i.id !== id));
        }catch(error){
          console.error(error);
        }
      }
      const hasData = interviews.some(i => i.score !== null);
      

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
        
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      {interviews.length > 0 && (
      <div className="mb-8">
  <h1 className="text-3xl font-bold text-gray-800">
    {t("dashboardTitle")}
  </h1>
  <p className="text-gray-500 mt-1">
    {t("dashboardSubtitle")}
  </p>
</div>
      )}
          {/* Start Interview */}
          {interviews.length > 0 && (
          <div className="mb-8">
            <button
              onClick={() => navigate("/start-interview")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              {t("startNewInterview")}
            </button>
          </div>
          )}
      
          {/* Stats */}
          {interviews.length > 0 && (
          <div className="grid grid-cols-4 gap-6 mb-10">

  <div className="bg-white shadow rounded-lg p-5">
    <p className="text-gray-500">{t("totalInterviews")}</p>
    <h2 className="text-2xl font-bold">{stats?.totalInterviews||"-"}</h2>
  </div>

  <div className="bg-white shadow rounded-lg p-5">
    <p className="text-gray-500">{t("completed")}</p>
    <h2 className="text-2xl font-bold">{stats?.completed||"-"}</h2>
  </div>

  <div className="bg-white shadow rounded-lg p-5">
    <p className="text-gray-500">{t("averageScore")}</p>
    <h2 className="text-2xl font-bold">{stats?.averageScore||"-"}</h2>
  </div>

  <div className="bg-white shadow rounded-lg p-5">
    <p className="text-gray-500">{t("bestScore")}</p>
    <h2 className="text-2xl font-bold">{stats?.bestScore||"-"}</h2>
  </div>

</div>
          )}
{loadingInsights ? (
  <div className="bg-white rounded-2xl shadow p-6 mt-6">

    <h2 className="text-xl font-semibold mb-6 text-gray-800">
      🤖 {t("aIInsights")}
    </h2>

    <div className="grid md:grid-cols-2 gap-4">

      {[1,2,3,4].map((i) => (
        <div key={i} className="p-4 rounded-xl bg-gray-100 animate-pulse h-28" />
      ))}

    </div>

  </div>
) : (currentInsights && hasData&&(
 <div className="bg-white rounded-2xl shadow p-6 mt-6">

 <h2 className="text-xl font-semibold mb-6 text-gray-800">
   🤖 {t("aIInsights")}
 </h2>

 <div className="grid md:grid-cols-2 gap-4">

   {/* Trend */}
   <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 hover:scale-[1.02] transition">
     <div className="flex items-center gap-2 mb-2">
       <span className="text-xl">📊</span>
       <h3 className="font-semibold text-blue-700">{t("trend")}</h3>
     </div>
     <p className="text-gray-600 text-sm leading-relaxed">
  {loadingTranslation ? (
    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
  ) : (
    currentInsights?.trend
  )}
</p>
   </div>

   {/* Strength */}
   <div className="p-4 rounded-xl bg-green-50 border border-green-100 hover:scale-[1.02] transition">
     <div className="flex items-center gap-2 mb-2">
       <span className="text-xl">💪</span>
       <h3 className="font-semibold text-green-700">{t("strength")}</h3>
     </div>
     <p className="text-gray-600 text-sm leading-relaxed">
  {loadingTranslation ? (
    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
  ) : (
    currentInsights?.strength
  )}
</p>
   </div>

   {/* Weakness */}
   <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-100 hover:scale-[1.02] transition">
     <div className="flex items-center gap-2 mb-2">
       <span className="text-xl">⚠️</span>
       <h3 className="font-semibold text-yellow-700">{t("weakness")}</h3>
     </div>
     <p className="text-gray-600 text-sm leading-relaxed">
  {loadingTranslation ? (
    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
  ) : (
    currentInsights?.weakness
  )}
</p>
   </div>

   {/* Advice */}
   <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 hover:scale-[1.02] transition">
     <div className="flex items-center gap-2 mb-2">
       <span className="text-xl">🚀</span>
       <h3 className="font-semibold text-purple-700">{t("advice")}</h3>
     </div>
     <p className="text-gray-600 text-sm leading-relaxed">
  {loadingTranslation ? (
    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
  ) : (
    currentInsights?.advice
  )}
</p>
   </div>

 </div>

</div>
)
)}
<br/>
{hasData&&(
  <div className="flex gap-2 mb-4">
  <button
    onClick={() => setRange("week")}
    className={`px-3 py-1 rounded ${range === "week" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
  >
    {t("week")}
  </button>

  <button
    onClick={() => setRange("month")}
    className={`px-3 py-1 rounded ${range === "month" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
  >
    {t("month")}
  </button>
</div>
)}

{hasData&&(
  <ScoreChart data={chartData} />
)}


<br/>

      
          {/* Interview History */}
          {loading ? (
  // 🔄 Skeleton (بدل Loading)
  <div className="animate-pulse space-y-4 mt-10">
    <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto"></div>
    <div className="h-40 bg-gray-200 rounded"></div>
  </div>

) :interviews.length === 0 ? (
  <div className="flex flex-col items-center justify-center mt-16">
    
    <img 
  src={interviewImg} 
  className="w-72 mx-auto mb-6 float"
/>

    {/* Title */}
    <h2 className="text-3xl font-bold text-gray-800 mb-3 text-center">
      {t("noInterviewsTitle")}
    </h2>

    {/* Description */}
    <p className="text-gray-500 text-center max-w-md mb-8">
      {t("noInterviewsDesc")}
    </p>

    {/* CTA */}
    <button
      onClick={() => navigate("/start-interview")}
      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl shadow-md hover:scale-105 transition-all duration-300"
    >
      {t("startInterview")}
    </button>

  </div>
) : (
  <>
    <h2 className="text-xl font-semibold mb-4 text-gray-800">
      {t("previousInterviews")}
    </h2>

    <div className="space-y-4">
      {/* interviews list */}
    </div>
  </>
)}
      
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