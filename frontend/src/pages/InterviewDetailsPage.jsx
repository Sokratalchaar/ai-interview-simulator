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

      return(
        <div className="min-h-screen bg-gray-100 p-8">
      
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">
      
            <h1 className="text-2xl font-bold mb-6 text-center">
              Interview #{interview.id}
            </h1>
      
            <div className="space-y-6">
      
              {interview.questions.map((q,index)=>(
                <div
                  key={q.id}
                  className="border border-gray-200 p-4 rounded-lg bg-gray-50"
                >
      
                  <h3 className="font-semibold mb-2">
                    Question {index+1}
                  </h3>
      
                  <p className="mb-3 text-gray-800">
                    {q.content}
                  </p>
      
                  <p className="mb-2">
                    <b>Your answer:</b> {q.answer?.content}
                  </p>
      
                  <p className="mb-2">
                    <b>Score:</b>
                    <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {q.answer?.score}
                    </span>
                  </p>
      
                  <p className="text-gray-700">
                    <b>Feedback:</b> {q.answer?.feedback}
                  </p>
      
                </div>
              ))}
      
            </div>
      
          </div>
      
        </div>
      );
}
export default InterviewDetailsPage;