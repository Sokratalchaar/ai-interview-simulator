import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getInterviewDetails } from "../services/interviewService";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

function InterviewDetailsPage(){
    const {t} = useTranslation();
    const location = useLocation();
    const interviewNumber = location.state?.interviewNumber;
    const { id } = useParams();
    const [interview,setInterview] = useState(null);
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
    if(!interview){
        return <p>Loading...</p>;
      }

      const formatText = (text) => {
        if (!text) return "";
      
        return text
          .replace(/<ltr>(.*?)<\/ltr>/g, '<span dir="ltr">$1</span>')
          .replace(/\n/g, "<br/>");
      };

      return (
        <div className="min-h-screen bg-gray-50">
      
          <div className="max-w-5xl mx-auto px-6 py-12">
      
            <h1  dir="auto"
  className="text-gray-800 mb-6 leading-relaxed unicode-fix font-bold">
            {t("interview")} #{interviewNumber}
            </h1>
      
            <div className="space-y-10">
      
              {interview.questions.map((q,index)=>(
                
                <div
                  key={q.id}
                  className="border-b pb-8"
                >
      
                  <h2 dir="auto"
  className="text-gray-800 mb-6 leading-relaxed unicode-fix font-bold">
                    {t("question")} {index+1}
                  </h2>
      
                  <p
  dir="auto"
  className="text-gray-800 mb-6 leading-relaxed unicode-fix font-bold"
>
  {q.content}
</p>
      
      
                  <div className="bg-white border rounded-xl p-5">
      
                    <p dir="auto"
  className="text-gray-800 mb-6 leading-relaxed unicode-fix">
                      <span className="font-semibold ">{t("yourAnswer")}:</span>
                      <span className="ml-2 text-gray-700 ">
                        {q.answer?.content}
                      </span>
                    </p>
      
      
                    <p dir="auto"
  className="text-gray-800 mb-6 leading-relaxed unicode-fix">
                      <span className="font-semibold">{t("score")}:</span>
      
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm font-medium">
                        {q.answer?.score} / 10
                      </span>
                    </p>
      
      
                    <p dir="auto"
  className="text-gray-800 mb-6 leading-relaxed unicode-fix">
                      <span className="font-semibold">{t("feedback")}:</span>
                      <span
                       dir="auto"
                       className="ml-2"
                       dangerouslySetInnerHTML={{
                       __html: formatText(q.answer?.feedback)
                       }}
                       />
                    </p>
      
                  </div>
      
                </div>
      
              ))}
      
            </div>
      
          </div>
      
        </div>
      );
}
export default InterviewDetailsPage;