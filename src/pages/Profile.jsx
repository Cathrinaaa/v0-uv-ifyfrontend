// ======================================================
// 🌤️ Profile.jsx — Editable Profile with Picture Upload
// ======================================================
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../main";
import { useLanguage } from "../contexts/LanguageContext";

export default function Profile() {
  const { t } = useLanguage();
  const { user, updateUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profileImage: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch user data
  useEffect(() => {
    if (!user?.user_id) return;
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `https://uvify-backend.onrender.com/profile/${user.user_id}`
        );
        const data = await res.json();
        if (data.success && data.user) {
          setFormData({
            firstName: data.user.first_name || "",
            lastName: data.user.last_name || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
            profileImage: data.user.profile_image || "",
          });
          if (updateUser) updateUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
      }
    };
    fetchUser();
  }, [user?.user_id, updateUser]);

  const joinedDate = user?.created_at
    ? new Date(user.created_at)
    : new Date();

  // ✅ Avatar initials fallback
  const getUserInitials = () => {
    if (formData.firstName && formData.lastName) {
      return `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase();
    }
    return "JD";
  };

  // ✅ Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setFormData({ ...formData, newImage: file });
  };

  // ✅ Handle field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Save changes
  const handleSave = async () => {
    setLoading(true);
    try {
      const form = new FormData();
      form.append("first_name", formData.firstName);
      form.append("last_name", formData.lastName);
      form.append("email", formData.email);
      form.append("phone", formData.phone);
      if (formData.newImage) form.append("profile_image", formData.newImage);

      const res = await fetch(
        `https://uvify-backend.onrender.com/profile/update/${user.user_id}`,
        {
          method: "PUT",
          body: form,
        }
      );
      const data = await res.json();

      if (data.success) {
        setIsEditing(false);
        setFormData({
          ...formData,
          profileImage: data.user.profile_image || formData.profileImage,
        });
        if (updateUser) updateUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        alert("❌ Failed to update profile.");
      }
    } catch (err) {
      console.error("❌ Error updating profile:", err);
      alert("Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // 🧱 UI
  // ======================================================
  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500 mb-2">
          {t("profile.title")}
        </h1>
        <p className="text-orange-600 dark:text-orange-400 text-sm">
          {t("profile.subtitle")}
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-orange-100 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-600 p-10 flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="relative w-28 h-28">
            {preview || formData.profileImage ? (
              <img
                src={preview || formData.profileImage}
                alt="Profile"
                className="w-28 h-28 object-cover rounded-full border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-28 h-28 bg-white/30 rounded-full flex items-center justify-center border-4 border-white shadow-lg text-4xl text-white font-extrabold">
                {getUserInitials()}
              </div>
            )}

            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-white/80 hover:bg-white text-orange-600 p-2 rounded-full cursor-pointer shadow-md">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <span className="text-sm font-bold">📷</span>
              </label>
            )}
          </div>

          <h2 className="text-3xl text-white font-bold mt-4">
            {formData.firstName} {formData.lastName}
          </h2>
          <p className="text-white/80 text-sm mt-2">
            📅 {t("profile.joined")}{" "}
            {joinedDate.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Info Section */}
        <div className="p-8 bg-orange-50/60 dark:bg-gray-700/60">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-orange-700 dark:text-orange-400">
              {t("profile.personalInfo")}
            </h3>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                ✏️ Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                >
                  {loading ? "Saving..." : "💾 Save"}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {["firstName", "lastName", "email", "phone"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-semibold text-orange-600 mb-1 capitalize">
                  {t(`profile.${field}`)}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-gray-800 rounded-xl px-4 py-3 border border-orange-200 dark:border-gray-600 text-orange-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-xl px-4 py-3 border border-orange-100 dark:border-gray-600 text-orange-900 dark:text-gray-200">
                    {formData[field] || (
                      <span className="text-orange-400">{t("profile.notSet")}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
