import { ProoflyCampaignEntity, ProoflyUserEntity } from './database';

export const ProoflySchema = {
	version: '1.0.0',
	entities: {
		campaigns: ProoflyCampaignEntity,
		users: ProoflyUserEntity,
	},
} as const;
