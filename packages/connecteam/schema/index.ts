import {
	ConnecteamAccountEntity,
	ConnecteamConversationEntity,
	ConnecteamCustomFieldCategoryEntity,
	ConnecteamCustomFieldEntity,
	ConnecteamFormEntity,
	ConnecteamJobEntity,
	ConnecteamPerformanceIndicatorEntity,
	ConnecteamPolicyTypeEntity,
	ConnecteamPublisherEntity,
	ConnecteamSchedulerEntity,
	ConnecteamSmartGroupEntity,
	ConnecteamTaskBoardEntity,
	ConnecteamUserEntity,
} from './database';

export const ConnecteamSchema = {
	version: '1.0.0',
	entities: {
		users: ConnecteamUserEntity,
		customFields: ConnecteamCustomFieldEntity,
		customFieldCategories: ConnecteamCustomFieldCategoryEntity,
		smartGroups: ConnecteamSmartGroupEntity,
		forms: ConnecteamFormEntity,
		jobs: ConnecteamJobEntity,
		schedulers: ConnecteamSchedulerEntity,
		taskBoards: ConnecteamTaskBoardEntity,
		publishers: ConnecteamPublisherEntity,
		conversations: ConnecteamConversationEntity,
		policyTypes: ConnecteamPolicyTypeEntity,
		performanceIndicators: ConnecteamPerformanceIndicatorEntity,
		account: ConnecteamAccountEntity,
	},
} as const;

export * from './database';
