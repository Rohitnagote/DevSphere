import Avatar from "./Avatar.jsx";
import { avatarVariant } from "../utils/helpers.js";

const RINGS = [
  { size: 40, seconds: 60, offset: 20, capacity: 4, reverse: false },
  { size: 66, seconds: 80, offset: 70, capacity: 6, reverse: true },
  { size: 92, seconds: 100, offset: 0, capacity: 8, reverse: false },
];

const Orbit = ({ me, devs, selectedId, sentIds, onSelect }) => {
  let start = 0;
  const groups = RINGS.map((ring) => {
    const group = devs.slice(start, start + ring.capacity);
    start += ring.capacity;
    return group;
  });

  return (
    <div className="orbit-stage">
      <div className="absolute left-1/2 top-1/2 z-10 grid h-[86px] w-[86px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-primary bg-primary/10">
        <Avatar variant={avatarVariant(me?.firstname)} className="h-16 w-16" />
        <span className="absolute -bottom-6 font-display text-sm font-extrabold text-primary">
          You
        </span>
      </div>

      {RINGS.map((ring, ri) => (
        <div
          key={ri}
          className="orbit-ring"
          style={{
            width: `${ring.size}%`,
            height: `${ring.size}%`,
            left: `${(100 - ring.size) / 2}%`,
            top: `${(100 - ring.size) / 2}%`,
            animationDuration: `${ring.seconds}s`,
            animationDirection: ring.reverse ? "reverse" : "normal",
          }}
        >
          {groups[ri].map((dev, j) => {
            const angle = ring.offset + (j * 360) / groups[ri].length;
            const isSelected = dev._id === selectedId;
            const isSent = sentIds.includes(dev._id);
            const border = isSelected
              ? "border-primary"
              : isSent
              ? "border-secondary"
              : "border-base-100";

            return (
              <div
                key={dev._id}
                className="orbit-arm"
                style={{ transform: `rotate(${angle}deg)` }}
              >
                <div className="orbit-pos">
                  <button
                    className="orbit-planet group"
                    style={{ transform: `rotate(${-angle}deg)` }}
                    onClick={() => onSelect(dev._id)}
                    aria-label={`View ${dev.firstname}`}
                    aria-pressed={isSelected}
                  >
                    <span
                      className="orbit-av"
                      style={{
                        animationDuration: `${ring.seconds}s`,
                        animationDirection: ring.reverse ? "normal" : "reverse",
                      }}
                    >
                      <Avatar
                        variant={avatarVariant(dev.firstname)}
                        className={`block h-full w-full border-[3px] shadow-md transition-transform group-hover:scale-110 ${border}`}
                      />
                      {isSent && (
                        <span className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full border-2 border-white bg-secondary"></span>
                      )}
                      <span className="absolute left-1/2 top-full -translate-x-1/2 whitespace-nowrap rounded-full bg-white/85 px-1.5 text-[11px] font-medium">
                        {dev.firstname}
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Orbit;