import axiosInstance from "../axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Register = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Added for password confirmation
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Send registration data to backend
      await axiosInstance.post("/register", { username, password });

      // Optionally, log in the user automatically after registration
      const loginResponse = await axiosInstance.post("/login", { username, password });
      const { token } = loginResponse.data;
      localStorage.setItem("authToken", token);

      // Fetch user data and set user state
      const { data } = await axiosInstance.get("/protected");
      setUser(data.user);

      // Redirect to home page
      navigate("/home");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 409) {
        setError("User already exists");
      } else {
        setError("Error registering user");
      }
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="hero bg-base-200 min-h-screen flex justify-center relative">
      <div className="hero-content flex-col">
        <div className="card bg-base-100 w-96 shadow-2xl">
          <h1 className="ml-8 mt-8 text-3xl font-bold">Register now!</h1>
          <form className="card-body" onSubmit={handleRegister}>
            <div className="form-control">
              <label className="label">
                <span className="label-name">Username</span>
              </label>
              <input
                className="input input-bordered"
                type="text"
                placeholder="Username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-name">Password</span>
              </label>
              <input
                className="input input-bordered"
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-name">Confirm Password</span>
              </label>
              <input
                className="input input-bordered"
                type="password"
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary" type="submit">Register</button>
            </div>
          </form>
        </div>
      </div>

      {error && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 w-11/12 max-w-2xl">
          <div className="alert alert-error shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
