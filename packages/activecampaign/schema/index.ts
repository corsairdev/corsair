import {
	ActiveCampaignContact,
	ActiveCampaignContactList,
	ActiveCampaignContactTag,
	ActiveCampaignField,
	ActiveCampaignFieldOption,
	ActiveCampaignFieldRel,
	ActiveCampaignFieldValue,
	ActiveCampaignGroupMember,
	ActiveCampaignList,
	ActiveCampaignTag,
} from './database';

export const ActiveCampaignSchema = {
	version: '1.0.0',
	entities: {
		contacts: ActiveCampaignContact,
		lists: ActiveCampaignList,
		tags: ActiveCampaignTag,
		fields: ActiveCampaignField,
		contactLists: ActiveCampaignContactList,
		contactTags: ActiveCampaignContactTag,
		fieldValues: ActiveCampaignFieldValue,
		fieldOptions: ActiveCampaignFieldOption,
		fieldRels: ActiveCampaignFieldRel,
		groupMembers: ActiveCampaignGroupMember,
	},
} as const;

export type {
	ActiveCampaignContact,
	ActiveCampaignContactList,
	ActiveCampaignContactTag,
	ActiveCampaignField,
	ActiveCampaignFieldOption,
	ActiveCampaignFieldRel,
	ActiveCampaignFieldValue,
	ActiveCampaignGroupMember,
	ActiveCampaignList,
	ActiveCampaignTag,
} from './database';
