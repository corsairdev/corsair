import { get as botsGet, list as botsList } from './bots';

export const Bots = {
	list: botsList,
	get: botsGet,
};

export * from './types';
