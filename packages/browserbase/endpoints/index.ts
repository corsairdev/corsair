import {
	create as sessionsCreate,
	get as sessionsGet,
	list as sessionsList,
} from './sessions';

export const Sessions = {
	create: sessionsCreate,
	list: sessionsList,
	get: sessionsGet,
};

export * from './types';
