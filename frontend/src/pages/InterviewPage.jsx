import { useEffect, useState } from "react";
import { startInterview,submitAnswer,evaluateAnswer,getInterviewScore,getMyInterviews } from "../services/interviewService";
import { useLocation } from "react-router-dom";


function InterviewPage() {
    const location = useLocation();
    const { role, level, tech } = location.state || {};
    const [questions,setQuestions]=useState([]);
    const [currentIndex,setCurrentIndex] = useState(0);
    const [answer,setAnswer] = useState("");
    const [score, setScore] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [sessionId,setSessionId] = useState(null);
    const [finalScore,setFinalScore] = useState(null);
    const [loading,setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    useEffect(()=>{
        const fetchQuestion = async()=>{
            try{
                const data = await startInterview({role,level,tech});
                console.log(data);
                setQuestions(data.questions);
                setSessionId(data.id);
            } catch (error) {

                console.error(error);
        
              }
        };
        fetchQuestion();
     }, []);
     const handleSubmit = async () =>{
      if(submitted) return;
      try{
        setSubmitted(true);
        setLoading(true);
        const questionId = questions[currentIndex].id;
        await submitAnswer(questionId,answer);
        const result = await evaluateAnswer(questionId);
        
        setScore(result.score);
        setFeedback(result.feedback);
        setLoading(false);
        if(currentIndex===questions.length-1){
          const interviewResult = await getInterviewScore(sessionId);
          setFinalScore(interviewResult.score);

        }
      } catch (error) {

        console.error(error);
    
      }
     };

    return (
      <div>
  
        <h1>Interview Session</h1>
        <p>Question {currentIndex + 1} / {questions.length}</p>
  
        <h3>{questions[currentIndex]?.content}</h3>
        <textarea
        rows="6"
        cols="60"
        value={answer}
        placeholder="Write your answer here"
        onChange={(e)=>setAnswer(e.target.value)}
        />
        <br/><br/>

        <button disabled={!answer.trim()} onClick={handleSubmit}>Submit Answer</button>
        {loading && <p>Evaluating your answer...</p>}
        
        {score && (
        <div>
        <h3>Score: {score} / 10</h3>
        <p>{feedback}</p>
        </div>
        )}

        {score && currentIndex < questions.length - 1 && (
        <button onClick={() => {
         setCurrentIndex(currentIndex + 1);
         setAnswer("");
         setScore(null);
         setFeedback("");
         setSubmitted(false);
          }}>
        Next Question
       </button>
        )}
        {score && currentIndex === questions.length - 1 && (
        <div>
        <h3>Interview Finished 🎉</h3>
        <h2>Final Score: {finalScore}/10</h2>
        </div>
        )}
  
      </div>
    );
  }
  
  export default InterviewPage;