import { useEffect, useState } from "react";

function Profile() {
  const [data, setData] = useState(null);
  const user = localStorage.getItem("user");

  useEffect(() => {
    if (!user) {
      window.location.href = "/";
      return;
    }

    fetch(`http://localhost:8080/api/profile/${user}`)
      .then(res => res.text())
      .then(text => {
        if (!text) return;
        const parsed = JSON.parse(text);
        console.log(parsed);
        setData(parsed);
      })
      .catch(err => console.error(err));

  }, [user]);

  return (
    <div>
      <h2>Profile Page</h2>

      {data ? (
        <p>Username: {data.username}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Profile;