import {
	partyGet,
	opportunityGet,
	projectGet,
} from './example';

export const CapsuleCrmEndpoints = {
	party: {
		get: partyGet,
	},
	opportunity: {
		get: opportunityGet,
	},
	project: {
		get: projectGet,
	},
};

export * from './types';