import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { showToast } from "../utils/toastSlice";
import Avatar from "./Avatar.jsx";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const variant = ((user?.firstname?.charCodeAt(0) || 0) % 5) + 1;

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      dispatch(showToast({ message: "You have been logged out", type: "success" }));
      navigate("/login");
    } catch (err) {
      dispatch(showToast({ message: "Logout failed, try again", type: "error" }));
    }
  };

  return (
    <div className="sticky top-3 z-20 px-3 pt-3">
      <nav className="mx-auto max-w-5xl flex items-center justify-between rounded-full border border-base-300 bg-white/80 backdrop-blur-md pl-5 pr-2 py-2 shadow-lg">
        <Link to="/feed" className="flex items-center gap-2 font-display text-xl font-extrabold">
          <svg viewBox="0 0 28 28" className="w-6 h-6" aria-hidden="true">
            <circle cx="14" cy="14" r="12" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="14" cy="14" r="4.5" className="fill-primary" />
            <g className="logo-dot">
              <circle cx="23" cy="8" r="2.6" className="fill-secondary" />
            </g>
          </svg>
          DevSphere
        </Link>

        {user && (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="flex items-center gap-2 rounded-full pl-3 pr-1 py-1 cursor-pointer hover:bg-base-200 transition-colors"
            >
              <span className="hidden sm:inline text-sm">Hi, {user.firstname}</span>
              <Avatar variant={variant} className="w-9 h-9" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-30 mt-3 w-48 border border-base-300 p-2 shadow-lg"
            >
              <li><Link to="/feed">Feed</Link></li>
              <li><button onClick={handleLogout}>Log out</button></li>
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
};

export default NavBar;