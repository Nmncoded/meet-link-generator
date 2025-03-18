/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { format } from 'date-fns';

interface MeetingLink {
  id: string;
  link: string;
  timestamp: string;
  isScheduled: boolean;
  scheduledDateTime?: string;
}

interface MeetingState {
  meetingLinks: MeetingLink[];
  loading: boolean;
  error: string | null;
}

const initialState: MeetingState = {
  meetingLinks: [],
  loading: false,
  error: null,
};

const meetingSlice = createSlice({
  name: 'meetings',
  initialState,
  reducers: {
    createInstantMeeting: (state) => {
      state.loading = true;
      state.error = null;
    },
    createScheduledMeeting: (state, action: PayloadAction<Date>) => {
      state.loading = true;
      state.error = null;
    },
    meetingSuccess: (state, action: PayloadAction<MeetingLink>) => {
      state.meetingLinks.push(action.payload);
      state.loading = false;
    },
    meetingFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { 
  createInstantMeeting, 
  createScheduledMeeting, 
  meetingSuccess, 
  meetingFailure 
} = meetingSlice.actions;

export default meetingSlice.reducer;