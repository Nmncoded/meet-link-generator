"use client";

import { useAppSelector } from "../store/hooks";
import { format, parseISO } from "date-fns";

export default function MeetingHistory() {
  const { meetingLinks } = useAppSelector((state) => state.meetings);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Session Meeting History
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm uppercase">
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-left">Scheduled Time</th>
              <th className="px-4 py-3 text-left">Link</th>
            </tr>
          </thead>

          <tbody>
            {meetingLinks?.length > 0 ? (
              meetingLinks.map((meeting) => (
                <tr key={meeting.id} className="border-t text-gray-700 text-sm">
                  <td className="px-4 py-3">
                    {meeting.isScheduled ? "Scheduled" : "Instant"}
                  </td>
                  <td className="px-4 py-3">
                    {format(parseISO(meeting.timestamp), "MMM d, h:mm a")}
                  </td>
                  <td className="px-4 py-3">
                    {meeting.scheduledDateTime
                      ? format(
                          parseISO(meeting.scheduledDateTime),
                          "MMM d, h:mm a"
                        )
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={meeting.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline break-all"
                    >
                      {meeting.link}
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No meetings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
