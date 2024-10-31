import { createSlice, PayloadAction, CaseReducer } from "@reduxjs/toolkit";

interface State {
  staminas: number;
  coins: number;
}

const initialState: State = {
  staminas: 200,
  coins: 0,
};

type CR<T> = CaseReducer<State, PayloadAction<T>>;

const slice = createSlice({
  name: "player",
  initialState,
  reducers: {
    updateStaminas: (state, action: PayloadAction<number>) => {
      state.staminas += action.payload;
    },
    updateCoins: (state, action: PayloadAction<number>) => {
      state.coins += action.payload;
    },
  },
});

export const { updateStaminas, updateCoins } = slice.actions;

export default slice.reducer;
