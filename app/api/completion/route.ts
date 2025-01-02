import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  const { text: title } = await generateText({
    model: openai('gpt-4o-mini'),
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
    prompt: JSON.stringify({
      role: 'user',
      content: message,
    }),
  });

  // console.log('Generated title:"', title, '" for message:', message);

  return NextResponse.json({ title });
}
