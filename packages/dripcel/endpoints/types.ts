import { z } from 'zod';
import {
	DripcelCampaign,
	DripcelContact,
	DripcelDelivery,
	DripcelEmailTemplate,
	DripcelReply,
	DripcelSale,
	DripcelSendLog,
	DripcelTag,
} from '../schema';

const MutationCountSchema = z.object({
	matchedCount: z.number(),
	modifiedCount: z.number(),
});

const UploadContactsResultSchema = z.object({
	validContacts: z.number(),
	invalidContacts: z.array(z.unknown()),
});

export const GetContactInputSchema = z
	.object({
		cell: z.string(),
	})
	.passthrough();
export type GetContactInput = z.infer<typeof GetContactInputSchema>;
export const GetContactOutputSchema = DripcelContact;
export type GetContactOutput = z.infer<typeof GetContactOutputSchema>;

const ContactUploadRowSchema = DripcelContact.extend({
	cell: z.string(),
}).passthrough();

export const CreateContactsInputSchema = z
	.object({
		contacts: z.array(ContactUploadRowSchema),
		country: z.enum(['ZA', 'NA']).optional(),
		tag_ids: z.array(z.string()).optional(),
		send: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();
export type CreateContactsInput = z.infer<typeof CreateContactsInputSchema>;
export const CreateContactsOutputSchema = UploadContactsResultSchema;
export type CreateContactsOutput = z.infer<typeof CreateContactsOutputSchema>;

export const UpsertContactsInputSchema = CreateContactsInputSchema;
export type UpsertContactsInput = z.infer<typeof UpsertContactsInputSchema>;
export const UpsertContactsOutputSchema = UploadContactsResultSchema;
export type UpsertContactsOutput = z.infer<typeof UpsertContactsOutputSchema>;

export const DeleteContactInputSchema = z
	.object({
		cell: z.string(),
	})
	.passthrough();
export type DeleteContactInput = z.infer<typeof DeleteContactInputSchema>;
export const DeleteContactOutputSchema = z.object({
	ok: z.literal(true),
});
export type DeleteContactOutput = z.infer<typeof DeleteContactOutputSchema>;

export const AddContactTagsInputSchema = z
	.object({
		cell: z.string(),
		tag_ids: z.array(z.string()).optional(),
		tags: z.array(z.string()).optional(),
		create_missing_contact: z.boolean().optional(),
	})
	.passthrough();
export type AddContactTagsInput = z.infer<typeof AddContactTagsInputSchema>;
export const AddContactTagsOutputSchema = MutationCountSchema;
export type AddContactTagsOutput = z.infer<typeof AddContactTagsOutputSchema>;

export const OptOutContactInputSchema = z
	.object({
		cell: z.string(),
		campaign_ids: z.array(z.string()).optional(),
		all: z.boolean().optional(),
		create_missing_contact: z.boolean().optional(),
	})
	.passthrough();
export type OptOutContactInput = z.infer<typeof OptOutContactInputSchema>;
export const OptOutContactOutputSchema = MutationCountSchema;
export type OptOutContactOutput = z.infer<typeof OptOutContactOutputSchema>;

export const CheckComplianceInputSchema = z
	.object({
		cells: z.array(z.string()),
		country: z.string(),
		campaign_id: z.string().optional(),
	})
	.passthrough();
export type CheckComplianceInput = z.infer<typeof CheckComplianceInputSchema>;
export const CheckComplianceOutputSchema = z.object({
	campaign_id: z.string().optional(),
	credits_used: z.number(),
	results: z.array(
		z.object({
			cell: z.string(),
			can_send: z.boolean(),
		}),
	),
});
export type CheckComplianceOutput = z.infer<typeof CheckComplianceOutputSchema>;

export const ListDeliveriesInputSchema = z
	.object({
		cell: z.string().optional(),
		customerId: z.string().optional(),
	})
	.passthrough()
	.refine((v) => Boolean(v.cell || v.customerId), {
		message: 'cell or customerId is required',
	});
export type ListDeliveriesInput = z.infer<typeof ListDeliveriesInputSchema>;
export const ListDeliveriesOutputSchema = z.object({
	deliveries: z.array(DripcelDelivery),
});
export type ListDeliveriesOutput = z.infer<typeof ListDeliveriesOutputSchema>;

export const ListCampaignsInputSchema = z.object({}).optional();
export type ListCampaignsInput = z.infer<typeof ListCampaignsInputSchema>;
export const ListCampaignsOutputSchema = z.object({
	campaigns: z.array(DripcelCampaign),
});
export type ListCampaignsOutput = z.infer<typeof ListCampaignsOutputSchema>;

export const GetBalanceInputSchema = z.object({}).optional();
export type GetBalanceInput = z.infer<typeof GetBalanceInputSchema>;
export const GetBalanceOutputSchema = z.object({
	balance: z.number(),
});
export type GetBalanceOutput = z.infer<typeof GetBalanceOutputSchema>;

export const ListEmailTemplatesInputSchema = z.object({}).optional();
export type ListEmailTemplatesInput = z.infer<
	typeof ListEmailTemplatesInputSchema
>;
export const ListEmailTemplatesOutputSchema = z.object({
	templates: z.array(DripcelEmailTemplate),
});
export type ListEmailTemplatesOutput = z.infer<
	typeof ListEmailTemplatesOutputSchema
>;

const SaleUploadRowSchema = DripcelSale.extend({
	campaign_id: z.string(),
	cell: z.string(),
}).passthrough();

export const UploadSalesInputSchema = z
	.object({
		sales: z.array(SaleUploadRowSchema),
	})
	.passthrough();
export type UploadSalesInput = z.infer<typeof UploadSalesInputSchema>;
export const UploadSalesOutputSchema = z.object({
	ok: z.literal(true),
});
export type UploadSalesOutput = z.infer<typeof UploadSalesOutputSchema>;

export const ListTagsInputSchema = z.object({}).optional();
export type ListTagsInput = z.infer<typeof ListTagsInputSchema>;
export const ListTagsOutputSchema = z.object({
	tags: z.array(DripcelTag),
});
export type ListTagsOutput = z.infer<typeof ListTagsOutputSchema>;

export const DeleteTagInputSchema = z
	.object({
		tag_id: z.string(),
	})
	.passthrough();
export type DeleteTagInput = z.infer<typeof DeleteTagInputSchema>;
export const DeleteTagOutputSchema = DripcelTag;
export type DeleteTagOutput = z.infer<typeof DeleteTagOutputSchema>;

export const SearchRepliesInputSchema = z
	.object({
		_id: z.union([z.string(), z.array(z.string())]).optional(),
		Message: z.string().optional(),
		kind: z.union([z.string(), z.array(z.string())]).optional(),
		Msisdn: z.union([z.string(), z.array(z.string())]).optional(),
		campaign_id: z.union([z.string(), z.array(z.string())]).optional(),
		UserReference: z.union([z.string(), z.array(z.string())]).optional(),
		Received: z
			.object({
				$gte: z.string().optional(),
				$lte: z.string().optional(),
			})
			.optional(),
	})
	.passthrough();
export type SearchRepliesInput = z.infer<typeof SearchRepliesInputSchema>;
export const SearchRepliesOutputSchema = z.object({
	replies: z.array(DripcelReply),
});
export type SearchRepliesOutput = z.infer<typeof SearchRepliesOutputSchema>;

export const SearchSendLogsInputSchema = z
	.object({
		find: z
			.object({
				campaign_id: z.array(z.string()).optional(),
				startDeliveryAt: z
					.object({
						$gte: z.string().optional(),
						$lte: z.string().optional(),
					})
					.optional(),
			})
			.passthrough()
			.optional(),
		options: z
			.object({
				skip: z.number().optional(),
				limit: z.number().optional(),
			})
			.optional(),
	})
	.passthrough();
export type SearchSendLogsInput = z.infer<typeof SearchSendLogsInputSchema>;
export const SearchSendLogsOutputSchema = z.object({
	total: z.number(),
	send_logs: z.array(DripcelSendLog),
	parsed: z.record(z.string(), z.unknown()).optional(),
});
export type SearchSendLogsOutput = z.infer<typeof SearchSendLogsOutputSchema>;

export const SendSmsInputSchema = z
	.object({
		content: z.string(),
		cell: z.string(),
		skipNonContacts: z.boolean(),
		country: z.string(),
		deliveryMethod: z.enum(['reverse', 'standard', 'transactional']),
		campaign_id: z.string().optional(),
		sendOptions: z
			.object({
				testMode: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
export type SendSmsInput = z.infer<typeof SendSmsInputSchema>;
export const SendSmsOutputSchema = z.object({
	customerId: z.string(),
	totalCost: z.number(),
});
export type SendSmsOutput = z.infer<typeof SendSmsOutputSchema>;

export const SendBulkEmailInputSchema = z
	.object({
		from: z.string(),
		template_id: z.string(),
		destinations: z.array(z.string()),
		filter_non_contacts: z.boolean().optional(),
		to_start_at: z.string().optional(),
	})
	.passthrough();
export type SendBulkEmailInput = z.infer<typeof SendBulkEmailInputSchema>;
export const SendBulkEmailOutputSchema = z.object({}).passthrough();
export type SendBulkEmailOutput = z.infer<typeof SendBulkEmailOutputSchema>;

export type DripcelEndpointInputs = {
	getContact: GetContactInput;
	createContacts: CreateContactsInput;
	upsertContacts: UpsertContactsInput;
	deleteContact: DeleteContactInput;
	addContactTags: AddContactTagsInput;
	optOutContact: OptOutContactInput;
	checkCompliance: CheckComplianceInput;
	listDeliveries: ListDeliveriesInput;
	listCampaigns: ListCampaignsInput;
	getBalance: GetBalanceInput;
	listEmailTemplates: ListEmailTemplatesInput;
	uploadSales: UploadSalesInput;
	listTags: ListTagsInput;
	deleteTag: DeleteTagInput;
	searchReplies: SearchRepliesInput;
	searchSendLogs: SearchSendLogsInput;
	sendSms: SendSmsInput;
	sendBulkEmail: SendBulkEmailInput;
};

export type DripcelEndpointOutputs = {
	getContact: GetContactOutput;
	createContacts: CreateContactsOutput;
	upsertContacts: UpsertContactsOutput;
	deleteContact: DeleteContactOutput;
	addContactTags: AddContactTagsOutput;
	optOutContact: OptOutContactOutput;
	checkCompliance: CheckComplianceOutput;
	listDeliveries: ListDeliveriesOutput;
	listCampaigns: ListCampaignsOutput;
	getBalance: GetBalanceOutput;
	listEmailTemplates: ListEmailTemplatesOutput;
	uploadSales: UploadSalesOutput;
	listTags: ListTagsOutput;
	deleteTag: DeleteTagOutput;
	searchReplies: SearchRepliesOutput;
	searchSendLogs: SearchSendLogsOutput;
	sendSms: SendSmsOutput;
	sendBulkEmail: SendBulkEmailOutput;
};

export const DripcelEndpointInputSchemas = {
	getContact: GetContactInputSchema,
	createContacts: CreateContactsInputSchema,
	upsertContacts: UpsertContactsInputSchema,
	deleteContact: DeleteContactInputSchema,
	addContactTags: AddContactTagsInputSchema,
	optOutContact: OptOutContactInputSchema,
	checkCompliance: CheckComplianceInputSchema,
	listDeliveries: ListDeliveriesInputSchema,
	listCampaigns: ListCampaignsInputSchema,
	getBalance: GetBalanceInputSchema,
	listEmailTemplates: ListEmailTemplatesInputSchema,
	uploadSales: UploadSalesInputSchema,
	listTags: ListTagsInputSchema,
	deleteTag: DeleteTagInputSchema,
	searchReplies: SearchRepliesInputSchema,
	searchSendLogs: SearchSendLogsInputSchema,
	sendSms: SendSmsInputSchema,
	sendBulkEmail: SendBulkEmailInputSchema,
} as const;

export const DripcelEndpointOutputSchemas = {
	getContact: GetContactOutputSchema,
	createContacts: CreateContactsOutputSchema,
	upsertContacts: UpsertContactsOutputSchema,
	deleteContact: DeleteContactOutputSchema,
	addContactTags: AddContactTagsOutputSchema,
	optOutContact: OptOutContactOutputSchema,
	checkCompliance: CheckComplianceOutputSchema,
	listDeliveries: ListDeliveriesOutputSchema,
	listCampaigns: ListCampaignsOutputSchema,
	getBalance: GetBalanceOutputSchema,
	listEmailTemplates: ListEmailTemplatesOutputSchema,
	uploadSales: UploadSalesOutputSchema,
	listTags: ListTagsOutputSchema,
	deleteTag: DeleteTagOutputSchema,
	searchReplies: SearchRepliesOutputSchema,
	searchSendLogs: SearchSendLogsOutputSchema,
	sendSms: SendSmsOutputSchema,
	sendBulkEmail: SendBulkEmailOutputSchema,
} as const;
