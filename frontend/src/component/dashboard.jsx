import React from "react";
import Cookies from "js-cookie";
import Lobby from "../screens/lobby";

function Dashboard() {
  const user = JSON.parse(Cookies.get("user") || "{}");
  return (
    <div className="dashboard">
      <Lobby obj={user} />
    </div>
  );
}

export default Dashboard;
