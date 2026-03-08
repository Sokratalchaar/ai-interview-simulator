import { useNavigate } from "react-router-dom";

function DashboardPage() {
    const navigate = useNavigate();
    return(
        <div>
            <h1>Dashboard</h1>

            <button onClick={()=>navigate("/interview")}>Start Interview</button>
        </div>
    );
}
export default DashboardPage;