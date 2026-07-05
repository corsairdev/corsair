import { ActiveTrailCampaign, ActiveTrailContact, ActiveTrailGroup } from './database';

export const ActiveTrailSchema = {
	version: '1.0.0',
	entities: {
		contacts: ActiveTrailContact,
		campaigns: ActiveTrailCampaign,
		groups: ActiveTrailGroup,
	},
} as const;
