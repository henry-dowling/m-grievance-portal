import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { grievance, mood, severity, date, username } = data;
    if (!grievance || !username) {
      return NextResponse.json({ error: 'Missing grievance or username' }, { status: 400 });
    }
    const emailText = `New grievance submitted!\n\nFrom: ${username}\nMood: ${mood}\nSeverity: ${severity}\nDate: ${date}\n\nGrievance:\n${grievance}`;
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'henry@tryvolley.ai',
      subject: `New Grievance from ${username}`,
      text: emailText,
    });
    return NextResponse.json({ status: 'ok' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
} 