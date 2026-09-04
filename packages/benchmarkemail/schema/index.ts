import {
	BenchmarkEmailCampaign,
	BenchmarkEmailContact,
	BenchmarkEmailContactList,
} from './database';

export const BenchmarkEmailSchema = {
	version: '1.0.0',
	entities: {
		contacts: BenchmarkEmailContact,
		contactLists: BenchmarkEmailContactList,
		campaigns: BenchmarkEmailCampaign,
	},
} as const;

export type {
	BenchmarkEmailCampaign,
	BenchmarkEmailContact,
	BenchmarkEmailContactList,
} from './database';
