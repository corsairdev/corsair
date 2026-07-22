import {
	SalesforceAccountEntity,
	SalesforceContactEntity,
	SalesforceLeadEntity,
	SalesforceOpportunityEntity,
} from './database';

export const SalesforceSchema = {
	version: '1.0.0',
	entities: {
		account: SalesforceAccountEntity,
		contact: SalesforceContactEntity,
		lead: SalesforceLeadEntity,
		opportunity: SalesforceOpportunityEntity,
	},
} as const;

export * from './database';
