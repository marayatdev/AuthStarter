import { useAuth } from "../../contexts/Auth/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      Dashboard
      <p>
        Welcome, {user.username} {user.role}!
      </p>
      {user.email && <p>Email: {user.email}</p>}
      {user.imageProfile && (
        <img
          src={`http://localhost:3000/api/media/${user.imageProfile}`}
          alt="Profile"
        />
      )}
    </div>
  );
}

export default Dashboard;
