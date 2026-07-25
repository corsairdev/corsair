import { createMessage } from './anthropic';
import { getBalance } from './balance';
import { createCompletion } from './chat';
import { list } from './models';

export const Chat = {
	createCompletion,
};

export const Anthropic = {
	createMessage,
};

export const Balance = {
	getBalance,
};

export const Models = {
	list,
};

export * from './types';
