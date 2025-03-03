import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Transaction } from "../../interfaces";

interface TransactionsState {
  userTransactions: Transaction[];
  portfolioTransactions: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  userTransactions: [],
  portfolioTransactions: [],
  loading: false,
  error: null,
};

/**
 * Fetch transactions from API.
 */
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async () => {
    const response = await fetch(
      "https://stockmarket-data-kdu.s3.ap-south-1.amazonaws.com/portfolio-transactions.json"
    );
    if (!response.ok) throw new Error("Failed to fetch transactions.");
    const apiTransactions = await response.json();

    // Map API response to match our Transaction type
    const formattedTransactions: Transaction[] = apiTransactions.map(
      (apiTx: any) => ({
        id: `${apiTx.stock_name}-${Date.now()}`,
        stockName: apiTx.stock_name,
        stockSymbol: apiTx.stock_symbol,
        type: "BUY", // Default type (since API doesn't provide it)
        quantity: 0, // Default to 0 (API doesn't provide it)
        price: apiTx.transaction_price,
        timestamp: apiTx.timestamp,
        status: apiTx.status.toUpperCase() as "SUCCESS" | "FAILED",
      })
    );

    return formattedTransactions;
  }
);

/**
 * Fetch user transactions from backend (Local Data).
 */
export const fetchUserTransactions = createAsyncThunk(
  "transactions/fetchUserTransactions",
  async () => {
    const response = await fetch("http://localhost:5000/api/transactions");
    if (!response.ok) throw new Error("Failed to fetch user transactions.");
    return await response.json();
  }
);

/**
 * Store transaction on Node.js Server.
 */
export const storeTransaction = createAsyncThunk(
  "transactions/storeTransaction",
  async (transaction: Transaction) => {
    const response = await fetch("http://localhost:5000/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaction),
    });

    if (!response.ok) throw new Error("Failed to store transaction.");
    return await response.json();
  }
);

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    /**
     * Adds a new transaction to the user transactions.
     * @param state - The current state of transactions.
     * @param action - The action containing the new transaction.
     */
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.userTransactions.unshift(action.payload);
    },
    /**
     * Clears all user transactions.
     * @param state - The current state of transactions.
     */
    clearTransactions: (state) => {
      state.userTransactions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.portfolioTransactions = action.payload.reverse();
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch transactions.";
      })
      .addCase(fetchUserTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.userTransactions = action.payload.reverse();
      })
      .addCase(fetchUserTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch user transactions.";
      })
      .addCase(storeTransaction.fulfilled, (state, action) => {
        state.userTransactions.unshift(action.payload);
      });
  },
});

export const { addTransaction, clearTransactions } = transactionsSlice.actions;
export default transactionsSlice.reducer;
