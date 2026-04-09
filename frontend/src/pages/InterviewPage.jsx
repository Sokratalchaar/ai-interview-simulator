import { useEffect, useState, useRef } from "react";
import { startInterview,submitAnswer,evaluateAnswer,getInterviewScore,getMyInterviews,getNextQuestion } from "../services/interviewService";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { Mic, X, Check } from "lucide-react";
import WaveSurfer from "wavesurfer.js";
import MicrophonePlugin from "wavesurfer.js/dist/plugin/wavesurfer.microphone.min.js";
import { useTranslation } from "react-i18next";



function InterviewPage() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [interviewEnded,setInterviewEnded] = useState(false);
   
    const [currentIndex,setCurrentIndex] = useState(0);
    const [answer,setAnswer] = useState("");
    const [score, setScore] = useState(null);
    const [feedback, setFeedback] = useState("");
   
    const [finalScore,setFinalScore] = useState(null);
    const [loading,setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showEndModal,setShowEndModal] = useState(false);
    const [timeLeft,setTimeLeft] = useState(120);
    const [recording, setRecording] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const config = JSON.parse(localStorage.getItem("interviewConfig") || "{}");

    const {
      questions: stateQuestions,
      sessionId: stateSessionId,
      role: stateRole,
      level: stateLevel,
      tech: stateTech
    } = location.state || {};
    const initialQuestions = stateQuestions || [];
    const initialSessionId = stateSessionId;
    
    const role = stateRole || config.role;
    const level = stateLevel || config.level;
    const tech = stateTech || config.tech;
    const [questions,setQuestions] = useState(initialQuestions);
const [sessionId,setSessionId] = useState(initialSessionId);

const waveformRef = useRef(null);
const waveSurferRef = useRef(null);
const recognitionRef = useRef(null);
    useEffect(()=>{
        
                if(!initialSessionId){
                  navigate("/start-interview");
                }
          
     }, []);

     useEffect(()=>{

      if(submitted) return;
    
      const timer = setTimeout(()=>{
        setTimeLeft(prev=>prev - 1);
      },1000);
    
      return () => clearTimeout(timer);
    
    },[timeLeft,submitted]);

    


    const handleNextQuestion = async () => {
      try {
        setLoading(true);
    
        const currentQuestion = questions[currentIndex];
    
        const newQuestion = await getNextQuestion({
          sessionId,
          previousQuestion: currentQuestion.content,
          answer,
          score,
          questionCount: questions.length,
          role,
          level,
          tech,
          language: i18n.language
        });
    
        //if interview ended
        if (newQuestion?.done) {
          const result = await getInterviewScore(sessionId);
          setFinalScore(result.score);
          setInterviewEnded(true);
          localStorage.removeItem("insightsCache_week");
          localStorage.removeItem("insightsCache_month");
localStorage.setItem("forceInsightsRefresh", "true");


  navigate("/dashboard");



          return;
        }
    
        //if there is a new question
        if (newQuestion?.content) {
          setQuestions(prev => [...prev, newQuestion]);
          setCurrentIndex(prev => prev + 1);
    
          // reset state for new question
          setAnswer("");
          setScore(null);
          setFeedback("");
          setSubmitted(false);
          setTimeLeft(120);
        }
    
        // fallback 
        else {
          const result = await getInterviewScore(sessionId);
          setFinalScore(result.score);
          setInterviewEnded(true);
          localStorage.removeItem("interviewSession");
          localStorage.removeItem("insightsCache_week");
localStorage.removeItem("insightsCache_month");
localStorage.setItem("forceInsightsRefresh", "true");


  navigate("/dashboard");

        }
    
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
      setStartTime(Date.now());
    }, [currentIndex]);

     

     const handleSubmit = async () =>{
      if(submitted) return;
      try{
        setSubmitted(true);
        setLoading(true);
        const timeTaken = (Date.now() - startTime) / 1000;
        const questionId = questions[currentIndex].id;
        await submitAnswer(questionId,answer,timeTaken);
        const result = await evaluateAnswer(questionId,{
          language: i18n.language,
          timeTaken
        });
        
        setScore(result.score);
        setFeedback(result.feedback);
        setLoading(false);
        
      } catch (error) {

        console.error(error);
    
      }
     };


     const startRecording = async () => {

      setRecording(true);
    
      setTimeout(() => {
    
        if (!waveformRef.current) return;
    
        waveSurferRef.current = WaveSurfer.create({
          container: waveformRef.current,
          waveColor: "#94a3b8",
          interact: false,
          cursorWidth: 0,
          height: 40,
          barWidth: 3,
          barGap: 2,
          plugins: [
            MicrophonePlugin.create()
          ]
        });
    
        waveSurferRef.current.microphone.start();
    
      }, 100);
    
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
    
      if (!SpeechRecognition) {
        alert("Speech recognition not supported");
        return;
      }
    
      const recognition = new SpeechRecognition();
    
      recognition.continuous = true;
      recognition.lang =
      i18n.language === "ar"
        ? "ar-SA"
        : i18n.language === "fr"
        ? "fr-FR"
        : "en-US";
    
      recognition.onresult = (event) => {
    
        const transcript =
          event.results[event.results.length - 1][0].transcript;
    
        setAnswer(prev => prev + " " + transcript);
    
      };
    
      recognition.start();
    
      recognitionRef.current = recognition;
    };


    const stopRecording = () => {

      recognitionRef.current?.stop();
    
      waveSurferRef.current?.microphone?.stop();
    
      setRecording(false);
    
    };
   
    const cancelRecording = () => {

      recognitionRef.current?.stop();
    
      waveSurferRef.current?.microphone?.stop();
    
      waveSurferRef.current?.destroy();
    
      setRecording(false);
    
    };
     
    const formatText = (text) => {
      if (!text) return "";
    
      return text.replace(
        /<ltr>(.*?)<\/ltr>/g,
        '<span dir="ltr">$1</span>'
      );
    };

  
    
    

    return (
      <div className="min-h-screen bg-gray-50">
        
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
        
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">
            Interview Session
          </h1>
        
          <p className="text-center text-gray-500 mb-6 md:mb-8 text-sm md:text-base">
            {t("question")} {currentIndex + 1} / {questions.length}
          </p>
    
          {!submitted && (
            <div className="flex justify-center mb-4 md:mb-6">
    
              <CountdownCircleTimer
                key={currentIndex}
                isPlaying={!submitted}
                duration={120}
                colors={["#dc2626", "#eab308", "#16a34a"]}
                colorsTime={[20, 60, 120]}
                size={80}
                strokeWidth={8}
                onComplete={() => {
                  handleNextQuestion();
                }}
              >
                {({ remainingTime }) => {
                  const minutes = Math.floor(remainingTime / 60);
                  const seconds = remainingTime % 60;
                  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
                }}
              </CountdownCircleTimer>
    
            </div>
          )}
        
        
          {/* progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-8 md:mb-10">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`
              }}
            />
          </div>
        
        
          {/* question */}
          <div className="bg-white shadow-sm border rounded-xl p-4 md:p-6 mb-6">
        
            <p className="text-sm text-gray-500 mb-2">
              {t("aiQuestion")}
            </p>
        
            <h3
              dir={i18n.language === "ar" ? "rtl" : "ltr"}
              className="text-lg md:text-xl font-semibold leading-relaxed"
            >
              {questions[currentIndex]?.content}
            </h3>
        
          </div>
        
          <div className="relative w-full">
    
            <textarea
              rows="3"
              value={answer}
              placeholder="Write your answer..."
              onChange={(e)=>setAnswer(e.target.value)}
              onPaste={(e)=>e.preventDefault()}
              onCopy={(e)=>e.preventDefault()}
              onCut={(e)=>e.preventDefault()}
              onContextMenu={(e)=>e.preventDefault()}
              className="w-full border border-gray-300 rounded-2xl p-3 md:p-4 pr-24 md:pr-28 text-sm md:text-base resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
    
            {/* waveform */}
            {recording && (
              <div
                ref={waveformRef}
                className="absolute left-3 md:left-4 right-20 md:right-28 bottom-3 h-6"
              />
            )}
    
            {/* mic button */}
            {!recording && (
              <button
                onClick={startRecording}
                className="absolute right-3 md:right-4 bottom-3 text-gray-500 hover:text-black"
              >
                <Mic size={20}/>
              </button>
            )}
    
            {/* cancel */}
            {recording && (
              <button
                onClick={cancelRecording}
                className="absolute right-12 md:right-14 bottom-3 text-gray-500"
              >
                <X size={18}/>
              </button>
            )}
    
            {/* stop */}
            {recording && (
              <button
                onClick={stopRecording}
                className="absolute right-3 md:right-4 bottom-3 text-green-600"
              >
                <Check size={18}/>
              </button>
            )}
    
          </div>
    
        
          {/* buttons */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 mt-6">
        
            <button
              disabled={!answer.trim()}
              onClick={handleSubmit}
              className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {t("submitAnswer")}
            </button>
        
            <button
              onClick={()=>setShowEndModal(true)}
              className="w-full md:w-auto bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
            >
              {t("endInterview")}
            </button>
        
          </div>
        
        
          {loading && (
            <p className="mt-6 text-gray-500 text-sm md:text-base">
              {t("evaluatingAnswer")}
            </p>
          )}
        
        
          {score && (
            <div className="mt-8 bg-gray-100 p-4 md:p-6 rounded-xl">
    
              <h3
                dir="auto"
                className="text-gray-800 mb-4 md:mb-6 leading-relaxed unicode-fix"
              >
                <span className="font-bold">{t("score")}:</span>{" "}
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {score} / 10
                </span>
              </h3>
    
              <p dir="auto" className="text-gray-700 mb-2">
                <span className="font-bold">{t("feedback")}:</span>
              </p>
    
              <div
                dir="auto"
                className="text-gray-700 leading-relaxed unicode-fix text-sm md:text-base"
                dangerouslySetInnerHTML={{ __html: formatText(feedback) }}
              />
    
            </div>
          )}
        
        
          {score!==null && !interviewEnded && (
            <button
              onClick={handleNextQuestion}
              className="mt-6 w-full md:w-auto bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              {t("nextQuestion")}
            </button>
          )}
        
        
          {interviewEnded &&(
            <div className="mt-10 text-center">
    
              <h3 className="text-xl md:text-2xl font-semibold mb-2">
                {t("interviewFinished")} 🎉
              </h3>
    
              <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-4">
                {t("finalScore")}: {finalScore}/10
              </h2>
    
              <button
                onClick={() => navigate("/dashboard",{replace:true})}
                className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                {t("gotoDashboard")}
              </button>
    
            </div>
          )}
    
        </div>
    
    
        {/* END INTERVIEW MODAL */}
        {showEndModal && (
    
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
    
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
    
              <h2 className="text-xl font-semibold mb-3">
                {t("endInterview")}
              </h2>
    
              <p className="text-gray-600 mb-6">
                {t("confirmEndInterview")}
              </p>
    
              <div className="flex flex-col md:flex-row justify-end gap-3">
    
                <button
                  onClick={()=>setShowEndModal(false)}
                  className="w-full md:w-auto px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  {t("cancel")}
                </button>
    
                <button
                  onClick={async ()=>{
    
                    await getInterviewScore(sessionId);
    
                    localStorage.removeItem("interviewSession");
                    Object.keys(localStorage).forEach((key) => {
                      if (key.startsWith("insightsCache_")) {
                        localStorage.removeItem(key);
                      }
                    });
    
                    setShowEndModal(false);
    
                    navigate("/dashboard",{replace:true});
    
                  }}
                  className="w-full md:w-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  {t("endInterview")}
                </button>
    
              </div>
    
            </div>
    
          </div>
    
        )}
    
      </div>
    );
  }
  
  export default InterviewPage;