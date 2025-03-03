/**
 * Interface representing a stock.
 */
export interface Stock {
  stock_name: string;
  stock_symbol: string;
  base_price: number;
}

/**
 * Interface representing the state of stocks.
 */
export interface StocksState {
  stocks: Stock[];
  loading: boolean;
  error: string | null;
}

/**
 * Interface representing the state of the watchlist.
 */
export interface WatchlistState {
  watchlist: string[];
}

/**
 * Interface representing a transaction.
 */
export interface Transaction {
  id: string;
  stockName: string;
  stockSymbol: string;
  type: "BUY" | "SELL";
  quantity: number;
  price: number;
  timestamp: string;
  status: "SUCCESS" | "FAILED";
}
