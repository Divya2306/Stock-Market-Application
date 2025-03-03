import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { AppDispatch } from "../../store/store";
import { storeTransaction } from "../../features/transactions/transactionsSlice";
import { updateWalletBalance } from "../../features/user/userSlice";
import "./StockActions.scss";

interface StockActionsProps {
  stockName: string;
  stockPrice: number;
  stockSymbol: string;
}

/**
 * Component to handle buying and selling of stocks.
 * @param stockName - The name of the stock.
 * @param stockPrice - The current price of the stock.
 * @param stockSymbol - The symbol of the stock.
 * @param setTransactionMessage - Function to set the transaction message.
 */
const StockActions: React.FC<StockActionsProps> = ({
  stockName,
  stockPrice,
  stockSymbol,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const walletBalance = useSelector(
    (state: RootState) => state.user.walletBalance
  );
  const [quantity, setQuantity] = useState<number | null>(null);

  const totalCost = quantity ? quantity * stockPrice : 0;

  /**
   * Handles the transaction (buy/sell) of stocks.
   * @param type - The type of transaction ("BUY" or "SELL").
   */
  const handleTransaction = async (type: "BUY" | "SELL") => {
    if (type === "BUY" && totalCost > walletBalance) {
      window.alert("Insufficient balance!");
      return;
    }

    const newTransaction = {
      id: `${stockName}-${Date.now()}`,
      stockName,
      stockSymbol,
      type,
      quantity: quantity || 0,
      price: stockPrice,
      timestamp: new Date().toISOString(),
      status: "SUCCESS" as "SUCCESS" | "FAILED",
    };

    try {
      await dispatch(storeTransaction(newTransaction));
      const newBalance =
        type === "BUY" ? walletBalance - totalCost : walletBalance + totalCost;
      dispatch(updateWalletBalance(newBalance));
    } catch (error) {
      window.alert("Transaction Failed.");
    }
  };

  return (
    <div className="stock-actions">
      <input
        type="number"
        min="1"
        value={quantity || ""}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="stock-actions__input"
        placeholder="Enter QTY"
      />

      <button
        className="stock-actions__button buy"
        onClick={() => handleTransaction("BUY")}
      >
        BUY
      </button>
      <button
        className="stock-actions__button sell"
        onClick={() => handleTransaction("SELL")}
      >
        SELL
      </button>
    </div>
  );
};

export default StockActions;
