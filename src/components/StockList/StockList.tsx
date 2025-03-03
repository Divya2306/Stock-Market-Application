import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import StockItem from "../StockItem/StockItem";
import Spinner from "../Spinner/Spinner";
import "./StockList.scss";
import Pagination from "../Pagination/Pagination";

const STOCKS_PER_PAGE = 7;

interface StockListProps {
  activeTab: "explore" | "watchlist";
}

/**
 * Component to display a list of stocks with pagination.
 * @param activeTab - The currently active tab ("explore" or "watchlist").
 */
const StockList: React.FC<StockListProps> = ({ activeTab }) => {
  const { stocks, loading } = useSelector((state: RootState) => state.stocks);
  const watchlist = useSelector(
    (state: RootState) => state.watchlist.watchlist
  );
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Sort stocks alphabetically by name
  const sortedStocks = [...stocks].sort((a, b) =>
    a.stock_name.localeCompare(b.stock_name)
  );

  // Filter stocks based on the active tab
  const displayedStocks =
    activeTab === "watchlist"
      ? sortedStocks.filter((stock) => watchlist.includes(stock.stock_name))
      : sortedStocks;

  const startIndex = (currentPage - 1) * STOCKS_PER_PAGE;
  const paginatedStocks = displayedStocks.slice(
    startIndex,
    startIndex + STOCKS_PER_PAGE
  );

  return (
    <div className="stock-list">
      {loading ? (
        <Spinner />
      ) : (
        <>
          <table className="stock-list__table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Base Price</th>
                <th>Watchlist</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStocks.length > 0 ? (
                paginatedStocks.map((stock) => (
                  <StockItem key={stock.stock_name} stock={stock} />
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="stock-list__empty">
                    No stocks available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalStocks={displayedStocks.length}
            stocksPerPage={STOCKS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default StockList;
