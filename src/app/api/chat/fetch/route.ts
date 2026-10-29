import { NextResponse } from 'next/server';

// In-memory message store (replace with DB in production)
const messages: { id: number; name: string; message: string; created_at: string }[] = [
  { id: 1, name: 'Deluxe Salon Admin', message: '📌 Deluxe Salon Admin : Please Support on QR...', created_at: new Date().toISOString() }
];

export async function GET() {
  return NextResponse.json({ messages, lastId: messages.length > 0 ? messages[messages.length - 1].id : 0 });
}
