const palettes = {
  1: { bg: "#C9C3F5", shirt: "#4F46A5", skin: "#F2C9A5", hair: "#231F4D" },
  2: { bg: "#FFD3DA", shirt: "#FF6B81", skin: "#E7B28B", hair: "#3A2A1F" },
  3: { bg: "#CFEFE3", shirt: "#2E8F6E", skin: "#8D5B3C", hair: "#1B1B2F" },
  4: { bg: "#FFE9B8", shirt: "#231F4D", skin: "#F5D3B5", hair: "#B5651D" },
  5: { bg: "#D6E6FF", shirt: "#3B6FD4", skin: "#C98E68", hair: "#2B2B2B" },
};

const Avatar = ({ variant = 1, className = "" }) => {
  const c = palettes[variant];
  return (
    <svg
      viewBox="0 0 80 80"
      className={`rounded-full ${className}`}
      aria-hidden="true"
    >
      <rect width="80" height="80" fill={c.bg} />
      <path d="M12 80c2-18 14-26 28-26s26 8 28 26z" fill={c.shirt} />
      <circle cx="40" cy="34" r="15" fill={c.skin} />
      <path
        d="M24 33c0-12 8-18 17-18s15 6 15 17c-4-6-10-9-17-9s-11 4-15 10z"
        fill={c.hair}
      />
    </svg>
  );
};

export default Avatar;