import React, { useEffect } from "react";
import Cookies from "js-cookie";
import Lobby from "../screens/lobby";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : null;
  useEffect(() => {
    if (!user) {
      navigate("/user");
    }
  }, [navigate, user]);

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard">
      <Lobby obj={user} />
    </div>
  );
}

export default Dashboard;
