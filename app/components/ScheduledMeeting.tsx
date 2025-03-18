"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { createScheduledMeeting, meetingSuccess, meetingFailure } from "../store/meetingSlice";

export default function ScheduledMeeting() {
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [showLink, setShowLink] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.meetings);

  const handleCreateMeeting = async () => {
    if (!scheduledDate) {
      alert("Please select a date and time");
      return;
    }

    try {
      dispatch(createScheduledMeeting(scheduledDate.toISOString()));
      
      const response = await fetch("/api/meeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scheduledDateTime: scheduledDate.toISOString(),
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create meeting");
      }
      
      const data = await response.json();
      dispatch(meetingSuccess(data));
      setMeetingLink(data.link);
      setScheduledTime(format(scheduledDate, "PPpp"));
      setShowLink(true);
    } catch (error) {
      dispatch(meetingFailure(error instanceof Error ? error.message : "Unknown error"));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Scheduled Meeting</h2>
      <p className="mb-4">Create a meeting for a future date and time</p>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Date and Time
        </label>
        <DatePicker
          selected={scheduledDate}
          onChange={(date) => setScheduledDate(date)}
          showTimeSelect
          dateFormat="MMMM d, yyyy h:mm aa"
          minDate={new Date()}
          className="w-full p-2 border rounded"
          placeholderText="Click to select date and time"
        />
      </div>
      
      <button
        onClick={handleCreateMeeting}
        disabled={loading || !scheduledDate}
        className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:bg-green-300"
      >
        {loading ? "Creating..." : "Create Scheduled Meeting"}
      </button>
      
      {showLink && (
        <div className="mt-4 p-4 bg-gray-50 rounded border">
          <p className="font-semibold mb-2">Your scheduled meeting:</p>
          <p className="text-gray-700 mb-2">
            <span className="font-medium">Time:</span> {scheduledTime}
          </p>
          <div className="flex items-center">
            <a 
              href={meetingLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline break-all mr-2"
            >
              {meetingLink}
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(meetingLink);
                alert("Link copied to clipboard!");
              }}
              className="p-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}