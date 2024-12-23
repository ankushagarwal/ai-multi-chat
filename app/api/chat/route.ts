// import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { openrouter } from "@openrouter/ai-sdk-provider";
import type { NextRequest } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const searchParams = req.nextUrl.searchParams;
  const modelName = searchParams.get("modelName") ?? "";

  const result = streamText({
    model: openrouter(modelName),
    messages,
  });

  return result.toDataStreamResponse();
}
