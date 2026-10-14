import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  const selectedDev = devs.find((d) => d._id === selectedId);

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
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-base-200 px-4 py-6">
      <div className="mx-auto grid max-w-5xl items-start gap-5 lg:grid-cols-[1.25fr_1fr]">
        <div className="card border border-base-300 bg-base-100 p-4">
          {devs.length === 0 ? (
            <div className="py-20 text-center opacity-70">
              <h2 className="font-display text-2xl font-extrabold">
                You've met everyone for now
              </h2>
              <p>New developers will show up here as they join.</p>
            </div>
          ) : (
            <>
              <Orbit
                me={me}
                devs={ranked}
                selectedId={selectedId}
                sentIds={sentIds}
                onSelect={setSelectedId}
              />
              <p className="mt-2 text-center text-xs opacity-70">
                The closer to you, the more skills you share.
              </p>
            </>
          )}
        </div>

        <div className="card min-h-[340px] border border-base-300 bg-base-100 p-6">
          {mySkills.length === 0 && (
            <p className="mb-4 rounded-box bg-base-200 p-3 text-center text-sm">
              Add skills to your profile to get better matches. The profile page
              is coming soon.
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
  );
};

export default Feed;