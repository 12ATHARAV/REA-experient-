import { NextResponse } from 'next/server';

const messages: { id: number; name: string; message: string; created_at: string }[] = [];
let nextId = 2;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, message } = body;

    if (!name || !message) {
      return NextResponse.json({ error: 'Name and message required' }, { status: 400 });
    }

    // Block links
    const linkPattern = /(https?:\/\/|www\.)\S+|\b[a-z0-9-]+\.(com|net|org|in|co|io|me|xyz|info|biz|link|shop|online|site|tv|app|ai|gg|ly|to)\b/i;
    if (linkPattern.test(message)) {
      return NextResponse.json({ error: 'Links aren\'t allowed in chat messages.' }, { status: 400 });
    }

    const newMessage = {
      id: nextId++,
      name,
      message,
      created_at: new Date().toISOString()
    };
    messages.push(newMessage);

    return NextResponse.json({ id: newMessage.id, success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Message could not be sent. Please try again.' }, { status: 500 });
  }
}
