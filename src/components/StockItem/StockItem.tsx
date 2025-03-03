import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWatchlist,
  removeFromWatchlist,
} from "../../features/watchlist/watchlistSlice";
import { Link } from "react-router-dom";
import { RootState } from "../../store/store";
import { Stock } from "../../interfaces";
import { FaPlus, FaCheck, FaTimes } from "react-icons/fa";
import "./StockItem.scss";

interface StockItemProps {
  stock: Stock;
}

/**
 * Component to display a single stock item with actions to add/remove from watchlist.
 * @param stock - The stock data to display.
 */
const StockItem: React.FC<StockItemProps> = ({ stock }) => {
  const dispatch = useDispatch();
  const watchlist = useSelector(
    (state: RootState) => state.watchlist.watchlist
  );
  const isInWatchlist = watchlist.includes(stock.stock_name);
  const [hovered, setHovered] = useState(false);

  return (
    <tr className="stock-item">
      <td className="stock-item__name">
        <Link to={`/stock/${stock.stock_name}`} className="stock-item__link">
          {stock.stock_name}
        </Link>
      </td>
      <td className="stock-item__price">₹{stock.base_price.toFixed(2)}</td>
      <td
        className="stock-item__actions"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {isInWatchlist ? (
          hovered ? (
            <FaTimes
              className="stock-item__icon stock-item__icon--remove"
              onClick={() => dispatch(removeFromWatchlist(stock.stock_name))}
            />
          ) : (
            <FaCheck className="stock-item__icon stock-item__icon--added" />
          )
        ) : (
          <FaPlus
            className="stock-item__icon stock-item__icon--add"
            onClick={() => dispatch(addToWatchlist(stock.stock_name))}
          />
        )}
      </td>
    </tr>
  );
};

export default StockItem;
