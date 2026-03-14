import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getInterviewDetails } from "../services/interviewService";

function InterviewDetailsPage(){
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

      return (
        <div className="min-h-screen bg-gray-50">
      
          <div className="max-w-5xl mx-auto px-6 py-12">
      
            <h1 className="text-3xl font-bold mb-10">
              Interview #{interview.id}
            </h1>
      
            <div className="space-y-10">
      
              {interview.questions.map((q,index)=>(
                
                <div
                  key={q.id}
                  className="border-b pb-8"
                >
      
                  <h2 className="text-xl font-semibold mb-3">
                    Question {index+1}
                  </h2>
      
                  <p className="text-gray-800 mb-6 leading-relaxed">
                    {q.content}
                  </p>
      
      
                  <div className="bg-white border rounded-xl p-5">
      
                    <p className="mb-3">
                      <span className="font-semibold">Your answer:</span>
                      <span className="ml-2 text-gray-700">
                        {q.answer?.content}
                      </span>
                    </p>
      
      
                    <p className="mb-3 flex items-center gap-2">
                      <span className="font-semibold">Score:</span>
      
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm font-medium">
                        {q.answer?.score} / 10
                      </span>
                    </p>
      
      
                    <p className="text-gray-700 leading-relaxed">
                      <span className="font-semibold">Feedback:</span>
                      <span className="ml-2">
                        {q.answer?.feedback}
                      </span>
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