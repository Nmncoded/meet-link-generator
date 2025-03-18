/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { v4 as uuidv4 } from 'uuid';
import { google } from 'googleapis';
import { authOptions } from '../auth/[...nextauth]/authOptions';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.NEXTAUTH_URL + '/api/auth/callback/google'
);

async function getAccessToken(session: any) {
  if (!session.accessToken) {
    throw new Error('No access token found in session');
  }
  oauth2Client.setCredentials({
    access_token: session.accessToken,
  });
  return oauth2Client;
}

function generateMeetId() {
  const meetId = Math.random().toString(36).substring(2, 15);
  return meetId;
}

async function createGoogleCalendarEvent(
  auth: any,
  scheduledDateTime?: string | null,
  summary: string = 'Scheduled Meeting'
) {
  const calendar = google.calendar({ version: 'v3', auth });

  const startDateTime = scheduledDateTime ? new Date(scheduledDateTime) : new Date();
  const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

  const event = {
    summary,
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: 'UTC',
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: 'UTC',
    },
    conferenceData: {
      createRequest: {
        requestId: generateMeetId(),
        conferenceSolutionKey: {
          type: 'hangoutsMeet',
        },
      },
    },
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
    conferenceDataVersion: 1,
  });

  return response.data;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);


    // Check authentication
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { scheduledDateTime } = body;

    // Authenticate with Google OAuth
    const auth = await getAccessToken(session);

    // Create a Google Calendar event with a Meet link
    const event = await createGoogleCalendarEvent(auth, scheduledDateTime);

    const timestamp = new Date().toISOString();

    return NextResponse.json({
      id: event.id,
      link: event.hangoutLink, // Google Meet link
      timestamp,
      isScheduled: !!scheduledDateTime,
      scheduledDateTime,
    });
  } catch (error) {
    console.error('Error creating meeting:', error);
    return NextResponse.json({ error: 'Failed to create meeting' }, { status: 500 });
  }
}