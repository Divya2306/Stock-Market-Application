import React, { useEffect, useState, useRef } from "react";
import "./StockGraph.scss";

interface StockGraphProps {
  price: number;
  selectedStock: string;
}

interface Bar {
  id: number;
  height: number;
  isPositive: boolean;
}

const BAR_WIDTH = 20;

/**
 * Component to display a dynamic stock price graph.
 * @param price - The current stock price.
 */
const StockGraph: React.FC<StockGraphProps> = ({ price, selectedStock }) => {
  const [bars, setBars] = useState<Bar[]>([]);
  const [prevPrice, setPrevPrice] = useState(price);
  const graphRef = useRef<HTMLDivElement>(null);

  // Dynamically adjust max Y-axis value based on highest price
  const maxYValue =
    Math.ceil((Math.max(...bars.map((b) => b.height), price) + 100) / 100) *
    100;

  useEffect(() => {
    setBars([]);
    setPrevPrice(price);
  }, [selectedStock]);

  useEffect(() => {
    const interval = setInterval(() => {
      const isPositive = price >= prevPrice;
      const heightChange = price;
      setPrevPrice(price);

      setBars((prevBars) => [
        ...prevBars,
        { id: prevBars.length, height: heightChange, isPositive },
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, [price, prevPrice]);

  useEffect(() => {
    // Scroll graph to the right as new bars are added
    if (graphRef.current) {
      graphRef.current.scrollTo({
        left: graphRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [bars]);

  return (
    <div className="stock-graph">
      {/* Grid Background */}
      <div className="stock-graph__grid">
        {Array.from({ length: 5 }, (_, row) => (
          <div key={row} className="stock-graph__grid-row">
            {Array.from({ length: 10 }, (_, col) => (
              <div key={col} className="stock-graph__grid-cell"></div>
            ))}
          </div>
        ))}
      </div>

      {/* Graph Bars */}
      <div className="stock-graph__container" ref={graphRef}>
        {bars.map((bar) => (
          <div
            key={bar.id}
            className={`stock-graph__bar ${bar.isPositive ? "green" : "red"}`}
            style={{
              height: `${(bar.height / maxYValue) * 100}%`,
              width: `${BAR_WIDTH}px`,
            }}
          ></div>
        ))}
      </div>

      {/* Static X-Axis Labels */}
      <div className="stock-graph__x-axis">
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className="stock-graph__x-label">
            {i * 100}
          </span>
        ))}
      </div>
    </div>
  );
};

export default StockGraph;
