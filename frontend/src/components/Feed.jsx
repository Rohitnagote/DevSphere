import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { showToast } from "../utils/toastSlice";
import { sharedSkills } from "../utils/helpers.js";
import Orbit from "./Orbit.jsx";
import DevPanel from "./DevPanel.jsx";

const Feed = () => {
  const me = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [devs, setDevs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [sentIds, setSentIds] = useState([]);
  const [busy, setBusy] = useState(false);
  const [skillFilter, setSkillFilter] = useState("");

  const mySkills = me?.skills || [];

  useEffect(() => {
    const getFeed = async () => {
      try {
        const res = await axios.get(BASE_URL + "/feed?limit=18", {
          withCredentials: true,
        });
        setDevs(res.data);
      } catch (err) {
        dispatch(
          showToast({ message: "Could not load developers", type: "error" })
        );
      } finally {
        setLoading(false);
      }
    };
    getFeed();
  }, []);

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

  const closeMatches = devs.filter(
    (d) => sharedSkills(mySkills, d.skills).length > 0
  ).length;

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
              Developers who share your stack sit closest to you.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="rounded-box border border-base-300 bg-base-100 px-4 py-2 text-center">
              <p className="font-display text-xl font-extrabold">{devs.length}</p>
              <p className="text-[11px] opacity-60">in orbit</p>
            </div>
            <div className="rounded-box border border-base-300 bg-base-100 px-4 py-2 text-center">
              <p className="font-display text-xl font-extrabold text-primary">
                {closeMatches}
              </p>
              <p className="text-[11px] opacity-60">share a skill</p>
            </div>
            <div className="rounded-box border border-base-300 bg-base-100 px-4 py-2 text-center">
              <p className="font-display text-xl font-extrabold text-secondary">
                {sentIds.length}
              </p>
              <p className="text-[11px] opacity-60">requests sent</p>
            </div>
          </div>
        </div>

        {/* Skill filter chips */}
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
      </div>
    </div>
  );
};

export default Feed;