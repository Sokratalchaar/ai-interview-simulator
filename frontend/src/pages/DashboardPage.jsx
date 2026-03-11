import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMyInterviews,deleteInterview } from "../services/interviewService";


function DashboardPage() {
    const navigate = useNavigate();
    const [interviews, setInterviews] = useState([]);
    useEffect(()=>{
        const fetchInterviews = async()=>{
            try{
                const data = await getMyInterviews();
                console.log("interviews:", data);
                
                setInterviews(data);
            }catch (error) {

                console.error(error);

            }
        };
        fetchInterviews(); 
    },[]);

    const handleDelete = async(id)=>{
        try{
          await deleteInterview(id);
          setInterviews(interviews.filter(i=>i.id !== id));
        }catch(error){
          console.error(error);
        }
      }


    return(
        <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold mb-6">
          Dashboard
        </h1>

        <button
          onClick={()=>navigate("/start-interview")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-8"
        >
          Start Interview
        </button>

        <h2 className="text-2xl font-semibold mb-4">
          Your Previous Interviews
        </h2>

        <div className="space-y-4">

          {interviews.map(interview => (

            <div
              key={interview.id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
            >

              <div>

                <p className="font-semibold">
                  Interview #{interview.id}
                </p>

                <p className="text-gray-500 text-sm">
                  {new Date(interview.createdAt).toLocaleDateString()}
                </p>

                <p className="mt-1">

                  {interview.score
                    ? `Score: ${interview.score} / 10`
                    : "Score: Not completed"}

                </p>

              </div>

              <div className="flex gap-2">

                <button
                  onClick={()=>navigate(`/interview/${interview.id}`)}
                  className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                >
                  View Details
                </button>

                <button
                  onClick={()=>handleDelete(interview.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default DashboardPage;