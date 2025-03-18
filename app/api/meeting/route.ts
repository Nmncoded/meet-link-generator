import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { v4 as uuidv4 } from 'uuid';

// Simulated Google Meet link generation
// In a real implementation, this would call the Google Calendar API
function generateMeetLink() {
  const meetId = Math.random().toString(36).substring(2, 12);
  return `https://meet.google.com/${meetId}`;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    // Check authentication
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const { scheduledDateTime } = body;
    
    const meetingId = uuidv4();
    const meetLink = generateMeetLink();
    const timestamp = new Date().toISOString();
    
    // If this were a real implementation, we would use the Google Calendar API
    // to create the meeting and get back a real meeting link
    
    return NextResponse.json({
      id: meetingId,
      link: meetLink,
      timestamp,
      isScheduled: !!scheduledDateTime,
      scheduledDateTime,
    });
    
  } catch (error) {
    console.error('Error creating meeting:', error);
    return NextResponse.json({ error: 'Failed to create meeting' }, { status: 500 });
  }
}