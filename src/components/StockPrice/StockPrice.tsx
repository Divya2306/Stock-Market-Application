import React, { useEffect, useState } from "react";
import { Stock } from "../../interfaces";
import "./StockPrice.scss";

interface StockPriceProps {
  stock: Stock;
  setCurrentPrice: (price: number) => void;
}

const StockPrice: React.FC<StockPriceProps> = ({ stock, setCurrentPrice }) => {
  const [price, setPrice] = useState(stock.base_price);
  const [prevPrice, setPrevPrice] = useState(stock.base_price);
  const [priceChange, setPriceChange] = useState(0);

  useEffect(() => {
    setPrice(stock.base_price);
    setPrevPrice(stock.base_price);
    setPriceChange(0);
  }, [stock]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomChange = (Math.random() * 100 - 50).toFixed(2); // Random +/- 50
      const newPrice = Math.max(1, price + parseFloat(randomChange));
      setPrevPrice(price);
      setPrice(newPrice);
      setPriceChange(((newPrice - stock.base_price) / stock.base_price) * 100);
      setCurrentPrice(newPrice);
    }, 5000);
    return () => clearInterval(interval);
  }, [price, stock.base_price, setCurrentPrice]);

  return (
    <div className="stock-price">
      <span className="stock-price__label">Price</span>
      <span
        className={`stock-price__value ${price > prevPrice ? "up" : "down"}`}
      >
        {price.toFixed(2)}
      </span>
      {price > prevPrice ? (
        <span className="stock-price__icon up">&#x2191;</span>
      ) : (
        <span className="stock-price__icon down">&#x2193;</span>
      )}
      <span className="stock-price__change">{priceChange.toFixed(2)}%</span>
    </div>
  );
};

export default StockPrice;
