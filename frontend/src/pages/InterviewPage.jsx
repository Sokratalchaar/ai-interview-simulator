import { useEffect, useState } from "react";
import { startInterview,submitAnswer,evaluateAnswer,getInterviewScore,getMyInterviews } from "../services/interviewService";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";


function InterviewPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [interviewEnded,setInterviewEnded] = useState(false);
    const { questions: initialQuestions,sessionId: initialSessionId } = location.state || {};
    const [questions,setQuestions]=useState(initialQuestions || []);
    const [currentIndex,setCurrentIndex] = useState(0);
    const [answer,setAnswer] = useState("");
    const [score, setScore] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [sessionId,setSessionId] = useState(initialSessionId || null);
    const [finalScore,setFinalScore] = useState(null);
    const [loading,setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showEndModal,setShowEndModal] = useState(false);
    useEffect(()=>{
        
                if(!initialSessionId){
                  navigate("/start-interview");
                }
          
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
          localStorage.removeItem("interviewSession");

        }
      } catch (error) {

        console.error(error);
    
      }
     };

     return (
      <div className="min-h-screen bg-gray-50">
    
        <div className="max-w-5xl mx-auto px-6 py-12">
    
          <h1 className="text-3xl font-bold text-center mb-2">
            Interview Session
          </h1>
    
          <p className="text-center text-gray-500 mb-8">
            Question {currentIndex + 1} / {questions.length}
          </p>
    
    
          {/* progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-10">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`
              }}
            />
          </div>
    
    
          {/* question */}
          <div className="bg-white shadow-sm border rounded-xl p-6 mb-6">
    
            <p className="text-sm text-gray-500 mb-2">
              AI Question
            </p>
    
            <h3 className="text-xl font-semibold leading-relaxed">
              {questions[currentIndex]?.content}
            </h3>
    
          </div>
    
    
          {/* answer */}
          <textarea
            rows="8"
            value={answer}
            placeholder="Write your answer here..."
            onChange={(e)=>setAnswer(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
    
    
          {/* buttons */}
          <div className="flex gap-4 mt-6">
    
            <button
              disabled={!answer.trim()}
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              Submit Answer
            </button>
    
            <button
              onClick={()=>setShowEndModal(true)}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
            >
              End Interview
            </button>
    
          </div>
    
    
          {loading && (
            <p className="mt-6 text-gray-500">
              Evaluating your answer...
            </p>
          )}
    
    
          {score && (
            <div className="mt-8 bg-gray-100 p-6 rounded-xl">
    
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
              className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Next Question
            </button>
          )}
    
    
          {(interviewEnded || (score && currentIndex === questions.length - 1)) && (
    
            <div className="mt-10 text-center">
    
              <h3 className="text-2xl font-semibold mb-2">
                Interview Finished 🎉
              </h3>
    
              <h2 className="text-3xl font-bold text-blue-600 mb-4">
                Final Score: {finalScore}/10
              </h2>
    
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Go to Dashboard
              </button>
    
            </div>
    
          )}
    
        </div>
    
    
        {/* END INTERVIEW MODAL */}
        {showEndModal && (
    
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
    
              <h2 className="text-xl font-semibold mb-3">
                End Interview
              </h2>
    
              <p className="text-gray-600 mb-6">
                Are you sure you want to end the interview?
              </p>
    
              <div className="flex justify-end gap-3">
    
                <button
                  onClick={()=>setShowEndModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
    
                <button
                  onClick={async ()=>{
    
                    await getInterviewScore(sessionId);

                    localStorage.removeItem("interviewSession");
    
                    setShowEndModal(false);
    
                    navigate("/dashboard");
    
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  End Interview
                </button>
    
              </div>
    
            </div>
    
          </div>
    
        )}
    
      </div>
    );
  }
  
  export default InterviewPage;