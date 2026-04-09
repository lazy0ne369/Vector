import { useState } from "react";

function Login() {
  const [user, setUser] = useState({ username: "", password: "" });

  const handleLogin = async () => {
    const res = await fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(user)
    });

    const text = await res.text();

if (!text) {
  alert("Invalid credentials");
  return;
}

const data = JSON.parse(text);

if (data.username) {
  localStorage.setItem("user", data.username);
  window.location.href = "/home";
} else {
  alert("Invalid credentials");
}

    if (data) {
      localStorage.setItem("user", data.username);
      window.location.href = "/home";
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Username"
        onChange={e => setUser({...user, username: e.target.value})}/>
      <input type="password" placeholder="Password"
        onChange={e => setUser({...user, password: e.target.value})}/>
      <button onClick={handleLogin}>Login</button>
      <br/>
      <a href="/register">Go to Register</a>
    </div>
  );
}

export default Login;