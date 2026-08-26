import {
	BigmailerBrandEntity,
	BigmailerBrandPropertyEntity,
	BigmailerBulkCampaignEntity,
	BigmailerConnectionEntity,
	BigmailerContactEntity,
	BigmailerFieldEntity,
	BigmailerListEntity,
	BigmailerMessageTypeEntity,
	BigmailerSegmentEntity,
	BigmailerSenderEntity,
	BigmailerSuppressionListEntity,
	BigmailerTemplateEntity,
	BigmailerTransactionalCampaignEntity,
} from './database';

export const BigmailerSchema = {
	version: '1.0.0',
	entities: {
		brands: BigmailerBrandEntity,
		brandProperties: BigmailerBrandPropertyEntity,
		fields: BigmailerFieldEntity,
		lists: BigmailerListEntity,
		connections: BigmailerConnectionEntity,
		messageTypes: BigmailerMessageTypeEntity,
		senders: BigmailerSenderEntity,
		contacts: BigmailerContactEntity,
		segments: BigmailerSegmentEntity,
		suppressionLists: BigmailerSuppressionListEntity,
		templates: BigmailerTemplateEntity,
		bulkCampaigns: BigmailerBulkCampaignEntity,
		transactionalCampaigns: BigmailerTransactionalCampaignEntity,
	},
} as const;

export * from './database';
