import { useState } from "react";

function Register() {
  const [user, setUser] = useState({ username: "", password: "" });

  const handleRegister = async () => {
    await fetch("http://localhost:8080/api/register", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(user)
    });

    alert("Registered successfully");
    window.location.href = "/";
  };

  return (
    <div>
      <h2>Register</h2>

      <input placeholder="Username"
        onChange={e => setUser({...user, username: e.target.value})}/>

      <input type="password" placeholder="Password"
        onChange={e => setUser({...user, password: e.target.value})}/>

      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;