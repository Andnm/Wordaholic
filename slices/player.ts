import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface State {
  staminas: number;
  coins: number;
}

const initialState: State = {
  staminas: 200,
  coins: 0,
};

const slice = createSlice({
  name: "player",
  initialState,
  reducers: {
    increaseStaminas: (state, action: PayloadAction<number>) => {
      state.staminas += action.payload;
    },
    decreaseStaminas: (state, action: PayloadAction<number>) => {
      state.staminas -= action.payload;
    },
    increaseCoins: (state, action: PayloadAction<number>) => {
      state.coins += action.payload;
    },
    decreaseCoins: (state, action: PayloadAction<number>) => {
      state.coins -= action.payload;
    },
  },
});

export const { increaseStaminas, decreaseStaminas, increaseCoins, decreaseCoins } = slice.actions;

export default slice.reducer;
