import React, { useState } from "react";
import "./Tabs.scss";

interface TabsProps {
  onTabChange: (tab: "explore" | "watchlist") => void;
}

/**
 * Component to display tabs for switching between "explore" and "watchlist".
 * @param onTabChange - Function to handle tab change.
 */
const Tabs: React.FC<TabsProps> = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState<"explore" | "watchlist">(
    "explore"
  );

  const handleTabClick = (tab: "explore" | "watchlist") => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <div className="tabs">
      <button
        className={`tabs__button ${
          activeTab === "explore" ? "tabs__button--active" : ""
        }`}
        onClick={() => handleTabClick("explore")}
      >
        Explore
      </button>
      <button
        className={`tabs__button ${
          activeTab === "watchlist" ? "tabs__button--active" : ""
        }`}
        onClick={() => handleTabClick("watchlist")}
      >
        My Watchlist
      </button>
    </div>
  );
};

export default Tabs;
