import { configureStore } from '@reduxjs/toolkit';
import meetingReducer from './meetingSlice';

export const store = configureStore({
  reducer: {
    meetings: meetingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;