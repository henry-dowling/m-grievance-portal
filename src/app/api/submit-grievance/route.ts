import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const grievance = formData.get('grievance') as string;
    const mood = formData.get('mood') as string;
    const severity = formData.get('severity') as string;
    const date = formData.get('date') as string;
    const username = formData.get('username') as string;
    const file = formData.get('screenshot') as File | null;
    if (!grievance || !username) {
      return NextResponse.json({ error: 'Missing grievance or username' }, { status: 400 });
    }
    const emailText = `New grievance submitted!\n\nFrom: ${username}\nMood: ${mood}\nSeverity: ${severity}\nDate: ${date}\n\nGrievance:\n${grievance}`;
    const attachments = [];
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      attachments.push({
        filename: file.name,
        content: Buffer.from(arrayBuffer),
        contentType: file.type,
      });
    }
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'henry@tryvolley.ai',
      subject: `New Grievance from ${username}`,
      text: emailText,
      attachments: attachments.length > 0 ? attachments : undefined,
    });
    return NextResponse.json({ status: 'ok' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
} 