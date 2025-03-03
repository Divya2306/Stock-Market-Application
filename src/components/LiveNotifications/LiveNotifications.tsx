import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./LiveNotifications.scss";

/**
 * Props for the LiveNotifications component
 */
interface LiveNotificationsProps {
  stockName: string;
}

/**
 * Notification interface
 */
interface Notification {
  id: string;
  message: string;
  timestamp: string;
}

// Connect to backend
const socket = io("http://localhost:5000");

/**
 * LiveNotifications component
 * @param stockName - The name of the stock to listen for updates
 */
const LiveNotifications: React.FC<LiveNotificationsProps> = ({ stockName }) => {
  const [liveUpdates, setLiveUpdates] = useState<Notification[]>([]);

  useEffect(() => {
    // Listen for new transactions
    socket.on("newTransaction", (transaction) => {
      if (transaction.stockName === stockName) {
        const newNotification: Notification = {
          id: transaction.id,
          message: `${transaction.quantity} stocks of ${
            transaction.stockName
          } ${transaction.type === "BUY" ? "bought" : "sold"}`,
          timestamp: new Date(transaction.timestamp).toLocaleTimeString(),
        };

        setLiveUpdates((prev) => [newNotification, ...prev]);
      }
    });

    // Cleanup listener on component unmount
    return () => {
      socket.off("newTransaction");
    };
  }, [stockName]);

  return (
    <div className="live-notifications">
      <ul className="live-notifications__list">
        {liveUpdates.length === 0 ? (
          <p className="live-notifications__empty">No live updates yet</p>
        ) : (
          liveUpdates.map((notification) => (
            <li key={notification.id} className="live-notifications__item">
              <span>{notification.message}</span>
              <span className="live-notifications__time">
                {notification.timestamp}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default LiveNotifications;
