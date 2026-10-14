import Avatar from "./Avatar.jsx";
import { avatarVariant, sharedSkills } from "../utils/helpers.js";

const DevPanel = ({ dev, mySkills, sent, busy, onRequest }) => {
  if (!dev) {
    return (
      <div className="py-10 text-center opacity-70">
        <h2 className="font-display text-2xl font-extrabold">Pick a planet</h2>
        <p>Click any developer to see their stack and decide.</p>
      </div>
    );
  }

  const skills = dev.skills || [];
  const shared = sharedSkills(mySkills, skills);

  return (
    <div className="text-center">
      <Avatar
        variant={avatarVariant(dev.firstname)}
        className="mx-auto mb-3 h-24 w-24"
      />
      <h2 className="font-display text-2xl font-extrabold">
        {dev.firstname} {dev.lastname}
      </h2>
      <p className="mb-3 text-sm opacity-70">
        {shared.length} shared skill{shared.length === 1 ? "" : "s"} with you
      </p>

      <div className="flex flex-wrap justify-center gap-1">
        {skills.length === 0 && (
          <span className="text-sm opacity-60">No skills added yet</span>
        )}
        {skills.map((skill) => (
          <span
            key={skill}
            className={`badge ${
              shared.includes(skill) ? "badge-primary" : "badge-outline"
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