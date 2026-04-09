import { Link } from "react-router-dom";
function Home() {
  const user = localStorage.getItem("user");

  // Protection
  if (!user) {
    window.location.href = "/";
  }

  return (
    <div>
      <h1>Welcome {user}</h1>

      <Link to="/profile">Go to Profile</Link>

      <button onClick={() => {
        localStorage.removeItem("user");
        window.location.href = "/";
      }}>
        Logout
      </button>
    </div>
  );
}

export default Home;