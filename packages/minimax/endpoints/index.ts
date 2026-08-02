import { createMessage } from './anthropic';
import { createCompletion } from './chat';
import { list } from './models';

export const Chat = {
	createCompletion,
};

export const Anthropic = {
	createMessage,
};

export const Models = {
	list,
};

export * from './types';