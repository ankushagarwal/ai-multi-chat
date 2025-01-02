// Temporary fix for using o3-mini
// Wait for PR https://github.com/vercel/ai/pull/4227 to get merged to get official support
import { openai } from '@/lib/openai-tmp';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { openrouter } from '@openrouter/ai-sdk-provider';
import type { NextRequest } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

function addPrompt(modelName: string, messages: any[]) {
  if (modelName.startsWith('o')) {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        messages[i].content +=
          ' For questions like coding or other long form questions, format your responses in markdown format.';
        break;
      }
    }
  }
}

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const searchParams = req.nextUrl.searchParams;
  const modelName = searchParams.get('modelName') ?? '';

  addPrompt(modelName, messages);

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
