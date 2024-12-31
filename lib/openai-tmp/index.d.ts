import { LanguageModelV1, ProviderV1, EmbeddingModelV1, ImageModelV1 } from '@ai-sdk/provider';
import { FetchFunction } from '@ai-sdk/provider-utils';

type OpenAIChatModelId = 'o1' | 'o1-2024-12-17' | 'o1-mini' | 'o1-mini-2024-09-12' | 'o1-preview' | 'o1-preview-2024-09-12' | 'gpt-4o' | 'gpt-4o-2024-05-13' | 'gpt-4o-2024-08-06' | 'gpt-4o-2024-11-20' | 'gpt-4o-audio-preview' | 'gpt-4o-audio-preview-2024-10-01' | 'gpt-4o-audio-preview-2024-12-17' | 'gpt-4o-mini' | 'gpt-4o-mini-2024-07-18' | 'gpt-4-turbo' | 'gpt-4-turbo-2024-04-09' | 'gpt-4-turbo-preview' | 'gpt-4-0125-preview' | 'gpt-4-1106-preview' | 'gpt-4' | 'gpt-4-0613' | 'gpt-3.5-turbo-0125' | 'gpt-3.5-turbo' | 'gpt-3.5-turbo-1106' | (string & {});
interface OpenAIChatSettings {
    /**
  Modify the likelihood of specified tokens appearing in the completion.
  
  Accepts a JSON object that maps tokens (specified by their token ID in
  the GPT tokenizer) to an associated bias value from -100 to 100. You
  can use this tokenizer tool to convert text to token IDs. Mathematically,
  the bias is added to the logits generated by the model prior to sampling.
  The exact effect will vary per model, but values between -1 and 1 should
  decrease or increase likelihood of selection; values like -100 or 100
  should result in a ban or exclusive selection of the relevant token.
  
  As an example, you can pass {"50256": -100} to prevent the <|endoftext|>
  token from being generated.
  */
    logitBias?: Record<number, number>;
    /**
  Return the log probabilities of the tokens. Including logprobs will increase
  the response size and can slow down response times. However, it can
  be useful to better understand how the model is behaving.
  
  Setting to true will return the log probabilities of the tokens that
  were generated.
  
  Setting to a number will return the log probabilities of the top n
  tokens that were generated.
  */
    logprobs?: boolean | number;
    /**
  Whether to enable parallel function calling during tool use. Default to true.
     */
    parallelToolCalls?: boolean;
    /**
  Whether to use structured outputs. Defaults to false.
  
  When enabled, tool calls and object generation will be strict and follow the provided schema.
   */
    structuredOutputs?: boolean;
    /**
  Whether to use legacy function calling. Defaults to false.
  
  Required by some open source inference engines which do not support the `tools` API. May also
  provide a workaround for `parallelToolCalls` resulting in the provider buffering tool calls,
  which causes `streamObject` to be non-streaming.
  
  Prefer setting `parallelToolCalls: false` over this option.
  
  @deprecated this API is supported but deprecated by OpenAI.
     */
    useLegacyFunctionCalling?: boolean;
    /**
  A unique identifier representing your end-user, which can help OpenAI to
  monitor and detect abuse. Learn more.
  */
    user?: string;
    /**
  Automatically download images and pass the image as data to the model.
  OpenAI supports image URLs for public models, so this is only needed for
  private models or when the images are not publicly accessible.
  
  Defaults to `false`.
     */
    downloadImages?: boolean;
    /**
  Simulates streaming by using a normal generate call and returning it as a stream.
  Enable this if the model that you are using does not support streaming.
  
  Defaults to `false`.
     */
    simulateStreaming?: boolean;
    /**
  Reasoning effort for reasoning models. Defaults to `medium`.
     */
    reasoningEffort?: 'low' | 'medium' | 'high';
}

type OpenAICompletionModelId = 'gpt-3.5-turbo-instruct' | (string & {});
interface OpenAICompletionSettings {
    /**
  Echo back the prompt in addition to the completion.
     */
    echo?: boolean;
    /**
  Modify the likelihood of specified tokens appearing in the completion.
  
  Accepts a JSON object that maps tokens (specified by their token ID in
  the GPT tokenizer) to an associated bias value from -100 to 100. You
  can use this tokenizer tool to convert text to token IDs. Mathematically,
  the bias is added to the logits generated by the model prior to sampling.
  The exact effect will vary per model, but values between -1 and 1 should
  decrease or increase likelihood of selection; values like -100 or 100
  should result in a ban or exclusive selection of the relevant token.
  
  As an example, you can pass {"50256": -100} to prevent the <|endoftext|>
  token from being generated.
     */
    logitBias?: Record<number, number>;
    /**
  Return the log probabilities of the tokens. Including logprobs will increase
  the response size and can slow down response times. However, it can
  be useful to better understand how the model is behaving.
  
  Setting to true will return the log probabilities of the tokens that
  were generated.
  
  Setting to a number will return the log probabilities of the top n
  tokens that were generated.
     */
    logprobs?: boolean | number;
    /**
  The suffix that comes after a completion of inserted text.
     */
    suffix?: string;
    /**
  A unique identifier representing your end-user, which can help OpenAI to
  monitor and detect abuse. Learn more.
     */
    user?: string;
}

type OpenAICompletionConfig = {
    provider: string;
    compatibility: 'strict' | 'compatible';
    headers: () => Record<string, string | undefined>;
    url: (options: {
        modelId: string;
        path: string;
    }) => string;
    fetch?: FetchFunction;
};
declare class OpenAICompletionLanguageModel implements LanguageModelV1 {
    readonly specificationVersion = "v1";
    readonly defaultObjectGenerationMode: undefined;
    readonly modelId: OpenAICompletionModelId;
    readonly settings: OpenAICompletionSettings;
    private readonly config;
    constructor(modelId: OpenAICompletionModelId, settings: OpenAICompletionSettings, config: OpenAICompletionConfig);
    get provider(): string;
    private getArgs;
    doGenerate(options: Parameters<LanguageModelV1['doGenerate']>[0]): Promise<Awaited<ReturnType<LanguageModelV1['doGenerate']>>>;
    doStream(options: Parameters<LanguageModelV1['doStream']>[0]): Promise<Awaited<ReturnType<LanguageModelV1['doStream']>>>;
}

type OpenAIEmbeddingModelId = 'text-embedding-3-small' | 'text-embedding-3-large' | 'text-embedding-ada-002' | (string & {});
interface OpenAIEmbeddingSettings {
    /**
  Override the maximum number of embeddings per call.
     */
    maxEmbeddingsPerCall?: number;
    /**
  Override the parallelism of embedding calls.
      */
    supportsParallelCalls?: boolean;
    /**
  The number of dimensions the resulting output embeddings should have.
  Only supported in text-embedding-3 and later models.
     */
    dimensions?: number;
    /**
  A unique identifier representing your end-user, which can help OpenAI to
  monitor and detect abuse. Learn more.
  */
    user?: string;
}

type OpenAIImageModelId = 'dall-e-3' | 'dall-e-2' | (string & {});

interface OpenAIProvider extends ProviderV1 {
    (modelId: 'gpt-3.5-turbo-instruct', settings?: OpenAICompletionSettings): OpenAICompletionLanguageModel;
    (modelId: OpenAIChatModelId, settings?: OpenAIChatSettings): LanguageModelV1;
    /**
  Creates an OpenAI model for text generation.
     */
    languageModel(modelId: 'gpt-3.5-turbo-instruct', settings?: OpenAICompletionSettings): OpenAICompletionLanguageModel;
    languageModel(modelId: OpenAIChatModelId, settings?: OpenAIChatSettings): LanguageModelV1;
    /**
  Creates an OpenAI chat model for text generation.
     */
    chat(modelId: OpenAIChatModelId, settings?: OpenAIChatSettings): LanguageModelV1;
    /**
  Creates an OpenAI completion model for text generation.
     */
    completion(modelId: OpenAICompletionModelId, settings?: OpenAICompletionSettings): LanguageModelV1;
    /**
  Creates a model for text embeddings.
     */
    embedding(modelId: OpenAIEmbeddingModelId, settings?: OpenAIEmbeddingSettings): EmbeddingModelV1<string>;
    /**
  Creates a model for text embeddings.
  
  @deprecated Use `textEmbeddingModel` instead.
     */
    textEmbedding(modelId: OpenAIEmbeddingModelId, settings?: OpenAIEmbeddingSettings): EmbeddingModelV1<string>;
    /**
  Creates a model for text embeddings.
     */
    textEmbeddingModel(modelId: OpenAIEmbeddingModelId, settings?: OpenAIEmbeddingSettings): EmbeddingModelV1<string>;
    /**
  Creates a model for image generation.
     */
    image(modelId: OpenAIImageModelId): ImageModelV1;
}
interface OpenAIProviderSettings {
    /**
  Base URL for the OpenAI API calls.
       */
    baseURL?: string;
    /**
  API key for authenticating requests.
       */
    apiKey?: string;
    /**
  OpenAI Organization.
       */
    organization?: string;
    /**
  OpenAI project.
       */
    project?: string;
    /**
  Custom headers to include in the requests.
       */
    headers?: Record<string, string>;
    /**
  OpenAI compatibility mode. Should be set to `strict` when using the OpenAI API,
  and `compatible` when using 3rd party providers. In `compatible` mode, newer
  information such as streamOptions are not being sent. Defaults to 'compatible'.
     */
    compatibility?: 'strict' | 'compatible';
    /**
  Provider name. Overrides the `openai` default name for 3rd party providers.
     */
    name?: string;
    /**
  Custom fetch implementation. You can use it as a middleware to intercept requests,
  or to provide a custom fetch implementation for e.g. testing.
      */
    fetch?: FetchFunction;
}
/**
Create an OpenAI provider instance.
 */
declare function createOpenAI(options?: OpenAIProviderSettings): OpenAIProvider;
/**
Default OpenAI provider instance. It uses 'strict' compatibility mode.
 */
declare const openai: OpenAIProvider;

export { type OpenAIProvider, type OpenAIProviderSettings, createOpenAI, openai };
