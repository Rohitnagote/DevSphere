export const sharedSkills = (mine = [], theirs = []) => {
  const lower = mine.map((s) => s.toLowerCase());
  return theirs.filter((s) => lower.includes(s.toLowerCase()));
};

export const avatarVariant = (name = "") => {
  return ((name.charCodeAt(0) || 0) % 5) + 1;
};