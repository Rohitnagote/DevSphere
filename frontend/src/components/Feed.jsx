import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { showToast } from "../utils/toastSlice";
import { avatarVariant, sharedSkills } from "../utils/helpers.js";
import Orbit from "./Orbit.jsx";
import DevPanel from "./DevPanel.jsx";
import ProjectCard from "./ProjectCard.jsx";
import Avatar from "./Avatar.jsx";

const joinNames = (members) => {
  const names = members.filter(Boolean).map((m) => m.firstname);
  if (names.length <= 1) return names[0] || "Someone";
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  if (names.length === 3) return `${names[0]}, ${names[1]} and ${names[2]}`;
  return `${names[0]}, ${names[1]} and ${names.length - 2} more`;
};

const Feed = () => {
  const me = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [devs, setDevs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [sentIds, setSentIds] = useState([]);
  const [busy, setBusy] = useState(false);
  const [joiningId, setJoiningId] = useState(null);
  const [skillFilter, setSkillFilter] = useState("");
  const [onlyMine, setOnlyMine] = useState(false);

  const mySkills = me?.skills || [];

  useEffect(() => {
    const loadFeed = async () => {
      const [devRes, projectRes, teamRes] = await Promise.allSettled([
        axios.get(BASE_URL + "/feed?limit=18", { withCredentials: true }),
        axios.get(BASE_URL + "/project/feed", { withCredentials: true }),
        axios.get(BASE_URL + "/project/teams", { withCredentials: true }),
      ]);

      if (devRes.status === "fulfilled") setDevs(devRes.value.data);
      else
        dispatch(
          showToast({ message: "Could not load developers", type: "error" })
        );

      if (projectRes.status === "fulfilled") setProjects(projectRes.value.data);
      else
        dispatch(
          showToast({ message: "Could not load projects", type: "error" })
        );

      if (teamRes.status === "fulfilled") setTeams(teamRes.value.data);

      setLoading(false);
    };
    loadFeed();
  }, []);

  // ---------- developers (orbit) ----------
  const ranked = [...devs].sort(
    (a, b) =>
      sharedSkills(mySkills, b.skills).length -
      sharedSkills(mySkills, a.skills).length
  );

  const visible = ranked.filter(
    (d) =>
      !skillFilter ||
      (d.skills || []).some((s) => s.toLowerCase() === skillFilter)
  );

  const topSkills = (() => {
    const counts = {};
    devs.forEach((d) =>
      (d.skills || []).forEach((s) => {
        const key = s.toLowerCase();
        counts[key] = counts[key]
          ? { ...counts[key], n: counts[key].n + 1 }
          : { label: s, n: 1 };
      })
    );
    return Object.entries(counts)
      .sort((a, b) => b[1].n - a[1].n)
      .slice(0, 8);
  })();

  const selectedDev = devs.find((d) => d._id === selectedId);

  const toggleFilter = (key) => {
    setSkillFilter(skillFilter === key ? "" : key);
    setSelectedId(null);
  };

  const sendRequest = async (status) => {
    if (!selectedDev || busy) return;
    try {
      setBusy(true);
      await axios.post(
        `${BASE_URL}/request/send/${status}/${selectedDev._id}`,
        {},
        { withCredentials: true }
      );
      if (status === "interested") {
        setSentIds((prev) => [...prev, selectedDev._id]);
        dispatch(
          showToast({
            message: `Request sent to ${selectedDev.firstname}`,
            type: "success",
          })
        );
      } else {
        setDevs((prev) => prev.filter((d) => d._id !== selectedDev._id));
        setSelectedId(null);
      }
    } catch (err) {
      dispatch(
        showToast({
          message: err.response?.data?.message || "Something went wrong",
          type: "error",
        })
      );
    } finally {
      setBusy(false);
    }
  };

  // ---------- projects ----------
  const rankedProjects = projects
    .map((p) => ({ project: p, matches: sharedSkills(mySkills, p.skillsNeeded) }))
    .sort((a, b) => b.matches.length - a.matches.length)
    .filter((x) => !onlyMine || x.matches.length > 0);

  const joinProject = async (project) => {
    if (joiningId) return;
    try {
      setJoiningId(project._id);
      await axios.post(
        `${BASE_URL}/project/${project._id}/join`,
        {},
        { withCredentials: true }
      );
      setProjects((prev) =>
        prev.map((p) =>
          p._id === project._id ? { ...p, requested: true } : p
        )
      );
      dispatch(
        showToast({
          message: `Request sent to join ${project.title}`,
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
      setJoiningId(null);
    }
  };

  const requestsSent =
    sentIds.length + projects.filter((p) => p.requested).length;

  if (loading) {
    return (
      <div className="feed-bg flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="feed-bg min-h-[calc(100vh-5rem)] px-4 py-6">
      <div className="mx-auto max-w-5xl">
        {/* Header with live stats */}
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-extrabold">
              Hi {me?.firstname}, here's your orbit
            </h1>
            <p className="text-sm opacity-70">
              Developers who share your stack sit closest. Projects below need
              people like you.
            </p>
          </div>
          <div className="flex flex-wrap items-stretch gap-2">
            <div className="rounded-box border border-base-300 bg-base-100 px-4 py-2 text-center">
              <p className="font-display text-xl font-extrabold">{devs.length}</p>
              <p className="text-[11px] opacity-60">in orbit</p>
            </div>
            <div className="rounded-box border border-base-300 bg-base-100 px-4 py-2 text-center">
              <p className="font-display text-xl font-extrabold text-primary">
                {projects.length}
              </p>
              <p className="text-[11px] opacity-60">open projects</p>
            </div>
            <div className="rounded-box border border-base-300 bg-base-100 px-4 py-2 text-center">
              <p className="font-display text-xl font-extrabold text-secondary">
                {requestsSent}
              </p>
              <p className="text-[11px] opacity-60">requests sent</p>
            </div>
            <Link to="/projects/new" className="btn btn-primary self-center rounded-full">
              + Post a project
            </Link>
          </div>
        </div>

        {/* Skill filter chips for the orbit */}
        {topSkills.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium opacity-60">Filter:</span>
            {topSkills.map(([key, info]) => (
              <button
                key={key}
                onClick={() => toggleFilter(key)}
                className={`badge cursor-pointer transition-transform hover:scale-105 ${
                  skillFilter === key ? "badge-primary" : "badge-outline bg-base-100"
                }`}
              >
                {info.label}
              </button>
            ))}
            {skillFilter && (
              <button
                onClick={() => toggleFilter(skillFilter)}
                className="text-xs text-primary underline"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Orbit + developer panel */}
        <div className="grid items-start gap-5 lg:grid-cols-[1.25fr_1fr]">
          <div className="orbit-card card border border-base-300 bg-base-100 p-4">
            {devs.length === 0 ? (
              <div className="py-20 text-center opacity-70">
                <h2 className="font-display text-2xl font-extrabold">
                  You've met everyone for now
                </h2>
                <p>New developers will show up here as they join.</p>
              </div>
            ) : visible.length === 0 ? (
              <div className="py-20 text-center opacity-70">
                <p>No developers with this skill right now.</p>
              </div>
            ) : (
              <>
                <Orbit
                  me={me}
                  devs={visible}
                  selectedId={selectedId}
                  sentIds={sentIds}
                  onSelect={setSelectedId}
                />
                <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs opacity-70">
                  <span className="flex items-center gap-1">
                    <span className="h-3 w-3 rounded-full border-2 border-primary"></span>
                    Selected
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-3 w-3 rounded-full bg-secondary"></span>
                    Request sent
                  </span>
                  <span>Closer to you = more shared skills</span>
                </div>
              </>
            )}
          </div>

          <div className="card min-h-[340px] border border-base-300 bg-base-100 p-6 shadow-sm">
            {mySkills.length === 0 && (
              <p className="mb-4 rounded-box bg-base-200 p-3 text-center text-sm">
                Add skills in your{" "}
                <Link to="/profile" className="font-medium text-primary underline">
                  profile
                </Link>{" "}
                to get better matches.
              </p>
            )}
            <DevPanel
              dev={selectedDev}
              mySkills={mySkills}
              sent={selectedDev ? sentIds.includes(selectedDev._id) : false}
              busy={busy}
              onRequest={sendRequest}
            />
          </div>
        </div>

        {/* Projects row */}
        <section className="mt-10">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-extrabold">
                Projects looking for teammates
              </h2>
              <p className="text-sm opacity-70">
                Ranked by how many of your skills they need.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className={`badge cursor-pointer ${
                  !onlyMine ? "badge-primary" : "badge-outline bg-base-100"
                }`}
                onClick={() => setOnlyMine(false)}
              >
                All
              </button>
              <button
                className={`badge cursor-pointer ${
                  onlyMine ? "badge-primary" : "badge-outline bg-base-100"
                }`}
                onClick={() => setOnlyMine(true)}
              >
                Needs my skills
              </button>
            </div>
          </div>

          {rankedProjects.length === 0 ? (
            <div className="card border border-base-300 bg-base-100 py-10 text-center">
              <p className="opacity-70">
                {onlyMine
                  ? "No open project needs your skills yet."
                  : "No open projects right now."}
              </p>
              <Link
                to="/projects/new"
                className="mt-2 text-sm font-medium text-primary underline"
              >
                Post the first one
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rankedProjects.map(({ project }) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  mySkills={mySkills}
                  busy={joiningId === project._id}
                  onJoin={joinProject}
                />
              ))}
            </div>
          )}
        </section>

        {/* Teams building now */}
        <section className="mt-10">
          <div className="mb-3">
            <h2 className="font-display text-2xl font-extrabold">
              Teams building now
            </h2>
            <p className="text-sm opacity-70">
              Developers who started something together.
            </p>
          </div>

          {teams.length === 0 ? (
            <div className="card border border-base-300 bg-base-100 py-8 text-center">
              <p className="opacity-70">
                No teams yet. Be the first to form one.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {teams.map((team) => (
                <div
                  key={team._id}
                  className="flex items-center gap-3 rounded-box border border-base-300 bg-base-100 p-3"
                >
                  <div className="flex -space-x-2">
                    {team.members.filter(Boolean).slice(0, 4).map((m) => (
                      <Avatar
                        key={m._id}
                        variant={avatarVariant(m.firstname)}
                        className="h-8 w-8 border-2 border-base-100"
                      />
                    ))}
                  </div>
                  <p className="min-w-0 text-sm leading-snug">
                    <b>{joinNames(team.members)}</b> are building {team.title}
                    <span className="block text-xs opacity-60">
                      {(team.skillsNeeded || []).slice(0, 3).join(", ")}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Feed;