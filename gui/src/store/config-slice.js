import { createSlice } from '@reduxjs/toolkit';

const configSlice = createSlice({
  name: 'config',
  initialState: {
    DICE_GAME_API: ''
  },
  reducers: {
    init(state, action) {
        state.DICE_GAME_API = action.payload.DICE_GAME_API 
    },
}
});

export const configActions = configSlice.actions;

export default configSlice;