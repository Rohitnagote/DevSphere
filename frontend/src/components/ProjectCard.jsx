import Avatar from "./Avatar.jsx";
import { avatarVariant, sharedSkills } from "../utils/helpers.js";

const ProjectCard = ({ project, mySkills, busy, onJoin }) => {
  const needs = project.skillsNeeded || [];
  const shared = sharedSkills(mySkills, needs);
  const members = (project.members || []).filter(Boolean);
  const owner = project.ownerId;
  const percent = (members.length / project.maxMembers) * 100;

  return (
    <article className="card gap-2 border border-base-300 bg-base-100 p-4 transition-transform hover:-translate-y-1 hover:shadow-lg">
      {shared.length > 0 && (
        <span className="badge badge-secondary badge-soft w-fit">
          Needs your {shared[0]}
        </span>
      )}

      <h3 className="font-display text-xl font-extrabold">{project.title}</h3>

      {owner && (
        <div className="flex items-center gap-2 text-sm opacity-70">
          <Avatar
            variant={avatarVariant(owner.firstname)}
            className="h-6 w-6"
          />
          by {owner.firstname} {owner.lastname}
        </div>
      )}

      <p className="line-clamp-3 text-sm opacity-80">{project.description}</p>

      <div className="flex flex-wrap gap-1">
        {needs.length === 0 && (
          <span className="text-sm opacity-60">Open to any skills</span>
        )}
        {needs.map((skill) => (
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

      <div className="mt-auto pt-2">
        <progress
          className="progress progress-primary w-full"
          value={percent}
          max="100"
        ></progress>
        <div className="mt-1 flex items-center justify-between text-sm opacity-70">
          <div className="flex -space-x-2">
            {members.slice(0, 5).map((m) => (
              <Avatar
                key={m._id}
                variant={avatarVariant(m.firstname)}
                className="h-7 w-7 border-2 border-base-100"
              />
            ))}
          </div>
          <span>
            {members.length} of {project.maxMembers} spots filled
          </span>
        </div>

        <button
          className="btn btn-primary mt-3 w-full rounded-full"
          onClick={() => onJoin(project)}
          disabled={project.requested || busy}
        >
          {project.requested ? "Request sent" : "Request to join"}
        </button>
      </div>
    </article>
  );
};

export default ProjectCard;