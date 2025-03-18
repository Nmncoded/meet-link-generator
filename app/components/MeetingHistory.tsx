"use client";

import { useAppSelector } from "../store/hooks";
import { format, parseISO } from "date-fns";

export default function MeetingHistory() {
  const { meetingLinks } = useAppSelector((state) => state.meetings);
  
  if (meetingLinks.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4">Session Meeting History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Type</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Created</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Scheduled Time</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Link</th>
            </tr>
          </thead>
          <tbody>
            {meetingLinks.map((meeting) => (
              <tr key={meeting.id} className="border-t">
                <td className="px-4 py-2">{meeting.isScheduled ? "Scheduled" : "Instant"}</td>
                <td className="px-4 py-2">
                  {format(parseISO(meeting.timestamp), "MMM d, h:mm a")}
                </td>
                <td className="px-4 py-2">
                  {meeting.scheduledDateTime 
                    ? format(parseISO(meeting.scheduledDateTime), "MMM d, h:mm a") 
                    : "-"}
                </td>
                <td className="px-4 py-2">
                  <a 
                    href={meeting.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {meeting.link}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}