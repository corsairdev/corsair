import * as Anthropic from '../schema/anthropic';
import * as Balance from '../schema/balance';
import * as Chat from '../schema/chat';
import * as Models from '../schema/models';

export type DeepseekEndpointInputs = {
	chatCreateCompletion: Chat.ChatCreateCompletionInput;
	anthropicCreateMessage: Anthropic.AnthropicCreateMessageInput;
	userGetBalance: Balance.GetUserBalanceInput;
	modelsList: Models.ListModelsInput;
};

export type DeepseekEndpointOutputs = {
	chatCreateCompletion: Chat.ChatCreateCompletionResponse;
	anthropicCreateMessage: Anthropic.AnthropicCreateMessageResponse;
	userGetBalance: Balance.GetUserBalanceResponse;
	modelsList: Models.ListModelsResponse;
};

export const DeepseekEndpointInputSchemas = {
	chatCreateCompletion: Chat.ChatCreateCompletionInputSchema,
	anthropicCreateMessage: Anthropic.AnthropicCreateMessageInputSchema,
	userGetBalance: Balance.GetUserBalanceInputSchema,
	modelsList: Models.ListModelsInputSchema,
} as const;

export const DeepseekEndpointOutputSchemas = {
	chatCreateCompletion: Chat.ChatCreateCompletionResponseSchema,
	anthropicCreateMessage: Anthropic.AnthropicCreateMessageResponseSchema,
	userGetBalance: Balance.GetUserBalanceResponseSchema,
	modelsList: Models.ListModelsResponseSchema,
} as const;

export type {
	AnthropicCreateMessageInput,
	AnthropicCreateMessageResponse,
	AnthropicMessage,
} from '../schema/anthropic';
export type { BalanceInfo, GetUserBalanceResponse } from '../schema/balance';
export type {
	ChatCreateCompletionInput,
	ChatCreateCompletionResponse,
	ChatMessage,
	ToolCall,
} from '../schema/chat';
export type { ListModelsResponse, ModelObject } from '../schema/models';
