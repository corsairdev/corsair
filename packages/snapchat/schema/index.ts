import {
	SnapchatActionEntity,
	SnapchatAdAccountEntity,
	SnapchatAdEntity,
	SnapchatAdSquadEntity,
	SnapchatBillingCenterEntity,
	SnapchatCampaignEntity,
	SnapchatCreativeEntity,
	SnapchatMediaEntity,
	SnapchatOrganizationEntity,
	SnapchatSegmentEntity,
} from './database';

export const SnapchatSchema = {
	version: '1.0.0',
	entities: {
		actions: SnapchatActionEntity,
		organizations: SnapchatOrganizationEntity,
		adAccounts: SnapchatAdAccountEntity,
		campaigns: SnapchatCampaignEntity,
		adSquads: SnapchatAdSquadEntity,
		ads: SnapchatAdEntity,
		creatives: SnapchatCreativeEntity,
		media: SnapchatMediaEntity,
		segments: SnapchatSegmentEntity,
		billingCenters: SnapchatBillingCenterEntity,
	},
} as const;

export * from './database';
