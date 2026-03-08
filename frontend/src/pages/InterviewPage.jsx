import { useEffect, useState } from "react";
import { startInterview,submitAnswer,evaluateAnswer } from "../services/interviewService";

function InterviewPage() {
    const [question,setQuestion]=useState(null);
    const [answer,setAnswer] = useState("");
    const [score, setScore] = useState(null);
    const [feedback, setFeedback] = useState("");
    useEffect(()=>{
        const fetchQuestion = async()=>{
            try{
                const data = await startInterview();
                console.log(data);
                setQuestion(data.questions[0]);
            } catch (error) {

                console.error(error);
        
              }
        };
        fetchQuestion();
     }, []);
     const handleSubmit = async () =>{
      try{
        await submitAnswer(question.id,answer);
        const result = await evaluateAnswer(question.id);
        
        setScore(result.score);
        setFeedback(result.feedback);
      } catch (error) {

        console.error(error);
    
      }
     };

    return (
      <div>
  
        <h1>Interview Session</h1>
  
        <h3>{question?.content}</h3>
        <textarea
        rows="6"
        cols="60"
        placeholder="Write your answer here"
        onChange={(e)=>setAnswer(e.target.value)}
        />
        <br/><br/>

        <button onClick={handleSubmit}>Submit Answer</button>

        {score && (
         <div>
         <h3>Score: {score} / 10</h3>
         <p>{feedback}</p>
         </div>
        )}
  
      </div>
    );
  }
  
  export default InterviewPage;