'use strict';
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === 'object') || typeof from === 'function') {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        });
  }
  return to;
};
var __toCommonJS = (mod) =>
  __copyProps(__defProp({}, '__esModule', { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  createOpenAI: () => createOpenAI,
  openai: () => openai,
});
module.exports = __toCommonJS(src_exports);

// src/openai-provider.ts
var import_provider_utils7 = require('@ai-sdk/provider-utils');

// src/openai-chat-language-model.ts
var import_provider3 = require('@ai-sdk/provider');
var import_provider_utils3 = require('@ai-sdk/provider-utils');
var import_zod2 = require('zod');

// src/convert-to-openai-chat-messages.ts
var import_provider = require('@ai-sdk/provider');
var import_provider_utils = require('@ai-sdk/provider-utils');
function convertToOpenAIChatMessages({
  prompt,
  useLegacyFunctionCalling = false,
}) {
  const messages = [];
  for (const { role, content } of prompt) {
    switch (role) {
      case 'system': {
        messages.push({ role: 'system', content });
        break;
      }
      case 'user': {
        if (content.length === 1 && content[0].type === 'text') {
          messages.push({ role: 'user', content: content[0].text });
          break;
        }
        messages.push({
          role: 'user',
          content: content.map((part) => {
            var _a, _b, _c;
            switch (part.type) {
              case 'text': {
                return { type: 'text', text: part.text };
              }
              case 'image': {
                return {
                  type: 'image_url',
                  image_url: {
                    url:
                      part.image instanceof URL
                        ? part.image.toString()
                        : `data:${((_a = part.mimeType)) != null ? _a : 'image/jpeg'};base64,${(0, import_provider_utils.convertUint8ArrayToBase64)(part.image)}`,
                    // OpenAI specific extension: image detail
                    detail:
                      (_c =
                        (_b = part.providerMetadata) == null
                          ? void 0
                          : _b.openai) == null
                        ? void 0
                        : _c.imageDetail,
                  },
                };
              }
              case 'file': {
                if (part.data instanceof URL) {
                  throw new import_provider.UnsupportedFunctionalityError({
                    functionality:
                      "'File content parts with URL data' functionality not supported.",
                  });
                }
                switch (part.mimeType) {
                  case 'audio/wav': {
                    return {
                      type: 'input_audio',
                      input_audio: { data: part.data, format: 'wav' },
                    };
                  }
                  case 'audio/mp3':
                  case 'audio/mpeg': {
                    return {
                      type: 'input_audio',
                      input_audio: { data: part.data, format: 'mp3' },
                    };
                  }
                  default: {
                    throw new import_provider.UnsupportedFunctionalityError({
                      functionality: `File content part type ${part.mimeType} in user messages`,
                    });
                  }
                }
              }
            }
          }),
        });
        break;
      }
      case 'assistant': {
        let text = '';
        const toolCalls = [];
        for (const part of content) {
          switch (part.type) {
            case 'text': {
              text += part.text;
              break;
            }
            case 'tool-call': {
              toolCalls.push({
                id: part.toolCallId,
                type: 'function',
                function: {
                  name: part.toolName,
                  arguments: JSON.stringify(part.args),
                },
              });
              break;
            }
            default: {
              const _exhaustiveCheck = part;
              throw new Error(`Unsupported part: ${_exhaustiveCheck}`);
            }
          }
        }
        if (useLegacyFunctionCalling) {
          if (toolCalls.length > 1) {
            throw new import_provider.UnsupportedFunctionalityError({
              functionality:
                'useLegacyFunctionCalling with multiple tool calls in one message',
            });
          }
          messages.push({
            role: 'assistant',
            content: text,
            function_call:
              toolCalls.length > 0 ? toolCalls[0].function : void 0,
          });
        } else {
          messages.push({
            role: 'assistant',
            content: text,
            tool_calls: toolCalls.length > 0 ? toolCalls : void 0,
          });
        }
        break;
      }
      case 'tool': {
        for (const toolResponse of content) {
          if (useLegacyFunctionCalling) {
            messages.push({
              role: 'function',
              name: toolResponse.toolName,
              content: JSON.stringify(toolResponse.result),
            });
          } else {
            messages.push({
              role: 'tool',
              tool_call_id: toolResponse.toolCallId,
              content: JSON.stringify(toolResponse.result),
            });
          }
        }
        break;
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  return messages;
}

// src/map-openai-chat-logprobs.ts
function mapOpenAIChatLogProbsOutput(logprobs) {
  var _a, _b;
  return (_b =
    (_a = logprobs == null ? void 0 : logprobs.content) == null
      ? void 0
      : _a.map(({ token, logprob, top_logprobs }) => ({
          token,
          logprob,
          topLogprobs: top_logprobs
            ? top_logprobs.map(({ token: token2, logprob: logprob2 }) => ({
                token: token2,
                logprob: logprob2,
              }))
            : [],
        }))) != null
    ? _b
    : void 0;
}

// src/map-openai-finish-reason.ts
function mapOpenAIFinishReason(finishReason) {
  switch (finishReason) {
    case 'stop':
      return 'stop';
    case 'length':
      return 'length';
    case 'content_filter':
      return 'content-filter';
    case 'function_call':
    case 'tool_calls':
      return 'tool-calls';
    default:
      return 'unknown';
  }
}

// src/openai-error.ts
var import_zod = require('zod');
var import_provider_utils2 = require('@ai-sdk/provider-utils');
var openaiErrorDataSchema = import_zod.z.object({
  error: import_zod.z.object({
    message: import_zod.z.string(),
    // The additional information below is handled loosely to support
    // OpenAI-compatible providers that have slightly different error
    // responses:
    type: import_zod.z.string().nullish(),
    param: import_zod.z.any().nullish(),
    code: import_zod.z
      .union([import_zod.z.string(), import_zod.z.number()])
      .nullish(),
  }),
});
var openaiFailedResponseHandler = (0,
import_provider_utils2.createJsonErrorResponseHandler)({
  errorSchema: openaiErrorDataSchema,
  errorToMessage: (data) => data.error.message,
});

// src/get-response-metadata.ts
function getResponseMetadata({ id, model, created }) {
  return {
    id: id != null ? id : void 0,
    modelId: model != null ? model : void 0,
    timestamp: created != null ? new Date(created * 1e3) : void 0,
  };
}

// src/openai-prepare-tools.ts
var import_provider2 = require('@ai-sdk/provider');
function prepareTools({
  mode,
  useLegacyFunctionCalling = false,
  structuredOutputs,
}) {
  var _a;
  const tools = ((_a = mode.tools) == null ? void 0 : _a.length)
    ? mode.tools
    : void 0;
  const toolWarnings = [];
  if (tools == null) {
    return { tools: void 0, tool_choice: void 0, toolWarnings };
  }
  const toolChoice = mode.toolChoice;
  if (useLegacyFunctionCalling) {
    const openaiFunctions = [];
    for (const tool of tools) {
      if (tool.type === 'provider-defined') {
        toolWarnings.push({ type: 'unsupported-tool', tool });
      } else {
        openaiFunctions.push({
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters,
        });
      }
    }
    if (toolChoice == null) {
      return {
        functions: openaiFunctions,
        function_call: void 0,
        toolWarnings,
      };
    }
    const type2 = toolChoice.type;
    switch (type2) {
      case 'auto':
      case 'none':
      case void 0:
        return {
          functions: openaiFunctions,
          function_call: void 0,
          toolWarnings,
        };
      case 'required':
        throw new import_provider2.UnsupportedFunctionalityError({
          functionality: 'useLegacyFunctionCalling and toolChoice: required',
        });
      default:
        return {
          functions: openaiFunctions,
          function_call: { name: toolChoice.toolName },
          toolWarnings,
        };
    }
  }
  const openaiTools = [];
  for (const tool of tools) {
    if (tool.type === 'provider-defined') {
      toolWarnings.push({ type: 'unsupported-tool', tool });
    } else {
      openaiTools.push({
        type: 'function',
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters,
          strict: structuredOutputs ? true : void 0,
        },
      });
    }
  }
  if (toolChoice == null) {
    return { tools: openaiTools, tool_choice: void 0, toolWarnings };
  }
  const type = toolChoice.type;
  switch (type) {
    case 'auto':
    case 'none':
    case 'required':
      return { tools: openaiTools, tool_choice: type, toolWarnings };
    case 'tool':
      return {
        tools: openaiTools,
        tool_choice: {
          type: 'function',
          function: {
            name: toolChoice.toolName,
          },
        },
        toolWarnings,
      };
    default: {
      const _exhaustiveCheck = type;
      throw new import_provider2.UnsupportedFunctionalityError({
        functionality: `Unsupported tool choice type: ${_exhaustiveCheck}`,
      });
    }
  }
}

// src/openai-chat-language-model.ts
var OpenAIChatLanguageModel = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = 'v1';
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  get supportsStructuredOutputs() {
    var _a;
    return (_a = this.settings.structuredOutputs) != null ? _a : false;
  }
  get defaultObjectGenerationMode() {
    if (isAudioModel(this.modelId)) {
      return 'tool';
    }
    return this.supportsStructuredOutputs ? 'json' : 'tool';
  }
  get provider() {
    return this.config.provider;
  }
  get supportsImageUrls() {
    return !this.settings.downloadImages;
  }
  getArgs({
    mode,
    prompt,
    maxTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    stopSequences,
    responseFormat,
    seed,
    providerMetadata,
  }) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const type = mode.type;
    const warnings = [];
    if (topK != null) {
      warnings.push({
        type: 'unsupported-setting',
        setting: 'topK',
      });
    }
    if (
      (responseFormat == null ? void 0 : responseFormat.type) === 'json' &&
      responseFormat.schema != null &&
      !this.supportsStructuredOutputs
    ) {
      warnings.push({
        type: 'unsupported-setting',
        setting: 'responseFormat',
        details:
          'JSON response format schema is only supported with structuredOutputs',
      });
    }
    const useLegacyFunctionCalling = this.settings.useLegacyFunctionCalling;
    if (useLegacyFunctionCalling && this.settings.parallelToolCalls === true) {
      throw new import_provider3.UnsupportedFunctionalityError({
        functionality: 'useLegacyFunctionCalling with parallelToolCalls',
      });
    }
    if (useLegacyFunctionCalling && this.supportsStructuredOutputs) {
      throw new import_provider3.UnsupportedFunctionalityError({
        functionality: 'structuredOutputs with useLegacyFunctionCalling',
      });
    }
    const baseArgs = {
      // model id:
      model: this.modelId,
      // model specific settings:
      logit_bias: this.settings.logitBias,
      logprobs:
        this.settings.logprobs === true ||
        typeof this.settings.logprobs === 'number'
          ? true
          : void 0,
      top_logprobs:
        typeof this.settings.logprobs === 'number'
          ? this.settings.logprobs
          : typeof this.settings.logprobs === 'boolean'
            ? this.settings.logprobs
              ? 0
              : void 0
            : void 0,
      user: this.settings.user,
      parallel_tool_calls: this.settings.parallelToolCalls,
      // standardized settings:
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
      response_format:
        (responseFormat == null ? void 0 : responseFormat.type) === 'json'
          ? this.supportsStructuredOutputs && responseFormat.schema != null
            ? {
                type: 'json_schema',
                json_schema: {
                  schema: responseFormat.schema,
                  strict: true,
                  name: (_a = responseFormat.name) != null ? _a : 'response',
                  description: responseFormat.description,
                },
              }
            : { type: 'json_object' }
          : void 0,
      stop: stopSequences,
      seed,
      // openai specific settings:
      max_completion_tokens:
        (_b = providerMetadata == null ? void 0 : providerMetadata.openai) ==
        null
          ? void 0
          : _b.maxCompletionTokens,
      store:
        (_c = providerMetadata == null ? void 0 : providerMetadata.openai) ==
        null
          ? void 0
          : _c.store,
      metadata:
        (_d = providerMetadata == null ? void 0 : providerMetadata.openai) ==
        null
          ? void 0
          : _d.metadata,
      prediction:
        (_e = providerMetadata == null ? void 0 : providerMetadata.openai) ==
        null
          ? void 0
          : _e.prediction,
      reasoning_effort:
        (_g =
          (_f = providerMetadata == null ? void 0 : providerMetadata.openai) ==
          null
            ? void 0
            : _f.reasoningEffort) != null
          ? _g
          : this.settings.reasoningEffort,
      // messages:
      messages: convertToOpenAIChatMessages({
        prompt,
        useLegacyFunctionCalling,
      }),
    };
    if (isReasoningModel(this.modelId)) {
      baseArgs.temperature = void 0;
      baseArgs.top_p = void 0;
      baseArgs.frequency_penalty = void 0;
      baseArgs.presence_penalty = void 0;
    }
    switch (type) {
      case 'regular': {
        const { tools, tool_choice, functions, function_call, toolWarnings } =
          prepareTools({
            mode,
            useLegacyFunctionCalling,
            structuredOutputs: this.supportsStructuredOutputs,
          });
        return {
          args: {
            ...baseArgs,
            tools,
            tool_choice,
            functions,
            function_call,
          },
          warnings: [...warnings, ...toolWarnings],
        };
      }
      case 'object-json': {
        return {
          args: {
            ...baseArgs,
            response_format:
              this.supportsStructuredOutputs && mode.schema != null
                ? {
                    type: 'json_schema',
                    json_schema: {
                      schema: mode.schema,
                      strict: true,
                      name: (_h = mode.name) != null ? _h : 'response',
                      description: mode.description,
                    },
                  }
                : { type: 'json_object' },
          },
          warnings,
        };
      }
      case 'object-tool': {
        return {
          args: useLegacyFunctionCalling
            ? {
                ...baseArgs,
                function_call: {
                  name: mode.tool.name,
                },
                functions: [
                  {
                    name: mode.tool.name,
                    description: mode.tool.description,
                    parameters: mode.tool.parameters,
                  },
                ],
              }
            : {
                ...baseArgs,
                tool_choice: {
                  type: 'function',
                  function: { name: mode.tool.name },
                },
                tools: [
                  {
                    type: 'function',
                    function: {
                      name: mode.tool.name,
                      description: mode.tool.description,
                      parameters: mode.tool.parameters,
                      strict: this.supportsStructuredOutputs ? true : void 0,
                    },
                  },
                ],
              },
          warnings,
        };
      }
      default: {
        const _exhaustiveCheck = type;
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
      }
    }
  }
  async doGenerate(options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r;
    const { args: body, warnings } = this.getArgs(options);
    const { responseHeaders, value: response } = await (0,
    import_provider_utils3.postJsonToApi)({
      url: this.config.url({
        path: '/chat/completions',
        modelId: this.modelId,
      }),
      headers: (0, import_provider_utils3.combineHeaders)(
        this.config.headers(),
        options.headers,
      ),
      body,
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: (0,
      import_provider_utils3.createJsonResponseHandler)(
        openaiChatResponseSchema,
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch,
    });
    const { messages: rawPrompt, ...rawSettings } = body;
    const choice = response.choices[0];
    let providerMetadata;
    if (
      ((_b =
        (_a = response.usage) == null
          ? void 0
          : _a.completion_tokens_details) == null
        ? void 0
        : _b.reasoning_tokens) != null ||
      ((_d =
        (_c = response.usage) == null ? void 0 : _c.prompt_tokens_details) ==
      null
        ? void 0
        : _d.cached_tokens) != null
    ) {
      providerMetadata = { openai: {} };
      if (
        ((_f =
          (_e = response.usage) == null
            ? void 0
            : _e.completion_tokens_details) == null
          ? void 0
          : _f.reasoning_tokens) != null
      ) {
        providerMetadata.openai.reasoningTokens =
          (_h =
            (_g = response.usage) == null
              ? void 0
              : _g.completion_tokens_details) == null
            ? void 0
            : _h.reasoning_tokens;
      }
      if (
        ((_j =
          (_i = response.usage) == null ? void 0 : _i.prompt_tokens_details) ==
        null
          ? void 0
          : _j.cached_tokens) != null
      ) {
        providerMetadata.openai.cachedPromptTokens =
          (_l =
            (_k = response.usage) == null
              ? void 0
              : _k.prompt_tokens_details) == null
            ? void 0
            : _l.cached_tokens;
      }
    }
    return {
      text: (_m = choice.message.content) != null ? _m : void 0,
      toolCalls:
        this.settings.useLegacyFunctionCalling && choice.message.function_call
          ? [
              {
                toolCallType: 'function',
                toolCallId: (0, import_provider_utils3.generateId)(),
                toolName: choice.message.function_call.name,
                args: choice.message.function_call.arguments,
              },
            ]
          : (_n = choice.message.tool_calls) == null
            ? void 0
            : _n.map((toolCall) => {
                var _a2;
                return {
                  toolCallType: 'function',
                  toolCallId:
                    (_a2 = toolCall.id) != null
                      ? _a2
                      : (0, import_provider_utils3.generateId)(),
                  toolName: toolCall.function.name,
                  args: toolCall.function.arguments,
                };
              }),
      finishReason: mapOpenAIFinishReason(choice.finish_reason),
      usage: {
        promptTokens:
          (_p = (_o = response.usage) == null ? void 0 : _o.prompt_tokens) !=
          null
            ? _p
            : NaN,
        completionTokens:
          (_r =
            (_q = response.usage) == null ? void 0 : _q.completion_tokens) !=
          null
            ? _r
            : NaN,
      },
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      request: { body: JSON.stringify(body) },
      response: getResponseMetadata(response),
      warnings,
      logprobs: mapOpenAIChatLogProbsOutput(choice.logprobs),
      providerMetadata,
    };
  }
  async doStream(options) {
    if (this.settings.simulateStreaming) {
      const result = await this.doGenerate(options);
      const simulatedStream = new ReadableStream({
        start(controller) {
          controller.enqueue({ type: 'response-metadata', ...result.response });
          if (result.text) {
            controller.enqueue({
              type: 'text-delta',
              textDelta: result.text,
            });
          }
          if (result.toolCalls) {
            for (const toolCall of result.toolCalls) {
              controller.enqueue({
                type: 'tool-call',
                ...toolCall,
              });
            }
          }
          controller.enqueue({
            type: 'finish',
            finishReason: result.finishReason,
            usage: result.usage,
            logprobs: result.logprobs,
            providerMetadata: result.providerMetadata,
          });
          controller.close();
        },
      });
      return {
        stream: simulatedStream,
        rawCall: result.rawCall,
        rawResponse: result.rawResponse,
        warnings: result.warnings,
      };
    }
    const { args, warnings } = this.getArgs(options);
    const body = {
      ...args,
      stream: true,
      // only include stream_options when in strict compatibility mode:
      stream_options:
        this.config.compatibility === 'strict'
          ? { include_usage: true }
          : void 0,
    };
    const { responseHeaders, value: response } = await (0,
    import_provider_utils3.postJsonToApi)({
      url: this.config.url({
        path: '/chat/completions',
        modelId: this.modelId,
      }),
      headers: (0, import_provider_utils3.combineHeaders)(
        this.config.headers(),
        options.headers,
      ),
      body,
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: (0,
      import_provider_utils3.createEventSourceResponseHandler)(
        openaiChatChunkSchema,
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch,
    });
    const { messages: rawPrompt, ...rawSettings } = args;
    const toolCalls = [];
    let finishReason = 'unknown';
    let usage = {
      promptTokens: void 0,
      completionTokens: void 0,
    };
    let logprobs;
    let isFirstChunk = true;
    const { useLegacyFunctionCalling } = this.settings;
    let providerMetadata;
    return {
      stream: response.pipeThrough(
        new TransformStream({
          transform(chunk, controller) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
            if (!chunk.success) {
              finishReason = 'error';
              controller.enqueue({ type: 'error', error: chunk.error });
              return;
            }
            const value = chunk.value;
            if ('error' in value) {
              finishReason = 'error';
              controller.enqueue({ type: 'error', error: value.error });
              return;
            }
            if (isFirstChunk) {
              isFirstChunk = false;
              controller.enqueue({
                type: 'response-metadata',
                ...getResponseMetadata(value),
              });
            }
            if (value.usage != null) {
              usage = {
                promptTokens:
                  (_a = value.usage.prompt_tokens) != null ? _a : void 0,
                completionTokens:
                  (_b = value.usage.completion_tokens) != null ? _b : void 0,
              };
              const {
                completion_tokens_details: completionTokenDetails,
                prompt_tokens_details: promptTokenDetails,
              } = value.usage;
              if (
                (completionTokenDetails == null
                  ? void 0
                  : completionTokenDetails.reasoning_tokens) != null ||
                (promptTokenDetails == null
                  ? void 0
                  : promptTokenDetails.cached_tokens) != null
              ) {
                providerMetadata = { openai: {} };
                if (
                  (completionTokenDetails == null
                    ? void 0
                    : completionTokenDetails.reasoning_tokens) != null
                ) {
                  providerMetadata.openai.reasoningTokens =
                    completionTokenDetails == null
                      ? void 0
                      : completionTokenDetails.reasoning_tokens;
                }
                if (
                  (promptTokenDetails == null
                    ? void 0
                    : promptTokenDetails.cached_tokens) != null
                ) {
                  providerMetadata.openai.cachedPromptTokens =
                    promptTokenDetails == null
                      ? void 0
                      : promptTokenDetails.cached_tokens;
                }
              }
            }
            const choice = value.choices[0];
            if ((choice == null ? void 0 : choice.finish_reason) != null) {
              finishReason = mapOpenAIFinishReason(choice.finish_reason);
            }
            if ((choice == null ? void 0 : choice.delta) == null) {
              return;
            }
            const delta = choice.delta;
            if (delta.content != null) {
              controller.enqueue({
                type: 'text-delta',
                textDelta: delta.content,
              });
            }
            const mappedLogprobs = mapOpenAIChatLogProbsOutput(
              choice == null ? void 0 : choice.logprobs,
            );
            if (mappedLogprobs == null ? void 0 : mappedLogprobs.length) {
              if (logprobs === void 0) logprobs = [];
              logprobs.push(...mappedLogprobs);
            }
            const mappedToolCalls =
              useLegacyFunctionCalling && delta.function_call != null
                ? [
                    {
                      type: 'function',
                      id: (0, import_provider_utils3.generateId)(),
                      function: delta.function_call,
                      index: 0,
                    },
                  ]
                : delta.tool_calls;
            if (mappedToolCalls != null) {
              for (const toolCallDelta of mappedToolCalls) {
                const index = toolCallDelta.index;
                if (toolCalls[index] == null) {
                  if (toolCallDelta.type !== 'function') {
                    throw new import_provider3.InvalidResponseDataError({
                      data: toolCallDelta,
                      message: `Expected 'function' type.`,
                    });
                  }
                  if (toolCallDelta.id == null) {
                    throw new import_provider3.InvalidResponseDataError({
                      data: toolCallDelta,
                      message: `Expected 'id' to be a string.`,
                    });
                  }
                  if (
                    ((_c = toolCallDelta.function) == null
                      ? void 0
                      : _c.name) == null
                  ) {
                    throw new import_provider3.InvalidResponseDataError({
                      data: toolCallDelta,
                      message: `Expected 'function.name' to be a string.`,
                    });
                  }
                  toolCalls[index] = {
                    id: toolCallDelta.id,
                    type: 'function',
                    function: {
                      name: toolCallDelta.function.name,
                      arguments:
                        (_d = toolCallDelta.function.arguments) != null
                          ? _d
                          : '',
                    },
                    hasFinished: false,
                  };
                  const toolCall2 = toolCalls[index];
                  if (
                    ((_e = toolCall2.function) == null ? void 0 : _e.name) !=
                      null &&
                    ((_f = toolCall2.function) == null
                      ? void 0
                      : _f.arguments) != null
                  ) {
                    if (toolCall2.function.arguments.length > 0) {
                      controller.enqueue({
                        type: 'tool-call-delta',
                        toolCallType: 'function',
                        toolCallId: toolCall2.id,
                        toolName: toolCall2.function.name,
                        argsTextDelta: toolCall2.function.arguments,
                      });
                    }
                    if (
                      (0, import_provider_utils3.isParsableJson)(
                        toolCall2.function.arguments,
                      )
                    ) {
                      controller.enqueue({
                        type: 'tool-call',
                        toolCallType: 'function',
                        toolCallId:
                          (_g = toolCall2.id) != null
                            ? _g
                            : (0, import_provider_utils3.generateId)(),
                        toolName: toolCall2.function.name,
                        args: toolCall2.function.arguments,
                      });
                      toolCall2.hasFinished = true;
                    }
                  }
                  continue;
                }
                const toolCall = toolCalls[index];
                if (toolCall.hasFinished) {
                  continue;
                }
                if (
                  ((_h = toolCallDelta.function) == null
                    ? void 0
                    : _h.arguments) != null
                ) {
                  toolCall.function.arguments +=
                    (_j =
                      (_i = toolCallDelta.function) == null
                        ? void 0
                        : _i.arguments) != null
                      ? _j
                      : '';
                }
                controller.enqueue({
                  type: 'tool-call-delta',
                  toolCallType: 'function',
                  toolCallId: toolCall.id,
                  toolName: toolCall.function.name,
                  argsTextDelta:
                    (_k = toolCallDelta.function.arguments) != null ? _k : '',
                });
                if (
                  ((_l = toolCall.function) == null ? void 0 : _l.name) !=
                    null &&
                  ((_m = toolCall.function) == null ? void 0 : _m.arguments) !=
                    null &&
                  (0, import_provider_utils3.isParsableJson)(
                    toolCall.function.arguments,
                  )
                ) {
                  controller.enqueue({
                    type: 'tool-call',
                    toolCallType: 'function',
                    toolCallId:
                      (_n = toolCall.id) != null
                        ? _n
                        : (0, import_provider_utils3.generateId)(),
                    toolName: toolCall.function.name,
                    args: toolCall.function.arguments,
                  });
                  toolCall.hasFinished = true;
                }
              }
            }
          },
          flush(controller) {
            var _a, _b;
            controller.enqueue({
              type: 'finish',
              finishReason,
              logprobs,
              usage: {
                promptTokens: (_a = usage.promptTokens) != null ? _a : NaN,
                completionTokens:
                  (_b = usage.completionTokens) != null ? _b : NaN,
              },
              ...(providerMetadata != null ? { providerMetadata } : {}),
            });
          },
        }),
      ),
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      request: { body: JSON.stringify(body) },
      warnings,
    };
  }
};
var openaiTokenUsageSchema = import_zod2.z
  .object({
    prompt_tokens: import_zod2.z.number().nullish(),
    completion_tokens: import_zod2.z.number().nullish(),
    prompt_tokens_details: import_zod2.z
      .object({
        cached_tokens: import_zod2.z.number().nullish(),
      })
      .nullish(),
    completion_tokens_details: import_zod2.z
      .object({
        reasoning_tokens: import_zod2.z.number().nullish(),
      })
      .nullish(),
  })
  .nullish();
var openaiChatResponseSchema = import_zod2.z.object({
  id: import_zod2.z.string().nullish(),
  created: import_zod2.z.number().nullish(),
  model: import_zod2.z.string().nullish(),
  choices: import_zod2.z.array(
    import_zod2.z.object({
      message: import_zod2.z.object({
        role: import_zod2.z.literal('assistant').nullish(),
        content: import_zod2.z.string().nullish(),
        function_call: import_zod2.z
          .object({
            arguments: import_zod2.z.string(),
            name: import_zod2.z.string(),
          })
          .nullish(),
        tool_calls: import_zod2.z
          .array(
            import_zod2.z.object({
              id: import_zod2.z.string().nullish(),
              type: import_zod2.z.literal('function'),
              function: import_zod2.z.object({
                name: import_zod2.z.string(),
                arguments: import_zod2.z.string(),
              }),
            }),
          )
          .nullish(),
      }),
      index: import_zod2.z.number(),
      logprobs: import_zod2.z
        .object({
          content: import_zod2.z
            .array(
              import_zod2.z.object({
                token: import_zod2.z.string(),
                logprob: import_zod2.z.number(),
                top_logprobs: import_zod2.z.array(
                  import_zod2.z.object({
                    token: import_zod2.z.string(),
                    logprob: import_zod2.z.number(),
                  }),
                ),
              }),
            )
            .nullable(),
        })
        .nullish(),
      finish_reason: import_zod2.z.string().nullish(),
    }),
  ),
  usage: openaiTokenUsageSchema,
});
var openaiChatChunkSchema = import_zod2.z.union([
  import_zod2.z.object({
    id: import_zod2.z.string().nullish(),
    created: import_zod2.z.number().nullish(),
    model: import_zod2.z.string().nullish(),
    choices: import_zod2.z.array(
      import_zod2.z.object({
        delta: import_zod2.z
          .object({
            role: import_zod2.z.enum(['assistant']).nullish(),
            content: import_zod2.z.string().nullish(),
            function_call: import_zod2.z
              .object({
                name: import_zod2.z.string().optional(),
                arguments: import_zod2.z.string().optional(),
              })
              .nullish(),
            tool_calls: import_zod2.z
              .array(
                import_zod2.z.object({
                  index: import_zod2.z.number(),
                  id: import_zod2.z.string().nullish(),
                  type: import_zod2.z.literal('function').optional(),
                  function: import_zod2.z.object({
                    name: import_zod2.z.string().nullish(),
                    arguments: import_zod2.z.string().nullish(),
                  }),
                }),
              )
              .nullish(),
          })
          .nullish(),
        logprobs: import_zod2.z
          .object({
            content: import_zod2.z
              .array(
                import_zod2.z.object({
                  token: import_zod2.z.string(),
                  logprob: import_zod2.z.number(),
                  top_logprobs: import_zod2.z.array(
                    import_zod2.z.object({
                      token: import_zod2.z.string(),
                      logprob: import_zod2.z.number(),
                    }),
                  ),
                }),
              )
              .nullable(),
          })
          .nullish(),
        finish_reason: import_zod2.z.string().nullable().optional(),
        index: import_zod2.z.number(),
      }),
    ),
    usage: openaiTokenUsageSchema,
  }),
  openaiErrorDataSchema,
]);
function isReasoningModel(modelId) {
  return (
    modelId === 'o1' ||
    modelId.startsWith('o1-') ||
    modelId === 'o3' ||
    modelId.startsWith('o3-')
  );
}
function isAudioModel(modelId) {
  return modelId.startsWith('gpt-4o-audio-preview');
}

// src/openai-completion-language-model.ts
var import_provider5 = require('@ai-sdk/provider');
var import_provider_utils4 = require('@ai-sdk/provider-utils');
var import_zod3 = require('zod');

// src/convert-to-openai-completion-prompt.ts
var import_provider4 = require('@ai-sdk/provider');
function convertToOpenAICompletionPrompt({
  prompt,
  inputFormat,
  user = 'user',
  assistant = 'assistant',
}) {
  if (
    inputFormat === 'prompt' &&
    prompt.length === 1 &&
    prompt[0].role === 'user' &&
    prompt[0].content.length === 1 &&
    prompt[0].content[0].type === 'text'
  ) {
    return { prompt: prompt[0].content[0].text };
  }
  let text = '';
  if (prompt[0].role === 'system') {
    text += `${prompt[0].content}

`;
    prompt = prompt.slice(1);
  }
  for (const { role, content } of prompt) {
    switch (role) {
      case 'system': {
        throw new import_provider4.InvalidPromptError({
          message: 'Unexpected system message in prompt: ${content}',
          prompt,
        });
      }
      case 'user': {
        const userMessage = content
          .map((part) => {
            switch (part.type) {
              case 'text': {
                return part.text;
              }
              case 'image': {
                throw new import_provider4.UnsupportedFunctionalityError({
                  functionality: 'images',
                });
              }
            }
          })
          .join('');
        text += `${user}:
${userMessage}

`;
        break;
      }
      case 'assistant': {
        const assistantMessage = content
          .map((part) => {
            switch (part.type) {
              case 'text': {
                return part.text;
              }
              case 'tool-call': {
                throw new import_provider4.UnsupportedFunctionalityError({
                  functionality: 'tool-call messages',
                });
              }
            }
          })
          .join('');
        text += `${assistant}:
${assistantMessage}

`;
        break;
      }
      case 'tool': {
        throw new import_provider4.UnsupportedFunctionalityError({
          functionality: 'tool messages',
        });
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  text += `${assistant}:
`;
  return {
    prompt: text,
    stopSequences: [
      `
${user}:`,
    ],
  };
}

// src/map-openai-completion-logprobs.ts
function mapOpenAICompletionLogProbs(logprobs) {
  return logprobs == null
    ? void 0
    : logprobs.tokens.map((token, index) => ({
        token,
        logprob: logprobs.token_logprobs[index],
        topLogprobs: logprobs.top_logprobs
          ? Object.entries(logprobs.top_logprobs[index]).map(
              ([token2, logprob]) => ({
                token: token2,
                logprob,
              }),
            )
          : [],
      }));
}

// src/openai-completion-language-model.ts
var OpenAICompletionLanguageModel = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = 'v1';
    this.defaultObjectGenerationMode = void 0;
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  getArgs({
    mode,
    inputFormat,
    prompt,
    maxTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    stopSequences: userStopSequences,
    responseFormat,
    seed,
  }) {
    var _a;
    const type = mode.type;
    const warnings = [];
    if (topK != null) {
      warnings.push({
        type: 'unsupported-setting',
        setting: 'topK',
      });
    }
    if (responseFormat != null && responseFormat.type !== 'text') {
      warnings.push({
        type: 'unsupported-setting',
        setting: 'responseFormat',
        details: 'JSON response format is not supported.',
      });
    }
    const { prompt: completionPrompt, stopSequences } =
      convertToOpenAICompletionPrompt({ prompt, inputFormat });
    const stop = [
      ...(stopSequences != null ? stopSequences : []),
      ...(userStopSequences != null ? userStopSequences : []),
    ];
    const baseArgs = {
      // model id:
      model: this.modelId,
      // model specific settings:
      echo: this.settings.echo,
      logit_bias: this.settings.logitBias,
      logprobs:
        typeof this.settings.logprobs === 'number'
          ? this.settings.logprobs
          : typeof this.settings.logprobs === 'boolean'
            ? this.settings.logprobs
              ? 0
              : void 0
            : void 0,
      suffix: this.settings.suffix,
      user: this.settings.user,
      // standardized settings:
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
      seed,
      // prompt:
      prompt: completionPrompt,
      // stop sequences:
      stop: stop.length > 0 ? stop : void 0,
    };
    switch (type) {
      case 'regular': {
        if ((_a = mode.tools) == null ? void 0 : _a.length) {
          throw new import_provider5.UnsupportedFunctionalityError({
            functionality: 'tools',
          });
        }
        if (mode.toolChoice) {
          throw new import_provider5.UnsupportedFunctionalityError({
            functionality: 'toolChoice',
          });
        }
        return { args: baseArgs, warnings };
      }
      case 'object-json': {
        throw new import_provider5.UnsupportedFunctionalityError({
          functionality: 'object-json mode',
        });
      }
      case 'object-tool': {
        throw new import_provider5.UnsupportedFunctionalityError({
          functionality: 'object-tool mode',
        });
      }
      default: {
        const _exhaustiveCheck = type;
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
      }
    }
  }
  async doGenerate(options) {
    const { args, warnings } = this.getArgs(options);
    const { responseHeaders, value: response } = await (0,
    import_provider_utils4.postJsonToApi)({
      url: this.config.url({
        path: '/completions',
        modelId: this.modelId,
      }),
      headers: (0, import_provider_utils4.combineHeaders)(
        this.config.headers(),
        options.headers,
      ),
      body: args,
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: (0,
      import_provider_utils4.createJsonResponseHandler)(
        openaiCompletionResponseSchema,
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch,
    });
    const { prompt: rawPrompt, ...rawSettings } = args;
    const choice = response.choices[0];
    return {
      text: choice.text,
      usage: {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
      },
      finishReason: mapOpenAIFinishReason(choice.finish_reason),
      logprobs: mapOpenAICompletionLogProbs(choice.logprobs),
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      response: getResponseMetadata(response),
      warnings,
      request: { body: JSON.stringify(args) },
    };
  }
  async doStream(options) {
    const { args, warnings } = this.getArgs(options);
    const body = {
      ...args,
      stream: true,
      // only include stream_options when in strict compatibility mode:
      stream_options:
        this.config.compatibility === 'strict'
          ? { include_usage: true }
          : void 0,
    };
    const { responseHeaders, value: response } = await (0,
    import_provider_utils4.postJsonToApi)({
      url: this.config.url({
        path: '/completions',
        modelId: this.modelId,
      }),
      headers: (0, import_provider_utils4.combineHeaders)(
        this.config.headers(),
        options.headers,
      ),
      body,
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: (0,
      import_provider_utils4.createEventSourceResponseHandler)(
        openaiCompletionChunkSchema,
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch,
    });
    const { prompt: rawPrompt, ...rawSettings } = args;
    let finishReason = 'unknown';
    let usage = {
      promptTokens: Number.NaN,
      completionTokens: Number.NaN,
    };
    let logprobs;
    let isFirstChunk = true;
    return {
      stream: response.pipeThrough(
        new TransformStream({
          transform(chunk, controller) {
            if (!chunk.success) {
              finishReason = 'error';
              controller.enqueue({ type: 'error', error: chunk.error });
              return;
            }
            const value = chunk.value;
            if ('error' in value) {
              finishReason = 'error';
              controller.enqueue({ type: 'error', error: value.error });
              return;
            }
            if (isFirstChunk) {
              isFirstChunk = false;
              controller.enqueue({
                type: 'response-metadata',
                ...getResponseMetadata(value),
              });
            }
            if (value.usage != null) {
              usage = {
                promptTokens: value.usage.prompt_tokens,
                completionTokens: value.usage.completion_tokens,
              };
            }
            const choice = value.choices[0];
            if ((choice == null ? void 0 : choice.finish_reason) != null) {
              finishReason = mapOpenAIFinishReason(choice.finish_reason);
            }
            if ((choice == null ? void 0 : choice.text) != null) {
              controller.enqueue({
                type: 'text-delta',
                textDelta: choice.text,
              });
            }
            const mappedLogprobs = mapOpenAICompletionLogProbs(
              choice == null ? void 0 : choice.logprobs,
            );
            if (mappedLogprobs == null ? void 0 : mappedLogprobs.length) {
              if (logprobs === void 0) logprobs = [];
              logprobs.push(...mappedLogprobs);
            }
          },
          flush(controller) {
            controller.enqueue({
              type: 'finish',
              finishReason,
              logprobs,
              usage,
            });
          },
        }),
      ),
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      warnings,
      request: { body: JSON.stringify(body) },
    };
  }
};
var openaiCompletionResponseSchema = import_zod3.z.object({
  id: import_zod3.z.string().nullish(),
  created: import_zod3.z.number().nullish(),
  model: import_zod3.z.string().nullish(),
  choices: import_zod3.z.array(
    import_zod3.z.object({
      text: import_zod3.z.string(),
      finish_reason: import_zod3.z.string(),
      logprobs: import_zod3.z
        .object({
          tokens: import_zod3.z.array(import_zod3.z.string()),
          token_logprobs: import_zod3.z.array(import_zod3.z.number()),
          top_logprobs: import_zod3.z
            .array(
              import_zod3.z.record(
                import_zod3.z.string(),
                import_zod3.z.number(),
              ),
            )
            .nullable(),
        })
        .nullish(),
    }),
  ),
  usage: import_zod3.z.object({
    prompt_tokens: import_zod3.z.number(),
    completion_tokens: import_zod3.z.number(),
  }),
});
var openaiCompletionChunkSchema = import_zod3.z.union([
  import_zod3.z.object({
    id: import_zod3.z.string().nullish(),
    created: import_zod3.z.number().nullish(),
    model: import_zod3.z.string().nullish(),
    choices: import_zod3.z.array(
      import_zod3.z.object({
        text: import_zod3.z.string(),
        finish_reason: import_zod3.z.string().nullish(),
        index: import_zod3.z.number(),
        logprobs: import_zod3.z
          .object({
            tokens: import_zod3.z.array(import_zod3.z.string()),
            token_logprobs: import_zod3.z.array(import_zod3.z.number()),
            top_logprobs: import_zod3.z
              .array(
                import_zod3.z.record(
                  import_zod3.z.string(),
                  import_zod3.z.number(),
                ),
              )
              .nullable(),
          })
          .nullish(),
      }),
    ),
    usage: import_zod3.z
      .object({
        prompt_tokens: import_zod3.z.number(),
        completion_tokens: import_zod3.z.number(),
      })
      .nullish(),
  }),
  openaiErrorDataSchema,
]);

// src/openai-embedding-model.ts
var import_provider6 = require('@ai-sdk/provider');
var import_provider_utils5 = require('@ai-sdk/provider-utils');
var import_zod4 = require('zod');
var OpenAIEmbeddingModel = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = 'v1';
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  get maxEmbeddingsPerCall() {
    var _a;
    return (_a = this.settings.maxEmbeddingsPerCall) != null ? _a : 2048;
  }
  get supportsParallelCalls() {
    var _a;
    return (_a = this.settings.supportsParallelCalls) != null ? _a : true;
  }
  async doEmbed({ values, headers, abortSignal }) {
    if (values.length > this.maxEmbeddingsPerCall) {
      throw new import_provider6.TooManyEmbeddingValuesForCallError({
        provider: this.provider,
        modelId: this.modelId,
        maxEmbeddingsPerCall: this.maxEmbeddingsPerCall,
        values,
      });
    }
    const { responseHeaders, value: response } = await (0,
    import_provider_utils5.postJsonToApi)({
      url: this.config.url({
        path: '/embeddings',
        modelId: this.modelId,
      }),
      headers: (0, import_provider_utils5.combineHeaders)(
        this.config.headers(),
        headers,
      ),
      body: {
        model: this.modelId,
        input: values,
        encoding_format: 'float',
        dimensions: this.settings.dimensions,
        user: this.settings.user,
      },
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: (0,
      import_provider_utils5.createJsonResponseHandler)(
        openaiTextEmbeddingResponseSchema,
      ),
      abortSignal,
      fetch: this.config.fetch,
    });
    return {
      embeddings: response.data.map((item) => item.embedding),
      usage: response.usage ? { tokens: response.usage.prompt_tokens } : void 0,
      rawResponse: { headers: responseHeaders },
    };
  }
};
var openaiTextEmbeddingResponseSchema = import_zod4.z.object({
  data: import_zod4.z.array(
    import_zod4.z.object({
      embedding: import_zod4.z.array(import_zod4.z.number()),
    }),
  ),
  usage: import_zod4.z
    .object({ prompt_tokens: import_zod4.z.number() })
    .nullish(),
});

// src/openai-image-model.ts
var import_provider_utils6 = require('@ai-sdk/provider-utils');
var import_zod5 = require('zod');
var OpenAIImageModel = class {
  constructor(modelId, config) {
    this.specificationVersion = 'v1';
    this.modelId = modelId;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  async doGenerate({ prompt, n, size, providerOptions, headers, abortSignal }) {
    var _a;
    const { value: response } = await (0, import_provider_utils6.postJsonToApi)(
      {
        url: this.config.url({
          path: '/images/generations',
          modelId: this.modelId,
        }),
        headers: (0, import_provider_utils6.combineHeaders)(
          this.config.headers(),
          headers,
        ),
        body: {
          model: this.modelId,
          prompt,
          n,
          size,
          ...((_a = providerOptions.openai) != null ? _a : {}),
          response_format: 'b64_json',
        },
        failedResponseHandler: openaiFailedResponseHandler,
        successfulResponseHandler: (0,
        import_provider_utils6.createJsonResponseHandler)(
          openaiImageResponseSchema,
        ),
        abortSignal,
        fetch: this.config.fetch,
      },
    );
    return {
      images: response.data.map((item) => item.b64_json),
    };
  }
};
var openaiImageResponseSchema = import_zod5.z.object({
  data: import_zod5.z.array(
    import_zod5.z.object({ b64_json: import_zod5.z.string() }),
  ),
});

// src/openai-provider.ts
function createOpenAI(options = {}) {
  var _a, _b, _c;
  const baseURL =
    (_a = (0, import_provider_utils7.withoutTrailingSlash)(options.baseURL)) !=
    null
      ? _a
      : 'https://api.openai.com/v1';
  const compatibility =
    (_b = options.compatibility) != null ? _b : 'compatible';
  const providerName = (_c = options.name) != null ? _c : 'openai';
  const getHeaders = () => ({
    Authorization: `Bearer ${(0, import_provider_utils7.loadApiKey)({
      apiKey: options.apiKey,
      environmentVariableName: 'OPENAI_API_KEY',
      description: 'OpenAI',
    })}`,
    'OpenAI-Organization': options.organization,
    'OpenAI-Project': options.project,
    ...options.headers,
  });
  const createChatModel = (modelId, settings = {}) =>
    new OpenAIChatLanguageModel(modelId, settings, {
      provider: `${providerName}.chat`,
      url: ({ path }) => `${baseURL}${path}`,
      headers: getHeaders,
      compatibility,
      fetch: options.fetch,
    });
  const createCompletionModel = (modelId, settings = {}) =>
    new OpenAICompletionLanguageModel(modelId, settings, {
      provider: `${providerName}.completion`,
      url: ({ path }) => `${baseURL}${path}`,
      headers: getHeaders,
      compatibility,
      fetch: options.fetch,
    });
  const createEmbeddingModel = (modelId, settings = {}) =>
    new OpenAIEmbeddingModel(modelId, settings, {
      provider: `${providerName}.embedding`,
      url: ({ path }) => `${baseURL}${path}`,
      headers: getHeaders,
      fetch: options.fetch,
    });
  const createImageModel = (modelId) =>
    new OpenAIImageModel(modelId, {
      provider: `${providerName}.image`,
      url: ({ path }) => `${baseURL}${path}`,
      headers: getHeaders,
      fetch: options.fetch,
    });
  const createLanguageModel = (modelId, settings) => {
    if (new.target) {
      throw new Error(
        'The OpenAI model function cannot be called with the new keyword.',
      );
    }
    if (modelId === 'gpt-3.5-turbo-instruct') {
      return createCompletionModel(modelId, settings);
    }
    return createChatModel(modelId, settings);
  };
  const provider = function (modelId, settings) {
    return createLanguageModel(modelId, settings);
  };
  provider.languageModel = createLanguageModel;
  provider.chat = createChatModel;
  provider.completion = createCompletionModel;
  provider.embedding = createEmbeddingModel;
  provider.textEmbedding = createEmbeddingModel;
  provider.textEmbeddingModel = createEmbeddingModel;
  provider.image = createImageModel;
  return provider;
}
var openai = createOpenAI({
  compatibility: 'strict',
  // strict for OpenAI API
});
// Annotate the CommonJS export names for ESM import in node:
0 &&
  (module.exports = {
    createOpenAI,
    openai,
  });
//# sourceMappingURL=index.js.map