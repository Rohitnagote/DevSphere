import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { showToast } from "../utils/toastSlice";
import { avatarVariant } from "../utils/helpers.js";
import Avatar from "./Avatar.jsx";

const MAX_SKILLS = 10;
const TEAM_SIZES = Array.from({ length: 9 }, (_, i) => i + 2);

const ProjectNew = () => {
  const me = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maxMembers, setMaxMembers] = useState(4);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const addSkill = () => {
    const skill = skillInput.trim();
    if (!skill) return;
    if (skills.some((s) => s.toLowerCase() === skill.toLowerCase())) {
      setSkillInput("");
      return;
    }
    if (skills.length >= MAX_SKILLS) {
      setError(`You can add up to ${MAX_SKILLS} skills`);
      return;
    }
    setSkills([...skills, skill]);
    setSkillInput("");
    setError("");
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  };

  const handlePost = async () => {
    if (title.trim().length < 3) {
      setError("Project name must be at least 3 characters");
      return;
    }
    if (!description.trim()) {
      setError("Add a short description");
      return;
    }

    try {
      setSaving(true);
      setError("");
      await axios.post(
        BASE_URL + "/project/create",
        {
          title: title.trim(),
          description: description.trim(),
          skillsNeeded: skills,
          maxMembers: Number(maxMembers),
        },
        { withCredentials: true }
      );
      dispatch(showToast({ message: "Project posted", type: "success" }));
      navigate("/feed");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const filled = 1;
  const percent = (filled / Number(maxMembers)) * 100;

  return (
    <div className="feed-bg min-h-[calc(100vh-5rem)] px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display text-3xl font-extrabold">
          Post a project
        </h1>
        <p className="mb-6 text-sm opacity-70">
          Tell developers what you want to build and who you need.
        </p>

        <div className="grid items-start gap-5 lg:grid-cols-[1.2fr_1fr]">
          {/* Form */}
          <div className="card border border-base-300 bg-base-100 p-6">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Project name</legend>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={60}
                className="input w-full"
                placeholder="Study Buddy"
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Description</legend>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={300}
                rows={4}
                className="textarea w-full"
                placeholder="What are you building, and why?"
              />
              <p className="label">{description.length}/300</p>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Skills needed ({skills.length}/{MAX_SKILLS})
              </legend>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  className="input w-full"
                  placeholder="Type a skill and press Enter"
                />
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={addSkill}
                >
                  Add
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {skills.map((skill) => (
                  <span key={skill} className="badge badge-primary gap-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      aria-label={`Remove ${skill}`}
                      className="cursor-pointer"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Team size (including you)</legend>
              <select
                value={maxMembers}
                onChange={(e) => setMaxMembers(e.target.value)}
                className="select w-full"
              >
                {TEAM_SIZES.map((n) => (
                  <option key={n} value={n}>
                    {n} people
                  </option>
                ))}
              </select>
            </fieldset>

            {error && <p className="text-sm text-error">{error}</p>}

            <button
              className="btn btn-primary mt-3 rounded-full"
              onClick={handlePost}
              disabled={saving}
            >
              {saving ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Post project"
              )}
            </button>
          </div>

          {/* Live preview */}
          <div>
            <p className="mb-2 text-xs opacity-60">Live preview</p>
            <div className="card gap-2 border border-base-300 bg-base-100 p-5">
              <span className="badge badge-success badge-soft w-fit">
                Looking for teammates
              </span>
              <h2 className="font-display text-2xl font-extrabold">
                {title || "Your project name"}
              </h2>
              <div className="flex items-center gap-2 text-sm opacity-70">
                <Avatar
                  variant={avatarVariant(me?.firstname)}
                  className="h-6 w-6"
                />
                by {me?.firstname}
              </div>
              <p className="text-sm opacity-80">
                {description || "Your description shows up here."}
              </p>
              <div className="flex flex-wrap gap-1">
                {skills.length === 0 && (
                  <span className="text-sm opacity-60">No skills added yet</span>
                )}
                {skills.map((skill) => (
                  <span key={skill} className="badge badge-primary badge-soft">
                    {skill}
                  </span>
                ))}
              </div>
              <progress
                className="progress progress-primary w-full"
                value={percent}
                max="100"
              ></progress>
              <div className="flex items-center justify-between text-sm opacity-70">
                <Avatar
                  variant={avatarVariant(me?.firstname)}
                  className="h-7 w-7"
                />
                <span>
                  {filled} of {maxMembers} spots filled
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectNew;