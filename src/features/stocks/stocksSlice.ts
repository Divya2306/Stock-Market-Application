import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Stock, StocksState } from "../../interfaces";

const API_URL =
  "https://stockmarket-data-kdu.s3.ap-south-1.amazonaws.com/stocks.json";
let cachedStocks: Stock[] | null = null;

// Initial state
const initialState: StocksState = {
  stocks: [],
  loading: false,
  error: null,
};

/**
 * Async Thunk to fetch stock data.
 */
export const fetchStocks = createAsyncThunk("stocks/fetchStocks", async () => {
  if (cachedStocks) {
    return cachedStocks;
  }
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Failed to fetch stocks");
  const data = (await response.json()) as Stock[];
  cachedStocks = data;
  return data;
});

const stocksSlice = createSlice({
  name: "stocks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.loading = false;
        state.stocks = action.payload;
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default stocksSlice.reducer;
