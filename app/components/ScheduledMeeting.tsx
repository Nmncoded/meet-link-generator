import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { useAppDispatch } from "../store/hooks";
import { meetingSuccess, meetingFailure } from "../store/meetingSlice";

export default function ScheduledMeeting() {
  const dispatch = useAppDispatch();
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [emails, setEmails] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const handleCreateMeeting = async () => {
    if (!scheduledDate) {
      alert("Please select a date and time");
      return;
    }

    // Regular expression for validating email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Validate and filter emails
    const emailList = emails
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email.length > 0); // Remove empty entries

    const invalidEmails = emailList.filter((email) => !emailRegex.test(email));

    if (invalidEmails.length > 0) {
      alert(`Invalid email(s) detected: ${invalidEmails.join(", ")}`);
      return;
    }

    if (!emails || !(emailList.length > 0)) {
      alert(`Enter at least one valid participant email`);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/meeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scheduledDateTime: scheduledDate.toISOString(),
          attendees: emailList || [], // Send only valid emails
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create meeting");
      }

      const data = await response.json();
      setLoading(false);
      dispatch(meetingSuccess(data));
      setMeetingLink(data.link);
      setScheduledTime(format(scheduledDate, "PPpp"));
    } catch (error) {
      dispatch(
        meetingFailure(error instanceof Error ? error.message : "Unknown error")
      );
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

      {/* Email Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Invite Participants (comma-separated emails)
        </label>
        <input
          type="text"
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          placeholder="Enter emails, separated by commas"
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        onClick={handleCreateMeeting}
        disabled={loading || !scheduledDate || !emails} 
        className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:bg-green-300"
      >
        {loading ? "Creating..." : "Create Scheduled Meeting"}
      </button>

      {meetingLink && (
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
