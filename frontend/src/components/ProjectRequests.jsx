import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { showToast } from "../utils/toastSlice";
import { avatarVariant, sharedSkills } from "../utils/helpers.js";
import Avatar from "./Avatar.jsx";

const ProjectRequests = () => {
  const dispatch = useDispatch();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const res = await axios.get(BASE_URL + "/project/requests/received", {
          withCredentials: true,
        });
        setRequests(res.data.data.filter((r) => r.userId && r.projectId));
      } catch (err) {
        dispatch(
          showToast({ message: "Could not load requests", type: "error" })
        );
      } finally {
        setLoading(false);
      }
    };
    loadRequests();
  }, []);

  const review = async (request, status) => {
    if (busyId) return;
    try {
      setBusyId(request._id);
      await axios.post(
        `${BASE_URL}/project/request/review/${status}/${request._id}`,
        {},
        { withCredentials: true }
      );
      setRequests((prev) => prev.filter((r) => r._id !== request._id));
      dispatch(
        showToast({
          message:
            status === "accepted"
              ? `${request.userId.firstname} joined ${request.projectId.title}`
              : "Request rejected",
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
      <div className="feed-bg flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="feed-bg min-h-[calc(100vh-5rem)] px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-display text-3xl font-extrabold">
          Project requests
        </h1>
        <p className="mb-6 text-sm opacity-70">
          Developers who want to join your projects.
        </p>

        {requests.length === 0 ? (
          <div className="card items-center border border-base-300 bg-base-100 py-14 text-center">
            <h2 className="font-display text-2xl font-extrabold">
              No join requests right now
            </h2>
            <p className="mb-3 text-sm opacity-70">
              Post a project and developers who match your stack will find it.
            </p>
            <Link to="/projects/new" className="btn btn-primary rounded-full">
              + Post a project
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {requests.map((request) => {
              const applicant = request.userId;
              const project = request.projectId;
              const skills = applicant.skills || [];
              const matches = sharedSkills(project.skillsNeeded || [], skills);

              return (
                <div
                  key={request._id}
                  className="card gap-3 border border-base-300 bg-base-100 p-5"
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      variant={avatarVariant(applicant.firstname)}
                      className="h-14 w-14"
                    />
                    <div className="min-w-0">
                      <h2 className="font-display text-xl font-extrabold">
                        {applicant.firstname} {applicant.lastname}
                      </h2>
                      <p className="text-sm opacity-70">
                        wants to join <b>{project.title}</b>
                      </p>
                    </div>
                  </div>

                  <p className="text-xs opacity-70">
                    {matches.length} of the skills you need
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {skills.length === 0 && (
                      <span className="text-sm opacity-60">
                        No skills added yet
                      </span>
                    )}
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className={`badge ${
                          matches.includes(skill)
                            ? "badge-primary"
                            : "badge-outline"
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="btn btn-outline flex-1 rounded-full"
                      onClick={() => review(request, "rejected")}
                      disabled={busyId === request._id}
                    >
                      Reject
                    </button>
                    <button
                      className="btn btn-primary flex-1 rounded-full"
                      onClick={() => review(request, "accepted")}
                      disabled={busyId === request._id}
                    >
                      Accept
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectRequests;