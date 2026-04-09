import axios from "axios";


const API = "https://ai-interview-backend-ehir.onrender.com/api/interview";

export const startInterview = async (data)=>{
    const token = localStorage.getItem("token");

    const response = await axios.post(`${API}/start`,data,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data;
};

export const submitAnswer = async(questionId,answer)=>{
    const token = localStorage.getItem("token");

    const response = await axios.post(`${API}/question/${questionId}/answer`,
        {
            content: answer
        },
        {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data;
}

export const evaluateAnswer = async(questionId,data)=>{
    const token = localStorage.getItem("token");
    const response = await axios.post(
        `${API}/question/${questionId}/evaluate`,
        data,
        {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
    );
    return response.data;
}

export const getInterviewScore = async(sessionId)=>{
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API}/${sessionId}/score`,
        {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }

    );
    return response.data;
};

export const getMyInterviews = async()=>{
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API}/my`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
    return response.data;
};

export const getInterviewDetails = async(id)=>{
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API}/${id}`,{
        headers:{
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const deleteInterview = async (id)=>{
    const token = localStorage.getItem("token");
  
    const res = await axios.delete(
      `${API}/${id}`,
      {
        headers:{ Authorization:`Bearer ${token}` }
      }
    );
  
    return res.data;
  };

  export const getNextQuestion = async (data) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(`${API}/next-question`, data,
        {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
    );
    return res.data;
  };

  export const getDashboardStats = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API}/stats`,
        {
            headers: {
                Authorization: `Bearer ${token}`
              }
    });
    return res.data;
  };

  let isFetchingInsights = false; // 🔥 global lock

export const getAIInsights = async (range) => {
  if (isFetchingInsights) {
    console.log("🛑 SKIP DUPLICATE CALL");
    return null; // ❌ تجاهل الطلب الثاني
  }

  isFetchingInsights = true;

  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `${API}/insights`,
      {
        params: { range },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;

  } catch (error) {
    console.error(error);
    return null;

  } finally {
    isFetchingInsights = false; // 🔥 unlock
  }
};
  export const translateInsights = async (insights, language) => {
    const token = localStorage.getItem("token");
  
    const res = await axios.post(
      `${API}/translate-insights`,
      { insights, language },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  
    return res.data;
  };

  export const translateInterview = async (data, language) => {
    const token = localStorage.getItem("token");
  
    const res = await axios.post(
      `${API}/translate`,
      { data, language },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  
    return res.data;
  };