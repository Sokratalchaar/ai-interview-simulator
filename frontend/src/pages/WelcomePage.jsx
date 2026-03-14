import { useNavigate } from "react-router-dom";

function WelcomePage(){

const navigate = useNavigate();

return(

<div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">

<div className="max-w-5xl w-full text-center">

<h1 className="text-4xl font-bold mb-4">
Welcome to AI Interview 👋
</h1>

<p className="text-gray-600 text-lg mb-10">
Practice technical interviews powered by AI and improve your skills.
</p>

<div className="flex justify-center gap-4 mb-16">

<button
onClick={()=>navigate("/start-interview")}
className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700"
>
Start Interview
</button>

<button
onClick={()=>navigate("/dashboard")}
className="bg-gray-200 px-8 py-3 rounded-lg text-lg hover:bg-gray-300"
>
Go to Dashboard
</button>

</div>

<div className="grid md:grid-cols-3 gap-8 text-left">

<div className="bg-white p-6 rounded-xl shadow transition transform hover:scale-105 hover:shadow-xl duration-300">
<h3 className="font-semibold text-lg mb-2">
🤖 AI Questions
</h3>
<p className="text-gray-600">
Generate technical interview questions tailored to your role and level.
</p>
</div>

<div className="bg-white p-6 rounded-xl shadow transition transform hover:scale-105 hover:shadow-xl duration-300">
<h3 className="font-semibold text-lg mb-2">
⚡ Instant Feedback
</h3>
<p className="text-gray-600">
Get AI evaluation and feedback for every answer you write.
</p>
</div>

<div className="bg-white p-6 rounded-xl shadow transition transform hover:scale-105 hover:shadow-xl duration-300">
<h3 className="font-semibold text-lg mb-2">
📊 Track Progress
</h3>
<p className="text-gray-600">
View your interview history and monitor your improvement.
</p>
</div>

</div>

</div>

</div>

);

}

export default WelcomePage;