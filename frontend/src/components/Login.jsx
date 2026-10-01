import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.post(
        BASE_URL + "/login",
        { email, password },
        { withCredentials: true }
      );
      console.log(res.data.user);
    } catch (err) {
      setError(err.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex justify-center items-center px-4">
      <div className="card bg-base-100 border border-base-300 w-full max-w-sm">
        <div className="card-body">
          <h1 className="font-display text-3xl font-extrabold">Welcome back</h1>
          <p className="text-sm opacity-70 mb-2">
            Log in to see developers near your stack.
          </p>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email</legend>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input w-full"
              placeholder="name@company.com"
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Password</legend>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input w-full"
              placeholder="Enter your password"
            />
          </fieldset>

          {error && <p className="text-error text-sm">{error}</p>}

          <button
            className="btn btn-primary mt-3"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Log in"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;