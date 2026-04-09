import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getInterviewDetails,translateInterview  } from "../services/interviewService";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

function InterviewDetailsPage(){
    const {t,i18n } = useTranslation();
    const location = useLocation();
    const interviewNumber = location.state?.interviewNumber;
    const { id } = useParams();
    const [interview,setInterview] = useState(null);
    const [translatedInterview, setTranslatedInterview] = useState(null);
    const [loadingTranslation, setLoadingTranslation] = useState(false);
    useEffect(()=>{
        const fetchDetails=async()=>{
            try{
                const data = await getInterviewDetails(id);
                setInterview(data);
            } catch(error){

                console.error(error);
        
              }
        };
        fetchDetails();
    },[id]);
    useEffect(() => {
      if (!interview) return;
    
      const lang = i18n.language;
      const cacheKey = `interview_${interview.id}_${lang}`;
    
      // check cache
      const saved = localStorage.getItem(cacheKey);
      if (saved) {
        setTranslatedInterview(JSON.parse(saved));
        return;
      }
    
      //if EN => don't translate
      if (lang === interview.language) {
        setTranslatedInterview(interview);
        return;
      }
    
      // translate
      const translate = async () => {
        try {
          setLoadingTranslation(true);
    
          const payload = {
            questions: interview.questions.map(q => ({
              id: q.id,
              content: q.content,
              feedback: q.answer?.feedback
            }))
          };
    
          const res = await translateInterview(payload, lang);
    
         
          const merged = {
            ...interview,
            questions: interview.questions.map((q, i) => ({
              ...q,
              content: res.questions[i].content,
              answer: {
                ...q.answer,
                feedback: res.questions[i].feedback
              }
            }))
          };
    
          setTranslatedInterview(merged);
    
          localStorage.setItem(cacheKey, JSON.stringify(merged));
    
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingTranslation(false);
        }
      };
    
      translate();
    
    }, [i18n.language, interview]);
    if(!interview || !translatedInterview){
      return (
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-5xl mx-auto px-6 py-12">
      
            {/* Title skeleton */}
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-8 animate-pulse" />
      
            <div className="space-y-10">
      
              {[1,2,3].map((i) => (
                <div key={i} className="border-b pb-8">
      
                  {/* Question title */}
                  <div className="h-5 bg-gray-200 rounded w-1/4 mb-6 animate-pulse" />
      
                  {/* Question text */}
                  <div className="space-y-2 mb-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                  </div>
      
                  {/* Card */}
                  <div className="bg-white border rounded-xl p-5 space-y-4">
      
                    {/* Answer */}
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
      
                    {/* Score */}
                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
      
                    {/* Feedback */}
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
                    </div>
      
                  </div>
      
                </div>
              ))}
      
            </div>
      
          </div>
        </div>
      );
    }
    const data = translatedInterview;
      const formatText = (text) => {
        if (!text) return "";
      
        return text
          .replace(/<ltr>(.*?)<\/ltr>/g, '<span dir="ltr">$1</span>')
          .replace(/\n/g, "<br/>");
      };

      return (
        <div className="min-h-screen bg-gray-50">
      
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      
            <div className="mb-8 sm:mb-10">
              <h1
                dir="auto"
                className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2"
              >
                {t("interview")} #{interviewNumber}
              </h1>
      
              <p className="text-gray-400 text-xs sm:text-sm">
                {t("interviewDetailsDesc") || "Review your performance and feedback"}
              </p>
            </div>
      
            {/* 🔥 Translation indicator */}
            {loadingTranslation && (
              <div className="mb-4 sm:mb-6 flex items-center gap-2 text-xs sm:text-sm text-blue-500">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 rounded-full animate-ping" />
                <span>Translating...</span>
              </div>
            )}
      
            <div className="space-y-8 sm:space-y-10">
      
              {data.questions.map((q, index) => (
      
                <div
                  key={q.id}
                  className="border-b pb-6 sm:pb-8"
                >
      
                  {/* Question title */}
                  <h2
                    dir="auto"
                    className="text-gray-800 mb-4 sm:mb-6 leading-relaxed unicode-fix font-bold text-base sm:text-lg"
                  >
                    {t("question")} {index + 1}
                  </h2>
      
                  {/* Question content */}
                  <div
                    dir="auto"
                    className="text-gray-800 mb-4 sm:mb-6 leading-relaxed unicode-fix font-bold text-sm sm:text-base"
                  >
                    {loadingTranslation ? (
                      <div className="h-4 sm:h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
                    ) : (
                      q.content
                    )}
                  </div>
      
                  {/* Card */}
                  <div className="bg-white border rounded-xl p-4 sm:p-5">
      
                    {/* Answer */}
                    <p
                      dir="auto"
                      className="text-gray-800 mb-4 sm:mb-6 leading-relaxed unicode-fix text-sm sm:text-base"
                    >
                      <span className="font-semibold">{t("yourAnswer")}:</span>
                      <span className="ml-2 text-gray-700 break-words">
                        {q.answer?.content}
                      </span>
                    </p>
      
                    {/* Score */}
                    <p
                      dir="auto"
                      className="text-gray-800 mb-4 sm:mb-6 leading-relaxed unicode-fix text-sm sm:text-base"
                    >
                      <span className="font-semibold">{t("score")}:</span>
      
                      <span className="bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium ml-2 inline-block">
                        {q.answer?.score} / 10
                      </span>
                    </p>
      
                    {/* Feedback */}
                    <div
                      dir="auto"
                      className="text-gray-800 leading-relaxed unicode-fix text-sm sm:text-base"
                    >
                      <span className="font-semibold">{t("feedback")}:</span>
      
                      {loadingTranslation ? (
                        <div className="ml-2 space-y-2 mt-2">
                          <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
                          <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse" />
                          <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
                        </div>
                      ) : (
                        <span
                          dir="auto"
                          className="ml-2 block break-words"
                          dangerouslySetInnerHTML={{
                            __html: formatText(q.answer?.feedback)
                          }}
                        />
                      )}
                    </div>
      
                  </div>
      
                </div>
      
              ))}
      
            </div>
      
          </div>
      
        </div>
      );
}
export default InterviewDetailsPage;