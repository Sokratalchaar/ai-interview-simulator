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


      return (
        <div className="max-w-6xl mx-auto">
      
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
          {/* Start Interview */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/start-interview")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Start Interview
            </button>
          </div>
      
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-10">
      
            <div className="bg-white shadow rounded-lg p-5">
              <p className="text-gray-500">Total Interviews</p>
              <h2 className="text-2xl font-bold">{interviews.length}</h2>
            </div>
      
            <div className="bg-white shadow rounded-lg p-5">
              <p className="text-gray-500">Completed</p>
              <h2 className="text-2xl font-bold">
                {interviews.filter(i => i.score !== null).length}
              </h2>
            </div>
      
            <div className="bg-white shadow rounded-lg p-5">
              <p className="text-gray-500">Average Score</p>
              <h2 className="text-2xl font-bold">
              {
  (() => {
    const completed = interviews.filter(i => i.score != null);

    if (completed.length === 0) return "-";

    const total = completed.reduce((sum, i) => sum + Number(i.score), 0);

    return (total / completed.length).toFixed(1);
  })()
}
              </h2>
            </div>
      
          </div>
      
          {/* Interview History */}
          <h2 className="text-xl font-semibold mb-4">Your Previous Interviews</h2>
      
          <div className="space-y-4">
      
            {interviews.map((interview) => (
      
              <div
                key={interview.id}
                className="bg-white shadow rounded-lg p-5 flex justify-between items-center"
              >
      
                <div>
                  <h3 className="font-semibold">Interview #{interview.id}</h3>
                  <p className="text-gray-500">
                    {new Date(interview.createdAt).toLocaleDateString()}
                  </p>
      
                  <p className="mt-1">
                    Score:{" "}
                    {interview.score !== null
                      ? `${interview.score} / 10`
                      : "Not completed"}
                  </p>
                </div>
      
                <div className="flex gap-3">
      
                  <button
                    onClick={() => navigate(`/interview/${interview.id}`)}
                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                  >
                    View Details
                  </button>
      
                  <button
                    onClick={() => handleDelete(interview.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
      
                </div>
      
              </div>
      
            ))}
      
          </div>
      
        </div>
      );
}

export default DashboardPage;