import {
	SalesforceAccountEntity,
	SalesforceCampaignEntity,
	SalesforceCampaignMemberEntity,
	SalesforceContactEntity,
	SalesforceContentDocumentEntity,
	SalesforceEmailMessageEntity,
	SalesforceLeadEntity,
	SalesforceNoteEntity,
	SalesforceOpportunityEntity,
	SalesforceOpportunityLineItemEntity,
	SalesforcePricebookEntity,
	SalesforcePricebookEntryEntity,
	SalesforceTaskEntity,
	SalesforceUserEntity,
} from './database';

export const SalesforceSchema = {
	version: '1.0.0',
	entities: {
		account: SalesforceAccountEntity,
		contact: SalesforceContactEntity,
		lead: SalesforceLeadEntity,
		opportunity: SalesforceOpportunityEntity,
		campaign: SalesforceCampaignEntity,
		campaignMember: SalesforceCampaignMemberEntity,
		note: SalesforceNoteEntity,
		task: SalesforceTaskEntity,
		opportunityLineItem: SalesforceOpportunityLineItemEntity,
		pricebook: SalesforcePricebookEntity,
		pricebookEntry: SalesforcePricebookEntryEntity,
		user: SalesforceUserEntity,
		emailMessage: SalesforceEmailMessageEntity,
		contentDocument: SalesforceContentDocumentEntity,
	},
} as const;

export * from './database';
