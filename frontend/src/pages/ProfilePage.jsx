import { useEffect, useState } from "react";
import { getMyInterviews } from "../services/interviewService";

function ProfilePage() {

  const [interviews,setInterviews] = useState([]);

  useEffect(()=>{

    const fetchData = async () => {
      try{

        const data = await getMyInterviews();
        setInterviews(data);

      }catch(error){
        console.error(error);
      }
    };

    fetchData();

  },[]);

  const completed = interviews.filter(i => i.score != null);

  const avgScore =
    completed.length > 0
      ? (
          completed.reduce((sum,i)=> sum + Number(i.score),0) /
          completed.length
        ).toFixed(1)
      : "-";

  const bestScore =
    completed.length > 0
      ? Math.max(...completed.map(i => i.score))
      : "-";

  return (

    <div className="max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-8">

        <h2 className="text-xl font-semibold mb-2">User Info</h2>

        <p className="text-gray-600">
          Email: {localStorage.getItem("email") || "User"}
        </p>

      </div>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white shadow rounded-lg p-5">
          <p className="text-gray-500">Total Interviews</p>
          <h2 className="text-2xl font-bold">{interviews.length}</h2>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <p className="text-gray-500">Average Score</p>
          <h2 className="text-2xl font-bold">{avgScore}</h2>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <p className="text-gray-500">Best Score</p>
          <h2 className="text-2xl font-bold">{bestScore}</h2>
        </div>

      </div>

    </div>
  );
}

export default ProfilePage;