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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
    
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl">
    
          <h1 className="text-2xl font-bold mb-2 text-center">
            Interview Session
          </h1>
    
          <p className="text-center text-gray-500 mb-6">
            Question {currentIndex + 1} / {questions.length}
          </p>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
               className="bg-blue-600 h-2 rounded-full"
               style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
          </div>
    
          <div className="mb-6">
            <h3 className="text-lg font-semibold">
              {questions[currentIndex]?.content}
            </h3>
          </div>
    
          <textarea
            rows="6"
            value={answer}
            placeholder="Write your answer here..."
            onChange={(e)=>setAnswer(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
    
          <div className="mt-4">
    
            <button
              disabled={!answer.trim()}
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              Submit Answer
            </button>
    
          </div>
    
          {loading && (
            <p className="mt-4 text-gray-500">
              Evaluating your answer...
            </p>
          )}
    
          {score && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
    
              <h3 className="font-semibold mb-2">
                Score: {score} / 10
              </h3>
    
              <p className="text-gray-700">
                {feedback}
              </p>
    
            </div>
          )}
    
          {score && currentIndex < questions.length - 1 && (
            <button
              onClick={() => {
                setCurrentIndex(currentIndex + 1);
                setAnswer("");
                setScore(null);
                setFeedback("");
                setSubmitted(false);
              }}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Next Question
            </button>
          )}
    
          {score && currentIndex === questions.length - 1 && (
            <div className="mt-6 text-center">
    
              <h3 className="text-xl font-semibold mb-2">
                Interview Finished 🎉
              </h3>
    
              <h2 className="text-2xl font-bold text-blue-600">
                Final Score: {finalScore}/10
              </h2>
    
            </div>
          )}
    
        </div>
    
      </div>
    );
  }
  
  export default InterviewPage;