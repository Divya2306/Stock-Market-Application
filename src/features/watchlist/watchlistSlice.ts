import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WatchlistState } from "../../interfaces";

const initialState: WatchlistState = {
  watchlist: [],
};

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    /**
     * Adds a stock to the watchlist.
     * @param state - The current state of the watchlist.
     * @param action - The action containing the stock name to add.
     */
    addToWatchlist: (state, action: PayloadAction<string>) => {
      if (!state.watchlist.includes(action.payload)) {
        state.watchlist.push(action.payload);
      }
    },
    /**
     * Removes a stock from the watchlist.
     * @param state - The current state of the watchlist.
     * @param action - The action containing the stock name to remove.
     */
    removeFromWatchlist: (state, action: PayloadAction<string>) => {
      state.watchlist = state.watchlist.filter(
        (name) => name !== action.payload
      );
    },
  },
});

export const { addToWatchlist, removeFromWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;
