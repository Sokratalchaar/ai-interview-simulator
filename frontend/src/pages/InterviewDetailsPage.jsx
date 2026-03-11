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
        <div>
            <h1>Interview #{interview.id}</h1>
            {interview.questions.map((q,index)=>(
                <div key={q.id} >
                    <h3>Question {index+1}</h3>
                    <p>{q.content}</p>
                    <p><b>Your answer: </b>{q.answer?.content}</p>
                    <p><b>Score: </b>{q.answer?.score}</p>
                    <p><b>Feedback: </b> {q.answer?.feedback}</p>
                    <hr/>
                </div>
            ))}

        </div>
    );
}
export default InterviewDetailsPage;