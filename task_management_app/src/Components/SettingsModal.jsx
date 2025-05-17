import { useState } from "react";
import { FiX, FiSun, FiMoon, FiBell, FiGlobe } from "react-icons/fi";
import Button from "./Button";

const SettingsModal = ({ isOpen, onClose }) => {
  // Settings state
  const [settings, setSettings] = useState({
    theme: "light",
    notifications: true,
    language: "english",
    compactView: false,
  });

  const handleChange = (setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));

    // In a real app, you would save these settings to localStorage or backend
    localStorage.setItem(
      "appSettings",
      JSON.stringify({
        ...settings,
        [setting]: value,
      })
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 sm:p-6">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md
                  ring-1 ring-black ring-opacity-5
                  flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
      >
        <header className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2
            id="settings-modal-title"
            className="text-2xl font-extrabold text-gray-900 tracking-tight"
          >
            Settings
          </h2>
          <button
            onClick={onClose}
            aria-label="Close settings modal"
            className="p-2 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100
                   focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
          >
            <FiX size={22} />
          </button>
        </header>

        <div className="p-6 space-y-8 flex-grow overflow-y-auto">
          {/* Theme Setting */}
          <section>
            <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center select-none">
              <FiSun className="mr-3 text-teal-600 text-lg" /> Theme
            </h3>
            <div className="flex gap-4 flex-wrap">
              {["light", "dark", "system"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleChange("theme", mode)}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors
                ${
                  settings.theme === mode
                    ? "bg-teal-600 text-white shadow-md shadow-teal-400/40 transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                }
                focus:outline-none focus:ring-4 focus:ring-teal-300`}
                  aria-pressed={settings.theme === mode}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </section>

          {/* Notifications Setting */}
          <section>
            <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center select-none">
              <FiBell className="mr-3 text-teal-600 text-lg" /> Notifications
            </h3>
            <label className="inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) =>
                  handleChange("notifications", e.target.checked)
                }
                className="sr-only peer"
              />
              <div
                className="relative w-12 h-7 bg-gray-300 rounded-full
                          peer-focus:ring-4 peer-focus:ring-teal-300
                          peer-checked:bg-teal-600 transition-colors
                          after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                          after:bg-white after:border after:border-gray-300 after:rounded-full
                          after:h-6 after:w-6 after:transition-transform peer-checked:after:translate-x-5"
              ></div>
              <span className="ml-4 text-sm font-semibold text-gray-700 select-none">
                {settings.notifications ? "Enabled" : "Disabled"}
              </span>
            </label>
          </section>

          {/* Language Setting */}
          <section>
            <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center select-none">
              <FiGlobe className="mr-3 text-teal-600 text-lg" /> Language
            </h3>
            <select
              value={settings.language}
              onChange={(e) => handleChange("language", e.target.value)}
              className="w-full p-3 text-sm border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-4 focus:ring-teal-300 focus:border-teal-500
                     transition"
              aria-label="Select language"
            >
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
            </select>
          </section>

          {/* Compact View Setting */}
          <section>
            <h3 className="text-sm font-semibold text-gray-800 mb-4 select-none">
              Display
            </h3>
            <label className="inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={settings.compactView}
                onChange={(e) => handleChange("compactView", e.target.checked)}
                className="sr-only peer"
              />
              <div
                className="relative w-12 h-7 bg-gray-300 rounded-full
                          peer-focus:ring-4 peer-focus:ring-teal-300
                          peer-checked:bg-teal-600 transition-colors
                          after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                          after:bg-white after:border after:border-gray-300 after:rounded-full
                          after:h-6 after:w-6 after:transition-transform peer-checked:after:translate-x-5"
              ></div>
              <span className="ml-4 text-sm font-semibold text-gray-700 select-none">
                Compact View
              </span>
            </label>
          </section>

          <div className="pt-6 flex justify-end">
            <Button
              onClick={onClose}
              className="px-6 py-3 text-sm font-semibold bg-teal-600 text-white rounded-lg
                     shadow-md hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-400
                     transition"
            >
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
