import { createChatCompletion } from './chat-completions';
import { listCredits } from './credits';
import { createEmbedding } from './embeddings';
import { getGeneration } from './generations';
import { getKey } from './key';
import { createAnthropicMessage } from './messages';
import { listModelEndpoints } from './model-endpoints';
import {
	listEmbeddingModels,
	listModels,
	listModelsCount,
	listUserModels,
} from './models';
import { listProviders } from './providers';
import { listZdrEndpoints } from './zdr';

export const ChatCompletions = {
	createChatCompletion,
};

export const Messages = {
	createAnthropicMessage,
};

export const Models = {
	listModels,
	listModelsCount,
	listEmbeddingModels,
	listUserModels,
};

export const Embeddings = {
	createEmbedding,
};

export const ModelEndpoints = {
	listModelEndpoints,
};

export const Providers = {
	listProviders,
};

export const Generations = {
	getGeneration,
};

export const Credits = {
	listCredits,
};

export const Key = {
	getKey,
};

export const Zdr = {
	listZdrEndpoints,
};

export * from './types';
