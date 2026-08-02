import * as Anthropic from '../schema/anthropic';
import * as Chat from '../schema/chat';
import * as Models from '../schema/models';

export type MiniMaxEndpointInputs = {
	chatCreateCompletion: Chat.ChatCreateCompletionInput;
	anthropicCreateMessage: Anthropic.AnthropicCreateMessageInput;
	modelsList: Models.ListModelsInput;
};

export type MiniMaxEndpointOutputs = {
	chatCreateCompletion: Chat.ChatCreateCompletionResponse;
	anthropicCreateMessage: Anthropic.AnthropicCreateMessageResponse;
	modelsList: Models.ListModelsResponse;
};

export const MiniMaxEndpointInputSchemas = {
	chatCreateCompletion: Chat.ChatCreateCompletionInputSchema,
	anthropicCreateMessage: Anthropic.AnthropicCreateMessageInputSchema,
	modelsList: Models.ListModelsInputSchema,
} as const;

export const MiniMaxEndpointOutputSchemas = {
	chatCreateCompletion: Chat.ChatCreateCompletionResponseSchema,
	anthropicCreateMessage: Anthropic.AnthropicCreateMessageResponseSchema,
	modelsList: Models.ListModelsResponseSchema,
} as const;

export type {
	AnthropicCreateMessageInput,
	AnthropicCreateMessageResponse,
	AnthropicMessage,
} from '../schema/anthropic';
export type {
	ChatCreateCompletionInput,
	ChatCreateCompletionResponse,
	ChatMessage,
	ToolCall,
} from '../schema/chat';
export type { ListModelsResponse, ModelObject } from '../schema/models';