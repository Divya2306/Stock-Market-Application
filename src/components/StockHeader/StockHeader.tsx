import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import "./StockHeader.scss";

interface StockHeaderProps {
  selectedStock: string;
  onStockChange: (stockName: string, stockPrice: number) => void;
}

/**
 * Component to display the stock header with a dropdown to select different stocks.
 * @param selectedStock - The currently selected stock.
 * @param onStockChange - Callback function to handle stock change.
 */
const StockHeader: React.FC<StockHeaderProps> = ({
  selectedStock,
  onStockChange,
}) => {
  const stocks = useSelector((state: RootState) => state.stocks.stocks);
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const stock = stocks.find((s) => s.stock_name === selectedStock);
  if (!stock) return null;

  return (
    <div className="stock-header">
      <div className="stock-header__dropdown">
        <button
          className="stock-header__button"
          onClick={() => setDropdownOpen(!isDropdownOpen)}
        >
          <span className="symbol">{stock.stock_symbol}</span>
          {selectedStock} <span className="down">v</span>
        </button>

        {isDropdownOpen && (
          <ul className="stock-header__list">
            {stocks.map((stock) => (
              <li
                key={stock.stock_name}
                className={`stock-header__item ${
                  stock.stock_name === selectedStock
                    ? "stock-header__item--active"
                    : ""
                }`}
                onClick={() => {
                  onStockChange(stock.stock_name, stock.base_price);
                  navigate(`/stock/${stock.stock_name}`);
                  setDropdownOpen(false);
                }}
              >
                <span className="symbol">{stock.stock_symbol}</span>
                {stock.stock_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StockHeader;
