import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { openrouter } from '@openrouter/ai-sdk-provider';
import { groq } from '@ai-sdk/groq';
import { mistral } from '@ai-sdk/mistral';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

function addPrompt(modelName: string, messages: any[]) {
  if (modelName.startsWith('o')) {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        messages[i].content +=
          '. Use triple backticks for any code blocks in your response.';
        break;
      }
    }
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Hello World' });
}

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const searchParams = req.nextUrl.searchParams;
  const modelName = searchParams.get('modelName') ?? '';

  addPrompt(modelName, messages);

  // if modelName contains "gemini", use google, if it starts with gpt or starts with o, use openai, otherwise use openrouter
  let model: any;
  if (modelName.includes('gemini')) {
    model = google(modelName, {
      useSearchGrounding: true,
    });
  } else if (modelName.startsWith('gpt') || modelName.startsWith('o')) {
    model = openai(modelName);
  } else if (
    modelName === 'llama-3.3-70b-versatile' ||
    modelName === 'mixtral-8x7b-32768'
  ) {
    model = groq(modelName);
  } else if (
    modelName === 'open-mistral-nemo' ||
    modelName === 'codestral-latest'
  ) {
    model = mistral(modelName);
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
