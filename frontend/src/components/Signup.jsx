import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { showToast } from "../utils/toastSlice";

const rules = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One number", test: (p) => /[0-9]/.test(p) },
  { label: "One symbol (like @ or #)", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const Signup = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

    const handleSignup = async () => {
    if (firstname.trim().length < 3) {
      setError("First name must be at least 3 characters");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstname, lastname, email, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.user));
      dispatch(
        showToast({ message: "Account created. Welcome to DevSphere!", type: "success" })
      );
      navigate("/feed");
    } catch (err) {
      setError(err.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex justify-center items-center px-4 py-10">
      <div className="card bg-base-100 border border-base-300 w-full max-w-md">
        <div className="card-body">
          <h1 className="font-display text-3xl font-extrabold">Create your account</h1>
          <p className="text-sm opacity-70 mb-2">
            Join DevSphere and meet developers who share your stack.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">First name</legend>
              <input
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                className="input w-full"
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Last name</legend>
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className="input w-full"
              />
            </fieldset>
          </div>

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
              placeholder="Create a strong password"
            />
          </fieldset>

          {password && (
            <ul className="text-sm space-y-1">
              {rules.map((r) => (
                <li
                  key={r.label}
                  className={`transition-colors ${
                    r.test(password) ? "text-success" : "opacity-60"
                  }`}
                >
                  {r.test(password) ? "✓" : "○"} {r.label}
                </li>
              ))}
            </ul>
          )}

          {error && <p className="text-error text-sm">{error}</p>}

          <button
            className="btn btn-primary mt-3"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Sign up"
            )}
          </button>

          <p className="text-center text-sm mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;