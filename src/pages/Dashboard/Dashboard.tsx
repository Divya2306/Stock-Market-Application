import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchStocks } from "../../features/stocks/stocksSlice";
import { AppDispatch } from "../../store/store";
import Header from "../../components/Header/Header";
import "./Dashboard.scss";
import Tabs from "../../components/Tabs/Tabs";
import StockList from "../../components/StockList/StockList";

/**
 * Component to display the dashboard with tabs and stock list.
 */
const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState<"explore" | "watchlist">(
    "explore"
  );

  useEffect(() => {
    dispatch(fetchStocks());
  }, [dispatch]);

  return (
    <div className="dashboard">
      <Header />
      <main className="dashboard__content">
        <Tabs onTabChange={setActiveTab} />
        <StockList activeTab={activeTab} />
      </main>
    </div>
  );
};

export default Dashboard;
