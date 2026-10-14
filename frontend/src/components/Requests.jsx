import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { showToast } from "../utils/toastSlice";
import { avatarVariant, sharedSkills } from "../utils/helpers.js";
import Avatar from "./Avatar.jsx";

const Requests = () => {
  const me = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const mySkills = me?.skills || [];

  useEffect(() => {
    const getRequests = async () => {
      try {
        const res = await axios.get(BASE_URL + "/user/requests/received", {
          withCredentials: true,
        });
        setRequests(res.data.data.filter((r) => r.senderId));
      } catch (err) {
        dispatch(
          showToast({ message: "Could not load requests", type: "error" })
        );
      } finally {
        setLoading(false);
      }
    };
    getRequests();
  }, []);

  const reviewRequest = async (request, status) => {
    if (busyId) return;
    try {
      setBusyId(request._id);
      await axios.post(
        `${BASE_URL}/request/review/${status}/${request._id}`,
        {},
        { withCredentials: true }
      );
      setRequests((prev) => prev.filter((r) => r._id !== request._id));
      dispatch(
        showToast({
          message:
            status === "accepted"
              ? `You are now connected with ${request.senderId.firstname}`
              : `Request from ${request.senderId.firstname} rejected`,
          type: "success",
        })
      );
    } catch (err) {
      dispatch(
        showToast({
          message: err.response?.data?.message || "Something went wrong",
          type: "error",
        })
      );
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-base-200 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-extrabold">
          Connection requests
        </h1>
        <p className="mb-6 text-sm opacity-70">
          Developers who showed interest in you.
        </p>

        {requests.length === 0 ? (
          <div className="card border border-base-300 bg-base-100 p-10 text-center">
            <h2 className="font-display text-2xl font-extrabold">
              No pending requests
            </h2>
            <p className="mb-4 opacity-70">
              Keep exploring the orbit to meet more developers.
            </p>
            <Link to="/feed" className="btn btn-primary mx-auto rounded-full">
              Open the feed
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {requests.map((request) => {
              const sender = request.senderId;
              const skills = sender.skills || [];
              const shared = sharedSkills(mySkills, skills);
              const busy = busyId === request._id;

              return (
                <li
                  key={request._id}
                  className="card flex-row flex-wrap items-center gap-4 border border-base-300 bg-base-100 p-4"
                >
                  <Avatar
                    variant={avatarVariant(sender.firstname)}
                    className="h-14 w-14 shrink-0"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg font-extrabold">
                      {sender.firstname} {sender.lastname}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {skills.length === 0 && (
                        <span className="text-xs opacity-60">
                          No skills added yet
                        </span>
                      )}
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className={`badge badge-sm ${
                            shared.includes(skill)
                              ? "badge-primary"
                              : "badge-outline"
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="btn btn-outline btn-sm rounded-full"
                      onClick={() => reviewRequest(request, "rejected")}
                      disabled={busy}
                    >
                      Reject
                    </button>
                    <button
                      className="btn btn-primary btn-sm rounded-full"
                      onClick={() => reviewRequest(request, "accepted")}
                      disabled={busy}
                    >
                      {busy ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        "Accept"
                      )}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Requests;