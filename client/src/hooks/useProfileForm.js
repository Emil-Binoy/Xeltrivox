import { useState, useEffect, useMemo } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { statusPresets, cleanUsername } from "../constants/profileConstants";

export const useProfileForm = (currentUser, isOpen, onProfileUpdated, onClose) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [status, setStatus] = useState("Available");
  const [customStatus, setCustomStatus] = useState("");
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Set fields when currentUser is loaded/changed
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setUsername(currentUser.username || "");
      setProfilePic(currentUser.profilePic || "gradient-1");
      
      const currentStatus = currentUser.status || "Available";
      const matchedPreset = statusPresets.find(p => p.label === currentStatus);
      if (matchedPreset) {
        setStatus(currentStatus);
        setCustomStatus("");
      } else {
        setStatus("Custom");
        setCustomStatus(currentStatus);
      }

      // Detect mode of avatar picture
      if (currentUser.profilePic && !currentUser.profilePic.startsWith("gradient-")) {
        setIsUrlMode(true);
      } else {
        setIsUrlMode(false);
      }
    }
  }, [currentUser, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }

    const cleanedUsername = cleanUsername(username);
    if (!/^[a-zA-Z0-9_]+$/.test(cleanedUsername)) {
      toast.error("Username can only contain letters, numbers, and underscores");
      return;
    }

    const finalStatus = status === "Custom" ? customStatus.trim() || "Available" : status;
    const finalProfilePic = profilePic;

    setLoading(true);
    const savePromise = api.put("/users/profile", {
      name: name.trim(),
      username: cleanedUsername,
      profilePic: finalProfilePic,
      status: finalStatus
    });

    toast.promise(
      savePromise,
      {
        loading: "Updating profile data...",
        success: (response) => {
          setLoading(false);
          if (onProfileUpdated) {
            onProfileUpdated(response.data);
          }
          onClose();
          return "Profile updated successfully!";
        },
        error: (err) => {
          setLoading(false);
          return err.response?.data?.message || "Failed to update profile";
        }
      },
      {
        style: {
          background: "#0d1321",
          color: "#cbd5e1",
          border: "1px solid #1e293b",
        },
        success: { iconTheme: { primary: "#06b6d4", secondary: "#0d1321" } },
        error: { iconTheme: { primary: "#ef4444", secondary: "#0d1321" } },
      }
    );
  };

  const previewUser = useMemo(() => ({
    name: name || "User",
    profilePic: profilePic,
    status: status === "Custom" ? customStatus || "Available" : status
  }), [name, profilePic, status, customStatus]);

  return {
    name, setName,
    username, setUsername,
    profilePic, setProfilePic,
    status, setStatus,
    customStatus, setCustomStatus,
    isUrlMode, setIsUrlMode,
    loading,
    handleSubmit,
    previewUser
  };
};
