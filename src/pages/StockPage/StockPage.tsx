import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RootState, AppDispatch } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/Header/Header";
import StockHeader from "../../components/StockHeader/StockHeader";
import "./StockPage.scss";
import StockPrice from "../../components/StockPrice/StockPrice";
import StockActions from "../../components/StockActions/StockActions";
import TransactionHistory from "../../components/TransactionHistory/TransactionHistory";
import LiveNotifications from "../../components/LiveNotifications/LiveNotifications";
import StockGraph from "../../components/StockGraph/StockGraph";
import { fetchStocks } from "../../features/stocks/stocksSlice";

/**
 * Component to display the stock page with stock details, actions, and history.
 */
const StockPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { stocks } = useSelector((state: RootState) => state.stocks);
  const { stockName } = useParams<{ stockName: string }>();
  const [selectedStock, setSelectedStock] = useState(stockName || "");

  useEffect(() => {
    dispatch(fetchStocks());
  }, [dispatch]);

  const stock = stocks.find((s) => s.stock_name === selectedStock);

  const [currentPrice, setCurrentPrice] = useState(stock?.base_price || 0);

  useEffect(() => {
    const foundStock = stocks.find((s) => s.stock_name === selectedStock);
    if (foundStock) setCurrentPrice(foundStock.base_price);
  }, [selectedStock, stocks]);

  if (!stock) return <h2>Stock Not Found</h2>;

  /**
   * Handle stock change and update the current price.
   * @param stockName - The name of the selected stock.
   * @param stockPrice - The price of the selected stock.
   */
  const handleStockChange = (stockName: string, stockPrice: number) => {
    setSelectedStock(stockName);
    setCurrentPrice(stockPrice);
  };

  return (
    <div className="stock-page">
      <Header />
      <div className="stock-page__container">
        {/* Left Section */}
        <div className="stock-page__left">
          <div className="stock-page__left__header">
            <StockHeader
              selectedStock={selectedStock}
              onStockChange={handleStockChange}
            />
            <StockPrice stock={stock} setCurrentPrice={setCurrentPrice} />
            <StockActions
              stockName={stock.stock_name}
              stockPrice={currentPrice}
              stockSymbol={stock.stock_symbol}
            />
          </div>
          <div className="stock-page__graph">
            <StockGraph price={currentPrice} selectedStock={selectedStock} />
          </div>
        </div>

        {/* Right Section */}
        <div className="stock-page__right">
          <TransactionHistory stockName={selectedStock} />
          <LiveNotifications stockName={selectedStock} />
        </div>
      </div>
    </div>
  );
};

export default StockPage;
