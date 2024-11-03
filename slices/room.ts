import { RoomType } from "@models/room";
import { createSlice, PayloadAction, CaseReducer } from "@reduxjs/toolkit";

interface State {
  listRooms: RoomType[];
}

const initialState: State = {
  listRooms: [],
};

type CR<T> = CaseReducer<State, PayloadAction<T>>;

const slice = createSlice({
  name: "listRooms",
  initialState,
  reducers: {
    addRoom: (state, action: PayloadAction<RoomType>) => {
      state.listRooms.push(action.payload);
    },
    updateListRooms: (state, action: PayloadAction<RoomType[]>) => {
      state.listRooms = action.payload;
    },
    updateRoomById: (
      state,
      action: PayloadAction<{ id: string; updatedRoom: Partial<RoomType> }>
    ) => {
      const { id, updatedRoom } = action.payload;
      const index = state.listRooms.findIndex((room) => room._id === id);
      if (index !== -1) {
        state.listRooms[index] = {
          ...state.listRooms[index],
          ...updatedRoom,
        };
      }
    },
    removeRoomById: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.listRooms.findIndex((room) => room._id === id);
      if (index !== -1) {
        state.listRooms.splice(index, 1);
      }
    },
  },
});

export const { addRoom, updateListRooms, updateRoomById, removeRoomById } =
  slice.actions;

export default slice.reducer;
