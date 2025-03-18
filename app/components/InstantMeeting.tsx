"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { createInstantMeeting, meetingSuccess, meetingFailure } from "../store/meetingSlice";

export default function InstantMeeting() {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.meetings);
  const [showLink, setShowLink] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");

  const handleCreateMeeting = async () => {
    try {
      dispatch(createInstantMeeting());
      
      const response = await fetch("/api/meeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create meeting");
      }
      
      const data = await response.json();
      dispatch(meetingSuccess(data));
      setMeetingLink(data.link);
      setShowLink(true);
    } catch (error) {
      dispatch(meetingFailure(error instanceof Error ? error.message : "Unknown error"));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Instant Meeting</h2>
      <p className="mb-4">Generate a Google Meet link immediately</p>
      
      <button
        onClick={handleCreateMeeting}
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
      >
        {loading ? "Creating..." : "Create Instant Meeting"}
      </button>
      
      {showLink && (
        <div className="mt-4 p-4 bg-gray-50 rounded border">
          <p className="font-semibold mb-2">Your meeting link:</p>
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