// https://openrouter.ai/models?order=top-weekly
// https://platform.openai.com/docs/models
// https://ai.google.dev/gemini-api/docs/models/gemini
export const modelList = [
  // llama
  { name: 'meta-llama/llama-3.1-70b-instruct' },
  // anthropic
  { name: 'anthropic/claude-3.5-sonnet:beta' },
  { name: 'anthropic/claude-3.5-haiku:beta' },
  // openai
  { name: 'gpt-4o' },
  { name: 'gpt-4o-mini' },
  { name: 'o1' },
  { name: 'o1-mini' },
  { name: 'o3-mini' },
  // google
  { name: 'gemini-1.5-pro' },
  { name: 'gemini-1.5-flash' },
  { name: 'gemini-2.0-flash-exp' },
  // mistral
  { name: 'mistralai/mistral-nemo' },
  // deepseek
  { name: 'deepseek/deepseek-chat' },
];

export const initialModels = ['o1-mini', 'gpt-4o', 'gemini-1.5-pro'];
