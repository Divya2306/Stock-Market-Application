import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  walletBalance: number;
}

const initialState: UserState = {
  walletBalance: 100000, // Default balance
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    /**
     * Updates the wallet balance.
     * @param state - The current state of the user.
     * @param action - The action containing the new wallet balance.
     */
    updateWalletBalance: (state, action: PayloadAction<number>) => {
      state.walletBalance = action.payload;
      console.log("Updated wallet balance:", action.payload);
    },
  },
});

export const { updateWalletBalance } = userSlice.actions;
export default userSlice.reducer;
