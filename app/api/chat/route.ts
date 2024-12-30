import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { openrouter } from '@openrouter/ai-sdk-provider';
import type { NextRequest } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const searchParams = req.nextUrl.searchParams;
  const modelName = searchParams.get('modelName') ?? '';

  // if modelName contains "gemini", use google, if it starts with gpt or starts with o, use openai, otherwise use openrouter
  let model: any;
  if (modelName.includes('gemini')) {
    model = google(modelName);
  } else if (modelName.startsWith('gpt') || modelName.startsWith('o')) {
    model = openai(modelName);
  } else {
    model = openrouter(modelName);
  }
  const result = streamText({
    model,
    messages,
  });

  return result.toDataStreamResponse({
    getErrorMessage: (error: any) => {
      console.log('error message for model', modelName, error);
      return error.message;
    },
  });
}
