import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./Components/Dashboard";
import LocalUserList from "./Components/LocalUserList";
import UserList from "./Components/UserList";
import FakePostList from "./Components/FakePostList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/local" element={<LocalUserList />} />
        <Route path="/api" element={<UserList />} />
        <Route path="/posts" element={<FakePostList />} />
      </Routes>
    </Router>
  );
}

export default App;