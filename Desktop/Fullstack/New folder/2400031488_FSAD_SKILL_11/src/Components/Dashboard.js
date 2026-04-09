import React from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      <ul>
        <li>
          <Link to="/local">Local Users</Link>
        </li>
        <li>
          <Link to="/api">Users API</Link>
        </li>
        <li>
          <Link to="/posts">Fake API Posts</Link>
        </li>
      </ul>
    </div>
  );
}

export default Dashboard;