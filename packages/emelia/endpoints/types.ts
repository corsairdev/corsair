import { z } from 'zod';

// Account
export const AccountMeInputSchema = z.object({}).optional();

export const AccountMeOutputSchema = z.object({
	me: z
		.object({
			uid: z.string().optional(),
			name: z.string().optional(),
			email: z.string().optional(),
			showMailbox: z.boolean().optional(),
			picture: z.string().optional(),
			due_invoice: z.boolean().optional(),
			joinedDate: z.string().optional(),
		})
		.nullable()
		.optional(),
});

// Campaigns
export const CampaignsListInputSchema = z
	.object({
		options: z.record(z.string(), z.unknown()).optional(),
	})
	.optional();

export const CampaignSchema = z.object({
	_id: z.string(),
	name: z.string().optional(),
	status: z.string().optional(),
	createdAt: z.string().optional(),
	provider: z.string().optional(),
	useManyProviders: z.boolean().optional(),
	plannedStart: z.string().optional(),
});

export const CampaignsListOutputSchema = z.object({
	all_campaigns: z.array(CampaignSchema).nullable().optional(),
});

export const CampaignsAddContactInputSchema = z.object({
	id: z.string().min(1, 'Campaign ID is required'),
	contact: z.record(z.string(), z.unknown()),
});

export const CampaignsAddContactOutputSchema = z.object({
	addContactToCampaignHook: z.unknown().optional(),
});

export const CampaignsRemoveContactInputSchema = z.object({
	id: z.string().min(1, 'Campaign ID is required'),
	email: z.string().email('Valid email is required'),
});

export const CampaignsRemoveContactOutputSchema = z.object({
	removeOneContactFromCampaign: z.unknown().optional(),
});

// Contacts Lists
export const ContactsListListsInputSchema = z.object({}).optional();

export const ContactListSchema = z.object({
	_id: z.string(),
	name: z.string().optional(),
	contactCount: z.number().optional(),
	fields: z.array(z.string()).optional(),
	usedInCampaign: z.boolean().optional(),
});

export const ContactsListListsOutputSchema = z.object({
	contact_lists: z.array(ContactListSchema).nullable().optional(),
});

export const ContactsAddToListInputSchema = z.object({
	id: z.string().min(1, 'Contact list ID is required'),
	contact: z.record(z.string(), z.unknown()),
});

export const ContactsAddToListOutputSchema = z.object({
	addContactsToListHook: z.unknown().optional(),
});

// Aggregate Schemas
export const EmeliaEndpointInputSchemas = {
	accountMe: AccountMeInputSchema,
	campaignsList: CampaignsListInputSchema,
	campaignsAddContact: CampaignsAddContactInputSchema,
	campaignsRemoveContact: CampaignsRemoveContactInputSchema,
	contactsListLists: ContactsListListsInputSchema,
	contactsAddToList: ContactsAddToListInputSchema,
} as const;

export const EmeliaEndpointOutputSchemas = {
	accountMe: AccountMeOutputSchema,
	campaignsList: CampaignsListOutputSchema,
	campaignsAddContact: CampaignsAddContactOutputSchema,
	campaignsRemoveContact: CampaignsRemoveContactOutputSchema,
	contactsListLists: ContactsListListsOutputSchema,
	contactsAddToList: ContactsAddToListOutputSchema,
} as const;

export type EmeliaEndpointInputs = {
	accountMe: z.infer<typeof AccountMeInputSchema>;
	campaignsList: z.infer<typeof CampaignsListInputSchema>;
	campaignsAddContact: z.infer<typeof CampaignsAddContactInputSchema>;
	campaignsRemoveContact: z.infer<typeof CampaignsRemoveContactInputSchema>;
	contactsListLists: z.infer<typeof ContactsListListsInputSchema>;
	contactsAddToList: z.infer<typeof ContactsAddToListInputSchema>;
};

export type EmeliaEndpointOutputs = {
	accountMe: z.infer<typeof AccountMeOutputSchema>;
	campaignsList: z.infer<typeof CampaignsListOutputSchema>;
	campaignsAddContact: z.infer<typeof CampaignsAddContactOutputSchema>;
	campaignsRemoveContact: z.infer<typeof CampaignsRemoveContactOutputSchema>;
	contactsListLists: z.infer<typeof ContactsListListsOutputSchema>;
	contactsAddToList: z.infer<typeof ContactsAddToListOutputSchema>;
};
