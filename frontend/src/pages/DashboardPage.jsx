import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMyInterviews,deleteInterview } from "../services/interviewService";
import { useTranslation } from "react-i18next";



function DashboardPage() {
   const {t} = useTranslation();
    const navigate = useNavigate();
    const [showDeleteModal,setShowDeleteModal] = useState(false);
    const [selectedInterview,setSelectedInterview] = useState(null);
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
      
          <h1 className="text-3xl font-bold mb-6">{t("dashboard")}</h1>
      
          {/* Start Interview */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/start-interview")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              {t("startInterview")}
            </button>
          </div>
      
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-10">
      
            <div className="bg-white shadow rounded-lg p-5">
              <p className="text-gray-500">{t("totalInterviews")}</p>
              <h2 className="text-2xl font-bold">{interviews.length}</h2>
            </div>
      
            <div className="bg-white shadow rounded-lg p-5">
              <p className="text-gray-500">{t("completed")}</p>
              <h2 className="text-2xl font-bold">
                {interviews.filter(i => i.score !== null).length}
              </h2>
            </div>
      
            <div className="bg-white shadow rounded-lg p-5">
              <p className="text-gray-500">{t("averageScore")}</p>
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
          <h2 className="text-xl font-semibold mb-4">{t("previousInterviews")}</h2>
      
          <div className="space-y-4">
      
            {interviews.map((interview,index) => (
             
              <div
                key={interview.id}
                className="bg-white shadow rounded-lg p-5 flex justify-between items-center"
              >
      
                <div>
                  <h3 className="font-semibold">{t("interview")} #{interviews.length - index}</h3>
                  <p className="text-gray-500">
                    {new Date(interview.createdAt).toLocaleDateString()}
                  </p>
      
                  <p className="mt-1">
                    {t("score")}:{" "}
                    {interview.score !== null
                      ? `${interview.score} / 10`
                      : t("notCompleted")}
                  </p>
                </div>
      
                <div className="flex gap-3">
      
                  <button
                    onClick={() => navigate(`/interview/${interview.id}`,{
                    state:{interviewNumber: interviews.length - index}
                    })}
                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                  >
                    {t("viewDetails")}
                  </button>
      
                  <button
                    onClick={() => {
                      setSelectedInterview(interview.id);
                      setShowDeleteModal(true);
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    {t("delete")}
                  </button>
      
                </div>
      
              </div>
      
            ))}
      
          </div>
      
      
          {/* DELETE MODAL */}
          {showDeleteModal && (
      
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      
              <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
      
                <h2 className="text-xl font-semibold mb-3">
                  {t("deleteInterview")}
                </h2>
      
                <p className="text-gray-600 mb-6">
                  {t("confirmEndInterview")}
                </p>
      
                <div className="flex justify-end gap-3">
      
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    {t("cancel")}
                  </button>
      
                  <button
                    onClick={() => {
                      handleDelete(selectedInterview);
                      setShowDeleteModal(false);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    {t("delete")}
                  </button>
      
                </div>
      
              </div>
      
            </div>
      
          )}
      
        </div>
      );
}

export default DashboardPage;