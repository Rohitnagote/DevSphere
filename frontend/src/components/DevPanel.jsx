import Avatar from "./Avatar.jsx";
import { avatarVariant, sharedSkills } from "../utils/helpers.js";

const DEFAULT_ABOUT = "No information provided";

const DevPanel = ({ dev, mySkills, sent, busy, onRequest }) => {
  if (!dev) {
    return (
      <div className="py-6 text-center">
        <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-2xl">
          🪐
        </div>
        <h2 className="font-display text-2xl font-extrabold">Pick a planet</h2>
        <p className="mb-5 text-sm opacity-70">
          Click any developer in the orbit to see their stack.
        </p>
        <ul className="space-y-2 text-left text-sm">
          <li className="rounded-box bg-base-200 p-3">
            <b>Closer to you</b> means more shared skills.
          </li>
          <li className="rounded-box bg-base-200 p-3">
            <b>Hover</b> over the orbit to pause it.
          </li>
          <li className="rounded-box bg-base-200 p-3">
            <b>Filter by skill</b> using the chips above.
          </li>
        </ul>
      </div>
    );
  }

  const skills = dev.skills || [];
  const shared = sharedSkills(mySkills, skills);
  const match = mySkills.length
    ? Math.round((shared.length / mySkills.length) * 100)
    : null;
  const hasAbout = dev.about && dev.about !== DEFAULT_ABOUT;
  const details = [dev.age, dev.gender].filter(Boolean).join(", ");

  return (
    <div key={dev._id} className="panel-in text-center">
      <Avatar
        variant={avatarVariant(dev.firstname)}
        className="mx-auto mb-3 h-24 w-24"
      />
      <h2 className="font-display text-2xl font-extrabold">
        {dev.firstname} {dev.lastname}
      </h2>
      {details && <p className="text-sm opacity-60">{details}</p>}
      {hasAbout && <p className="mt-2 text-sm">{dev.about}</p>}

      {match !== null && (
        <div className="mt-4 text-left">
          <div className="mb-1 flex justify-between text-xs font-medium">
            <span>Match with your stack</span>
            <span className="text-primary">{match}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-base-300">
            <div
              className="match-fill h-full rounded-full bg-primary"
              style={{ width: `${match}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap justify-center gap-1">
        {skills.length === 0 && (
          <span className="text-sm opacity-60">No skills added yet</span>
        )}
        {skills.map((skill) => (
          <span
            key={skill}
            className={`badge ${
              shared.some((s) => s.toLowerCase() === skill.toLowerCase())
                ? "badge-primary"
                : "badge-outline"
            }`}
          >
            {skill}
          </span>
        ))}
      </div>

      {sent ? (
        <p className="mt-5 text-sm font-medium text-primary">
          Request sent to {dev.firstname}
        </p>
      ) : (
        <div className="mt-5 flex gap-2">
          <button
            className="btn btn-outline flex-1 rounded-full"
            onClick={() => onRequest("ignored")}
            disabled={busy}
          >
            Ignore
          </button>
          <button
            className="btn btn-secondary flex-1 rounded-full"
            onClick={() => onRequest("interested")}
            disabled={busy}
          >
            Interested
          </button>
        </div>
      )}
    </div>
  );
};

export default DevPanel;