import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Account Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const AccountGetInputSchema = z.object({}).optional();
export type AccountGetInput = z.infer<typeof AccountGetInputSchema>;

export const AccountGetResponseSchema = z
	.object({
		email: z.string(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
		companyName: z.string().optional(),
		address: z
			.object({
				street: z.string().optional(),
				city: z.string().optional(),
				zipCode: z.string().optional(),
				country: z.string().optional(),
			})
			.optional(),
		plan: z
			.array(
				z.object({
					type: z.string(),
					credits: z.number(),
					creditsType: z.string().optional(),
					startDate: z.string().optional(),
					endDate: z.string().optional(),
				}),
			)
			.optional(),
		relay: z
			.object({
				enabled: z.boolean(),
				data: z
					.object({
						userName: z.string().optional(),
						relay: z.string().optional(),
						port: z.number().optional(),
					})
					.optional(),
			})
			.optional(),
	})
	.catchall(z.unknown());
export type AccountGetResponse = z.infer<typeof AccountGetResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Contact Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const ContactSchema = z
	.object({
		id: z.number(),
		email: z.string().nullish(),
		emailBlacklisted: z.boolean().optional(),
		smsBlacklisted: z.boolean().optional(),
		createdAt: z.string().optional(),
		modifiedAt: z.string().optional(),
		listIds: z.array(z.number()).optional(),
		listUnsubscribed: z.array(z.number()).optional(),
		attributes: z.record(z.string(), z.unknown()).optional(),
	})
	.catchall(z.unknown());
export type Contact = z.infer<typeof ContactSchema>;

export const ContactsListInputSchema = z
	.object({
		limit: z.number().min(1).max(1000).optional(),
		offset: z.number().min(0).optional(),
		modifiedSince: z.string().optional(),
		sort: z.enum(['asc', 'desc']).optional(),
		segmentId: z.number().optional(),
		listId: z.number().optional(),
	})
	.optional();
export type ContactsListInput = z.infer<typeof ContactsListInputSchema>;

export const ContactsListResponseSchema = z
	.object({
		contacts: z.array(ContactSchema).optional().default([]),
		count: z.number().optional().default(0),
	})
	.catchall(z.unknown());
export type ContactsListResponse = z.infer<typeof ContactsListResponseSchema>;

export const ContactsGetInputSchema = z.object({
	identifier: z.union([z.string(), z.number()]),
});
export type ContactsGetInput = z.infer<typeof ContactsGetInputSchema>;

export const ContactsGetResponseSchema = ContactSchema;
export type ContactsGetResponse = z.infer<typeof ContactsGetResponseSchema>;

export const ContactsCreateInputSchema = z
	.object({
		email: z.email().optional(),
		ext_id: z.string().min(1).optional(),
		attributes: z.record(z.string(), z.unknown()).optional(),
		emailBlacklisted: z.boolean().optional(),
		smsBlacklisted: z.boolean().optional(),
		listIds: z.array(z.number()).optional(),
		updateEnabled: z.boolean().optional(),
		smtpBlacklistSender: z.array(z.string()).optional(),
	})
	.refine((data) => {
		if (data.email || data.ext_id) {
			return true;
		}
		const sms = data.attributes?.SMS;
		return typeof sms === 'string' && sms.trim().length > 0;
	});
export type ContactsCreateInput = z.infer<typeof ContactsCreateInputSchema>;

export const ContactsCreateResponseSchema = z
	.object({
		id: z.number(),
	})
	.catchall(z.unknown());
export type ContactsCreateResponse = z.infer<
	typeof ContactsCreateResponseSchema
>;

export const ContactsUpdateInputSchema = z.object({
	identifier: z.union([z.string(), z.number()]),
	attributes: z.record(z.string(), z.unknown()).optional(),
	emailBlacklisted: z.boolean().optional(),
	smsBlacklisted: z.boolean().optional(),
	listIds: z.array(z.number()).optional(),
	unlinkListIds: z.array(z.number()).optional(),
	smtpBlacklistSender: z.array(z.string()).optional(),
});
export type ContactsUpdateInput = z.infer<typeof ContactsUpdateInputSchema>;

export const ContactsUpdateResponseSchema = z
	.object({
		success: z.boolean().optional(),
	})
	.catchall(z.unknown());
export type ContactsUpdateResponse = z.infer<
	typeof ContactsUpdateResponseSchema
>;

export const ContactsDeleteInputSchema = z.object({
	identifier: z.union([z.string(), z.number()]),
});
export type ContactsDeleteInput = z.infer<typeof ContactsDeleteInputSchema>;

export const ContactsDeleteResponseSchema = z
	.object({
		success: z.boolean().optional(),
	})
	.catchall(z.unknown());
export type ContactsDeleteResponse = z.infer<
	typeof ContactsDeleteResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Email Campaign Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const CampaignSenderSchema = z.object({
	name: z.string().optional(),
	email: z.string().optional(),
	id: z.number().optional(),
});

export const CampaignRecipientsSchema = z.object({
	lists: z.array(z.number()).optional(),
	exclusionLists: z.array(z.number()).optional(),
});

export const CampaignItemSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		subject: z.string().optional(),
		type: z.string().optional(),
		status: z.string().optional(),
		scheduledAt: z.string().optional(),
		sentDate: z.string().optional(),
		createdAt: z.string().optional(),
		modifiedAt: z.string().optional(),
		recipients: CampaignRecipientsSchema.optional(),
	})
	.catchall(z.unknown());
export type CampaignItem = z.infer<typeof CampaignItemSchema>;

export const EmailCampaignsListInputSchema = z
	.object({
		type: z.enum(['classic', 'trigger']).optional(),
		status: z
			.enum(['suspended', 'archive', 'sent', 'queued', 'draft', 'in_process'])
			.optional(),
		limit: z.number().min(1).max(1000).optional(),
		offset: z.number().min(0).optional(),
		sort: z.enum(['asc', 'desc']).optional(),
	})
	.optional();
export type EmailCampaignsListInput = z.infer<
	typeof EmailCampaignsListInputSchema
>;

export const EmailCampaignsListResponseSchema = z
	.object({
		campaigns: z.array(CampaignItemSchema).optional().default([]),
		count: z.number().optional().default(0),
	})
	.catchall(z.unknown());
export type EmailCampaignsListResponse = z.infer<
	typeof EmailCampaignsListResponseSchema
>;

export const EmailCampaignsGetInputSchema = z.object({
	campaignId: z.number(),
});
export type EmailCampaignsGetInput = z.infer<
	typeof EmailCampaignsGetInputSchema
>;

export const EmailCampaignsGetResponseSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		subject: z.string().optional(),
		type: z.string().optional(),
		status: z.string().optional(),
		htmlContent: z.string().optional(),
		scheduledAt: z.string().optional(),
		sentDate: z.string().optional(),
		createdAt: z.string().optional(),
		modifiedAt: z.string().optional(),
		sender: CampaignSenderSchema.optional(),
		replyTo: z.string().optional(),
		toField: z.string().optional(),
		htmlUrl: z.string().optional(),
		tag: z.string().optional(),
		recipients: CampaignRecipientsSchema.optional(),
		statistics: z.record(z.string(), z.unknown()).optional(),
	})
	.catchall(z.unknown());
export type EmailCampaignsGetResponse = z.infer<
	typeof EmailCampaignsGetResponseSchema
>;

export const CampaignCreateSenderSchema = z
	.object({
		name: z.string().optional(),
		email: z.email().optional(),
		id: z.number().optional(),
	})
	.refine(
		(sender) => (sender.email !== undefined) !== (sender.id !== undefined),
	);

export const EmailCampaignsCreateInputSchema = z
	.object({
		name: z.string(),
		subject: z.string().min(1),
		sender: CampaignCreateSenderSchema,
		htmlContent: z.string().optional(),
		htmlUrl: z.string().optional(),
		templateId: z.number().optional(),
		scheduledAt: z.string().optional(),
		recipients: CampaignRecipientsSchema.optional(),
		replyTo: z.string().optional(),
		toField: z.string().optional(),
		tag: z.string().optional(),
		header: z.string().optional(),
		footer: z.string().optional(),
		utmCampaign: z.string().optional(),
		params: z.record(z.string(), z.unknown()).optional(),
	})
	.refine((data) => {
		const sources = [data.htmlContent, data.htmlUrl, data.templateId].filter(
			(value) => value !== undefined && value !== '',
		);
		return sources.length === 1;
	});
export type EmailCampaignsCreateInput = z.infer<
	typeof EmailCampaignsCreateInputSchema
>;

export const EmailCampaignsCreateResponseSchema = z
	.object({
		id: z.number(),
	})
	.catchall(z.unknown());
export type EmailCampaignsCreateResponse = z.infer<
	typeof EmailCampaignsCreateResponseSchema
>;

export const EmailCampaignsUpdateInputSchema = z.object({
	campaignId: z.number(),
	name: z.string().optional(),
	subject: z.string().optional(),
	sender: CampaignSenderSchema.optional(),
	htmlContent: z.string().optional(),
	htmlUrl: z.string().optional(),
	templateId: z.number().optional(),
	scheduledAt: z.string().optional(),
	recipients: CampaignRecipientsSchema.optional(),
	replyTo: z.string().optional(),
	toField: z.string().optional(),
	tag: z.string().optional(),
	header: z.string().optional(),
	footer: z.string().optional(),
	utmCampaign: z.string().optional(),
	params: z.record(z.string(), z.unknown()).optional(),
});
export type EmailCampaignsUpdateInput = z.infer<
	typeof EmailCampaignsUpdateInputSchema
>;

export const EmailCampaignsUpdateResponseSchema = z
	.object({
		success: z.boolean().optional(),
	})
	.catchall(z.unknown());
export type EmailCampaignsUpdateResponse = z.infer<
	typeof EmailCampaignsUpdateResponseSchema
>;

export const EmailCampaignsDeleteInputSchema = z.object({
	campaignId: z.number(),
});
export type EmailCampaignsDeleteInput = z.infer<
	typeof EmailCampaignsDeleteInputSchema
>;

export const EmailCampaignsDeleteResponseSchema = z
	.object({
		success: z.boolean().optional(),
	})
	.catchall(z.unknown());
export type EmailCampaignsDeleteResponse = z.infer<
	typeof EmailCampaignsDeleteResponseSchema
>;

export const EmailCampaignsSendNowInputSchema = z.object({
	campaignId: z.number(),
});
export type EmailCampaignsSendNowInput = z.infer<
	typeof EmailCampaignsSendNowInputSchema
>;

export const EmailCampaignsSendNowResponseSchema = z
	.object({
		success: z.boolean().optional(),
	})
	.catchall(z.unknown());
export type EmailCampaignsSendNowResponse = z.infer<
	typeof EmailCampaignsSendNowResponseSchema
>;

export const EmailCampaignsSendTestInputSchema = z.object({
	campaignId: z.number(),
	emailTo: z.array(z.email()).min(1),
});
export type EmailCampaignsSendTestInput = z.infer<
	typeof EmailCampaignsSendTestInputSchema
>;

export const EmailCampaignsSendTestResponseSchema = z
	.object({
		success: z.boolean().optional(),
	})
	.catchall(z.unknown());
export type EmailCampaignsSendTestResponse = z.infer<
	typeof EmailCampaignsSendTestResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Input & Output Collections
// ─────────────────────────────────────────────────────────────────────────────

export const BrevoEndpointInputSchemas = {
	accountGet: AccountGetInputSchema,
	contactsList: ContactsListInputSchema,
	contactsGet: ContactsGetInputSchema,
	contactsCreate: ContactsCreateInputSchema,
	contactsUpdate: ContactsUpdateInputSchema,
	contactsDelete: ContactsDeleteInputSchema,
	emailCampaignsList: EmailCampaignsListInputSchema,
	emailCampaignsGet: EmailCampaignsGetInputSchema,
	emailCampaignsCreate: EmailCampaignsCreateInputSchema,
	emailCampaignsUpdate: EmailCampaignsUpdateInputSchema,
	emailCampaignsDelete: EmailCampaignsDeleteInputSchema,
	emailCampaignsSendNow: EmailCampaignsSendNowInputSchema,
	emailCampaignsSendTest: EmailCampaignsSendTestInputSchema,
} as const;

export const BrevoEndpointOutputSchemas = {
	accountGet: AccountGetResponseSchema,
	contactsList: ContactsListResponseSchema,
	contactsGet: ContactsGetResponseSchema,
	contactsCreate: ContactsCreateResponseSchema,
	contactsUpdate: ContactsUpdateResponseSchema,
	contactsDelete: ContactsDeleteResponseSchema,
	emailCampaignsList: EmailCampaignsListResponseSchema,
	emailCampaignsGet: EmailCampaignsGetResponseSchema,
	emailCampaignsCreate: EmailCampaignsCreateResponseSchema,
	emailCampaignsUpdate: EmailCampaignsUpdateResponseSchema,
	emailCampaignsDelete: EmailCampaignsDeleteResponseSchema,
	emailCampaignsSendNow: EmailCampaignsSendNowResponseSchema,
	emailCampaignsSendTest: EmailCampaignsSendTestResponseSchema,
} as const;

export type BrevoEndpointInputs = {
	accountGet: AccountGetInput;
	contactsList: ContactsListInput;
	contactsGet: ContactsGetInput;
	contactsCreate: ContactsCreateInput;
	contactsUpdate: ContactsUpdateInput;
	contactsDelete: ContactsDeleteInput;
	emailCampaignsList: EmailCampaignsListInput;
	emailCampaignsGet: EmailCampaignsGetInput;
	emailCampaignsCreate: EmailCampaignsCreateInput;
	emailCampaignsUpdate: EmailCampaignsUpdateInput;
	emailCampaignsDelete: EmailCampaignsDeleteInput;
	emailCampaignsSendNow: EmailCampaignsSendNowInput;
	emailCampaignsSendTest: EmailCampaignsSendTestInput;
};

export type BrevoEndpointOutputs = {
	accountGet: AccountGetResponse;
	contactsList: ContactsListResponse;
	contactsGet: ContactsGetResponse;
	contactsCreate: ContactsCreateResponse;
	contactsUpdate: ContactsUpdateResponse;
	contactsDelete: ContactsDeleteResponse;
	emailCampaignsList: EmailCampaignsListResponse;
	emailCampaignsGet: EmailCampaignsGetResponse;
	emailCampaignsCreate: EmailCampaignsCreateResponse;
	emailCampaignsUpdate: EmailCampaignsUpdateResponse;
	emailCampaignsDelete: EmailCampaignsDeleteResponse;
	emailCampaignsSendNow: EmailCampaignsSendNowResponse;
	emailCampaignsSendTest: EmailCampaignsSendTestResponse;
};
