import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { startInterview } from "../services/interviewService";
import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";


function StartInterviewPage(){
  const { t, i18n } = useTranslation();

 const [role,setRole] = useState("");
 const [level,setLevel] = useState("");
 const [tech,setTech] = useState("");

 const navigate = useNavigate();


 const handleStart = async () => {

  try {

    localStorage.setItem("interviewConfig", JSON.stringify({
      role,
      level,
      tech
    }));

    const data = await startInterview({
      role,
      level,
      tech,
      language: i18n.language
    });

    navigate("/interview", {
      state: {
        questions: [data.question],
        sessionId: data.sessionId,
        role,
        level,
        tech
      
      }
    });

  } catch (error) {
    console.error(error);
  }

};

 return (
  <div className="min-h-screen bg-gray-50">

    <div className="max-w-5xl mx-auto px-6 py-16">

      <h1 className="text-4xl font-bold text-center mb-4">
        Start AI Interview
      </h1>

      <p className="text-gray-500 text-center mb-12">
        Generate a personalized technical interview based on your role and stack.
      </p>


      <div className="bg-white shadow-lg rounded-2xl p-10">

        <div className="grid md:grid-cols-2 gap-6">

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              {t("role")}
            </label>

            <input
              value={role}
              onChange={(e)=>setRole(e.target.value)}
              placeholder="Backend Developer"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>


          {/* Level */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              {t("level")}
            </label>

            <select
              value={level}
              onChange={(e)=>setLevel(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t("selectLevel")}</option>
              <option value="Junior">Junior</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
            </select>
          </div>


          {/* Tech Stack */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2">
              {t("techStack")}
            </label>

            <input
              value={tech}
              onChange={(e)=>setTech(e.target.value)}
              placeholder="Node.js, React, Java, SQL..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </div>


        <button
          onClick={handleStart}
          disabled={!role || !level || !tech}
          className="w-full mt-8 bg-blue-600 text-white py-3 rounded-lg text-lg hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {t("startInterview")}
        </button>

      </div>

    </div>

  </div>
);
}

export default StartInterviewPage;