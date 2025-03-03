import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import {
  fetchTransactions,
  fetchUserTransactions,
} from "../../features/transactions/transactionsSlice";
import { Transaction } from "../../interfaces";
import Header from "../../components/Header/Header";
import "./PortfolioPage.scss";
import Pagination from "../../components/Pagination/Pagination";
import Spinner from "../../components/Spinner/Spinner";

const TRANSACTIONS_PER_PAGE = 10;

/**
 * Component to display the user's portfolio page with transaction history and filters.
 */
const PortfolioPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { userTransactions, portfolioTransactions, loading } = useSelector(
    (state: RootState) => state.transactions
  );

  const userTransactionStocks = [
    ...new Set(userTransactions.map((txn) => txn.stockName)),
  ];

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    startDate: "",
    endDate: "",
    stocksList: [] as string[],
  });

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchUserTransactions());
  }, [dispatch]);

  const allTransactions = [...userTransactions, ...portfolioTransactions];

  /**
   * Filters transactions based on the applied filters.
   */
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((transaction) => {
      const stockName = transaction.stockName.toLowerCase();
      const stockSymbol = transaction.stockSymbol.toLowerCase();
      const searchQuery = filters.search.toLowerCase();

      const matchesSearch =
        !filters.search ||
        stockName.includes(searchQuery) ||
        stockSymbol.includes(searchQuery);
      const matchesStatus = filters.status
        ? transaction.status === filters.status
        : true;
      const matchesStock = filters.stocksList.length
        ? filters.stocksList.includes(transaction.stockName)
        : true;

      const transactionDate = new Date(transaction.timestamp);
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;

      const matchesDate =
        (!startDate || transactionDate >= startDate) &&
        (!endDate || transactionDate <= endDate);

      return matchesSearch && matchesStatus && matchesStock && matchesDate;
    });
  }, [filters, allTransactions]);

  /**
   * Groups transactions by date.
   */
  const groupedTransactions = useMemo(() => {
    const grouped: { [key: string]: Transaction[] } = {};

    filteredTransactions.forEach((transaction) => {
      const date = new Date(transaction.timestamp).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(transaction);
    });

    const sortedGrouped = Object.entries(grouped).map(
      ([date, transactions]) => ({
        date,
        transactions: transactions.sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        ),
      })
    );

    return sortedGrouped.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [filteredTransactions]);

  // Pagination Logic
  const startIndex = (currentPage - 1) * TRANSACTIONS_PER_PAGE;
  const paginatedTransactions = groupedTransactions.slice(
    startIndex,
    startIndex + TRANSACTIONS_PER_PAGE
  );

  const handleClearFilters = () => {
    setFilters({
      search: "",
      status: "",
      startDate: "",
      endDate: "",
      stocksList: [],
    });
    setCurrentPage(1);
  };

  return (
    <div className="portfolio-page">
      <Header />
      <div className="portfolio-page__container">
        <div className="portfolio-page__filters">
          <div className="filter-header">
            <h2>Filters</h2>
            <button
              className="portfolio-page__clear"
              onClick={handleClearFilters}
            >
              Clear All
            </button>
          </div>
          <div className="portfolio-page__search">
            <input
              type="text"
              className="search"
              placeholder="Search for a Stock"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>

          <div className="portfolio-page__date-picker">
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
              placeholder="Start Date"
            />
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
              placeholder="End Date"
            />
          </div>

          <div className="portfolio-page__checkbox-list">
            <div className="passed-failed">
              <label>
                <input
                  type="checkbox"
                  checked={filters.status === "SUCCESS"}
                  onChange={() =>
                    setFilters({
                      ...filters,
                      status: filters.status === "SUCCESS" ? "" : "SUCCESS",
                    })
                  }
                />
                Passed
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={filters.status === "FAILED"}
                  onChange={() =>
                    setFilters({
                      ...filters,
                      status: filters.status === "FAILED" ? "" : "FAILED",
                    })
                  }
                />
                Failed
              </label>
            </div>
            <div className="stock-filter">
              {userTransactionStocks.map((stock_name) => (
                <label key={stock_name}>
                  <input
                    type="checkbox"
                    checked={filters.stocksList.includes(stock_name)}
                    onChange={() => {
                      setFilters((prev) => ({
                        ...prev,
                        stocksList: prev.stocksList.includes(stock_name)
                          ? prev.stocksList.filter((s) => s !== stock_name)
                          : [...prev.stocksList, stock_name],
                      }));
                    }}
                  />
                  <span
                    style={{
                      fontWeight: filters.stocksList.includes(stock_name)
                        ? "bold"
                        : "normal",
                      opacity:
                        filters.stocksList.length &&
                        !filters.stocksList.includes(stock_name)
                          ? 0.7
                          : 1,
                    }}
                  >
                    {stock_name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="portfolio-page__transactions">
          {loading ? (
            <Spinner />
          ) : paginatedTransactions.length === 0 ? (
            <p>No transactions found.</p>
          ) : (
            paginatedTransactions.map(({ date, transactions }) => (
              <div key={date} className="portfolio-page__group">
                <h3>{date}</h3>
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="portfolio-page__transaction"
                  >
                    <span>{transaction.stockName}</span>
                    <span>{transaction.stockSymbol}</span>
                    <span>&#8377;{transaction.price.toFixed(2)}</span>
                    <div className="portfolio-page__transaction--time">
                      <span>
                        {new Date(transaction.timestamp).toLocaleTimeString()}
                      </span>
                      <span
                        className={`portfolio-page__status-dot ${
                          transaction.status === "SUCCESS"
                            ? "portfolio-page__status-dot--success"
                            : "portfolio-page__status-dot--failed"
                        }`}
                      ></span>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}

          <Pagination
            currentPage={currentPage}
            totalStocks={filteredTransactions.length}
            stocksPerPage={TRANSACTIONS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
