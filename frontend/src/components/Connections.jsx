import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { showToast } from "../utils/toastSlice";
import { avatarVariant, sharedSkills } from "../utils/helpers.js";
import Avatar from "./Avatar.jsx";
import Reveal from "./Reveal.jsx";

const Connections = () => {
  const me = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  const mySkills = me?.skills || [];

  useEffect(() => {
    const getConnections = async () => {
      try {
        const res = await axios.get(BASE_URL + "/user/connections", {
          withCredentials: true,
        });
        setConnections(res.data.data.filter((p) => p && p.firstname));
      } catch (err) {
        dispatch(
          showToast({ message: "Could not load connections", type: "error" })
        );
      } finally {
        setLoading(false);
      }
    };
    getConnections();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-base-200 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display text-3xl font-extrabold">
          Your connections
        </h1>
        <p className="mb-6 text-sm opacity-70">
          {connections.length === 0
            ? "People you match with will show up here."
            : `${connections.length} developer${
                connections.length === 1 ? "" : "s"
              } you're connected with.`}
        </p>

        {connections.length === 0 ? (
          <div className="card border border-base-300 bg-base-100 p-10 text-center">
            <h2 className="font-display text-2xl font-extrabold">
              No connections yet
            </h2>
            <p className="mb-4 opacity-70">
              Send an Interested from the orbit, or accept a request.
            </p>
            <Link to="/feed" className="btn btn-primary mx-auto rounded-full">
              Open the feed
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {connections.map((person, i) => {
              const skills = person.skills || [];
              const shared = sharedSkills(mySkills, skills);

              return (
                <Reveal key={person._id} delay={(i % 3) * 80} className="h-full">
                  <div className="card h-full items-center border border-base-300 bg-base-100 p-5 text-center transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <Avatar
                      variant={avatarVariant(person.firstname)}
                      className="mb-3 h-20 w-20"
                    />
                    <h2 className="font-display text-xl font-extrabold">
                      {person.firstname} {person.lastname}
                    </h2>
                    <p className="mb-3 text-sm opacity-70">
                      {shared.length} shared skill
                      {shared.length === 1 ? "" : "s"}
                    </p>
                    <div className="flex flex-wrap justify-center gap-1">
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
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;