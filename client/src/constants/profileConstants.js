export const statusPresets = [
  { label: "Available", color: "bg-emerald-500", text: "Available" },
  { label: "Busy", color: "bg-red-500", text: "Busy" },
  { label: "Away", color: "bg-amber-500", text: "Away" },
  { label: "Do Not Disturb", color: "bg-purple-500", text: "Do Not Disturb" }
];

export const cleanUsername = (str) => {
  return str.toLowerCase().trim().replace(/\s+/g, "");
};
