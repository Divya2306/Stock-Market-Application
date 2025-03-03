import { configureStore } from "@reduxjs/toolkit";
import stocksReducer from "../features/stocks/stocksSlice";
import watchlistReducer from "../features/watchlist/watchlistSlice";
import transactionsReducer from "../features/transactions/transactionsSlice";
import userReducer from "../features/user/userSlice";

/**
 * Configures the Redux store with the specified reducers.
 */
export const store = configureStore({
  reducer: {
    stocks: stocksReducer,
    watchlist: watchlistReducer,
    transactions: transactionsReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
