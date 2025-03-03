import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import "./styles/global.scss";
import StockPage from "./pages/StockPage/StockPage";
import PortfolioPage from "./pages/PortfolioPage/PortfolioPage";

/**
 * Main application component that sets up routing for different pages.
 */
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/stock/:stockName" element={<StockPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/summarizer" element={<h1>Summarizer Page</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
