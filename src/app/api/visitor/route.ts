import { NextResponse } from 'next/server';

let visitorCount = Math.floor(Math.random() * 5000) + 1000;

export async function GET() {
  visitorCount += Math.floor(Math.random() * 3);
  return NextResponse.json({ count: visitorCount });
}
