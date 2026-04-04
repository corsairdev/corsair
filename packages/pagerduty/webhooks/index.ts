import { acknowledged, assigned, resolved, triggered } from './incidents';

export const IncidentWebhooks = {
	triggered,
	acknowledged,
	resolved,
	assigned,
};

export * from './types';
