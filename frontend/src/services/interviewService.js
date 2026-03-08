import axios from "axios";


const API = "http://localhost:5000/api/interview";

export const startInterview = async ()=>{
    const token = localStorage.getItem("token");

    const response = await axios.post(`${API}/start`,{},
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

export const evaluateAnswer = async(questionId)=>{
    const token = localStorage.getItem("token");
    const response = await axios.post(
        `${API}/question/${questionId}/evaluate`,
        {},
        {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
    );
    return response.data;
}