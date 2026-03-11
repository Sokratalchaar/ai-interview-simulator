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
        <div>
            <h1>Dashboard</h1>

            <button onClick={()=>navigate("/start-interview")}>Start Interview</button>
            <h2>Your Previous Interviews</h2>
            {interviews.length===0 &&(
                <p>No interviews yet</p>
            )}

            {interviews.map(interview=> (
                <div key={interview.id}>
                    <p>Interview #{interview.id}</p>
                    <p>{new Date(interview.createdAt).toLocaleDateString()}</p>
                    <p>Score: {interview.score? `${interview.score} / 10` : "Not completed"}</p>
                    <button onClick={()=>navigate(`/interview/${interview.id}`)}>View Details</button>
                    <button onClick={()=>{
                        if(window.confirm("Delete this interview?")){
                            handleDelete(interview.id);
                          }
                     } }>Delete</button>

                    <hr/>
                </div>
            ))}

        </div>
    );
}
export default DashboardPage;