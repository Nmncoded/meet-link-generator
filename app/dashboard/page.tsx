"use client";

import AuthCheck from "../components/AuthCheck";
import InstantMeeting from "../components/InstantMeeting";
import ScheduledMeeting from "../components/ScheduledMeeting";
import MeetingHistory from "../components/MeetingHistory";
import AuthButton from "../components/AuthButton";

export default function Dashboard() {
  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <AuthButton />
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid md:grid-cols-2 gap-6">
            <InstantMeeting />
            <ScheduledMeeting />
          </div>
          
          <MeetingHistory />
        </main>
      </div>
    </AuthCheck>
  );
}