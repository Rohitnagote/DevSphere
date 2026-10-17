import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import { showToast } from "../utils/toastSlice";
import { avatarVariant } from "../utils/helpers.js";
import Avatar from "./Avatar.jsx";

const DEFAULT_ABOUT = "No information provided";
const MAX_SKILLS = 10;

const Profile = () => {
  const me = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    firstname: me?.firstname || "",
    lastname: me?.lastname || "",
    age: me?.age ?? "",
    gender: me?.gender || "",
    about: me?.about === DEFAULT_ABOUT ? "" : me?.about || "",
  });
  const [skills, setSkills] = useState(me?.skills || []);
  const [skillInput, setSkillInput] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

  const handleSave = async () => {
    if (form.firstname.trim().length < 3) {
      setError("First name must be at least 3 characters");
      return;
    }
    if (form.age !== "" && Number(form.age) < 18) {
      setError("Age must be 18 or above");
      return;
    }

    const payload = {
      firstname: form.firstname.trim(),
      lastname: form.lastname.trim(),
      about: form.about,
      skills,
    };
    if (form.age !== "") payload.age = Number(form.age);
    if (form.gender) payload.gender = form.gender;

    try {
      setSaving(true);
      setError("");
      const res = await axios.patch(BASE_URL + "/profile/edit", payload, {
        withCredentials: true,
      });
      dispatch(addUser(res.data.user));
      dispatch(showToast({ message: "Profile saved", type: "success" }));
    } catch (err) {
      setError(err.response?.data || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-base-200 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display text-3xl font-extrabold">Your profile</h1>
        <p className="mb-6 text-sm opacity-70">
          This is what other developers see on the orbit.
        </p>

        <div className="grid items-start gap-5 lg:grid-cols-[1.2fr_1fr]">
          {/* Edit form */}
          <div className="card border border-base-300 bg-base-100 p-6">
            <div className="grid grid-cols-2 gap-3">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">First name</legend>
                <input
                  name="firstname"
                  type="text"
                  value={form.firstname}
                  onChange={handleChange}
                  className="input w-full"
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Last name</legend>
                <input
                  name="lastname"
                  type="text"
                  value={form.lastname}
                  onChange={handleChange}
                  className="input w-full"
                />
              </fieldset>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Age</legend>
                <input
                  name="age"
                  type="number"
                  min="18"
                  value={form.age}
                  onChange={handleChange}
                  className="input w-full"
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Gender</legend>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="select w-full"
                >
                  <option value="">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="others">Others</option>
                </select>
              </fieldset>
            </div>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">About</legend>
              <textarea
                name="about"
                value={form.about}
                onChange={handleChange}
                maxLength={200}
                rows={3}
                className="textarea w-full"
                placeholder="Tell developers what you build"
              />
              <p className="label">{form.about.length}/200</p>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Skills ({skills.length}/{MAX_SKILLS})
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

            {error && <p className="text-sm text-error">{error}</p>}

            <button
              className="btn btn-primary mt-3 rounded-full"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Save profile"
              )}
            </button>
          </div>

          {/* Live preview */}
          <div className="card items-center border border-base-300 bg-base-100 p-6 text-center">
            <p className="mb-3 text-xs opacity-60">Live preview</p>
            <Avatar
              variant={avatarVariant(form.firstname)}
              className="mb-3 h-24 w-24"
            />
            <h2 className="font-display text-2xl font-extrabold">
              {form.firstname || "Your name"} {form.lastname}
            </h2>
            <p className="mb-2 text-sm opacity-70">
              {[form.age, form.gender].filter(Boolean).join(", ") ||
                "Age and gender not set"}
            </p>
            <p className="mb-3 text-sm">{form.about || "Nothing here yet."}</p>
            <div className="flex flex-wrap justify-center gap-1">
              {skills.length === 0 && (
                <span className="text-sm opacity-60">No skills added yet</span>
              )}
              {skills.map((skill) => (
                <span key={skill} className="badge badge-outline">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;