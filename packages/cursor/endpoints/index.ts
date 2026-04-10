import { getMe } from './account';
import { list as agentsList, getConversation } from './agents';
import { list as modelsList } from './models';
import { list as repositoriesList } from './repositories';

export const Agents = {
	list: agentsList,
	getConversation,
};

export const Account = {
	getMe,
};

export const Models = {
	list: modelsList,
};

export const Repositories = {
	list: repositoriesList,
};

export * from './types';
