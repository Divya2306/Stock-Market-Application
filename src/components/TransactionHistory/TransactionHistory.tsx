import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import "./TransactionHistory.scss";

interface TransactionHistoryProps {
  stockName: string;
}

/**
 * Component to display the transaction history for a specific stock.
 * @param stockName - The name of the stock.
 */
const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  stockName,
}) => {
  const transactions = useSelector(
    (state: RootState) => state.transactions.userTransactions
  )
    .filter((t) => t.stockName === stockName)
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  return (
    <div className="transaction-history">
      <h3>History</h3>
      {transactions.length === 0 ? (
        <p className="transaction-history__empty">No transactions yet</p>
      ) : (
        <ul className="transaction-history__list">
          {transactions.map((transaction) => (
            <li
              key={transaction.id}
              className={`transaction-history__item ${transaction.type.toLowerCase()}`}
            >
              <div className="transaction-history__details">
                <span>{transaction.quantity} stocks</span>
                <span className="date">
                  {new Date(transaction.timestamp).toUTCString()}
                </span>
              </div>
              <span className="transaction-history__type">
                {transaction.type === "BUY" ? "Buy" : "Sell"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransactionHistory;
