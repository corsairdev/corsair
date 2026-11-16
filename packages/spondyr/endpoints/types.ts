import { z } from 'zod';

/**
 * Spondyr wraps every answer in an envelope whose `APIStatus` is `OK` or
 * `ERROR`. Most routes put their payload in `Data`.
 *
 * `ErrorMessage` is `null` on success on some routes and absent on others, so
 * it is nullish rather than optional.
 */
const EnvelopeFields = {
	APIStatus: z.string().describe('`OK` or `ERROR`; a 200 can still be `ERROR`'),
	ErrorMessage: z.string().nullish(),
};

const EnvelopeSchema = z.object(EnvelopeFields).loose();

/**
 * A document payload. Spondyr accepts whatever the Transaction Type's JSON
 * sample defines, so values are open JSON rather than a fixed object. The union
 * is what the reference page can render; `z.unknown()` would print as `any`.
 */
const DocumentDataSchema = z.record(
	z.string(),
	z.union([z.string(), z.number(), z.boolean(), z.null()]),
);

/** A write's envelope, which carries the reference ID a caller polls with. */
const ReferenceEnvelopeSchema = EnvelopeSchema.extend({
	ReferenceID: z.string().nullish(),
}).loose();
export type ReferenceEnvelope = z.output<typeof ReferenceEnvelopeSchema>;

/** The Transaction Type object, as the list and get routes return it. */
const TransactionTypeSchema = z
	.object({
		Name: z.string(),
		TemplateJSON: z
			.string()
			.nullish()
			.describe('Sample JSON, flattened for templates'),
		TemplateCSV: z
			.string()
			.nullish()
			.describe('Comma-delimited flattened fields'),
	})
	.loose();

const EventTypeSchema = z
	.object({
		TransactionType: z.string(),
		Name: z.string(),
	})
	.loose();

const RecipientSchema = z
	.object({
		TransactionType: z.string(),
		Name: z.string(),
		RemoteID: z.string().nullish(),
		FirstName: z.string().nullish(),
		LastName: z.string().nullish(),
		Address1: z.string().nullish(),
		Address2: z.string().nullish(),
		City: z.string().nullish(),
		State: z.string().nullish(),
		Zip: z.string().nullish(),
		Fax: z.string().nullish(),
		Email: z.string().nullish(),
		MobilePhone: z.string().nullish(),
	})
	.loose();

const ConditionSchema = z
	.object({
		TransactionType: z.string(),
		Name: z.string(),
		FieldName: z.string().nullish(),
		PossibleValues: z
			.string()
			.nullish()
			.describe('Values separated by newlines'),
	})
	.loose();

const SearchFilterSchema = z
	.object({
		TransactionType: z.string(),
		Name: z.string(),
		Tag: z.string().nullish(),
	})
	.loose();

const TemplateRecipientSchema = z
	.object({
		Name: z.string(),
		DeliveryMethod: z.string().nullish(),
		EmailFromAddress: z.string().nullish(),
		EmailSubject: z.string().nullish(),
		EmailBody: z.string().nullish(),
		MailFromName: z.string().nullish(),
		MailFromAddress1: z.string().nullish(),
		MailFromAddress2: z.string().nullish(),
		MailFromCity: z.string().nullish(),
		MailFromState: z.string().nullish(),
		MailFromZip: z.string().nullish(),
		TextBody: z.string().nullish(),
		DestinationFolder: z.string().nullish(),
		Signers: z
			.array(
				z
					.object({
						Name: z.string(),
						Email: z.string(),
						Role: z.string(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

const TemplateConditionSchema = z
	.object({
		Name: z.string(),
		LogicalOperator: z.string().nullish(),
		CompareOperator: z.string().nullish(),
		CompareValue: z.string().nullish(),
	})
	.loose();

const TemplateSchema = z
	.object({
		TransactionType: z.string(),
		Name: z.string(),
		EventType: z.string().nullish(),
		ContentType: z.string().nullish().describe('PDF, DOC, HTML or TEXT'),
		TemplateContentReferenceID: z.string().nullish(),
		TemplateContent: z
			.string()
			.nullish()
			.describe('Base64 file contents, when returned'),
		Recipients: z.array(TemplateRecipientSchema).nullish(),
		Conditions: z.array(TemplateConditionSchema).nullish(),
		Searches: z.array(z.string()).nullish(),
	})
	.loose();

/** One entry in a correspondence status answer. */
const CorrespondenceSchema = z
	.object({
		URI: z.string().nullish().describe('Valid for 20 minutes'),
		Template: z.string().nullish(),
		ContentType: z.string().nullish(),
		StatusCode: z.string().nullish(),
		StatusName: z.string().nullish(),
		CreatedDate: z.string().nullish(),
		Recipients: z
			.array(
				z
					.object({
						Name: z.string().nullish(),
						DeliveryTo: z.string().nullish(),
						DeliveryStatusCode: z.string().nullish(),
						DeliveryStatusName: z.string().nullish(),
						IsSuccessful: z.boolean().nullish(),
						Details: z.string().nullish(),
						DeliveryDate: z.string().nullish(),
						CoverPageURI: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		SearchFilters: z
			.array(
				z.object({ Name: z.string(), Value: z.string().nullish() }).loose(),
			)
			.nullish(),
	})
	.loose();

/** The status object shared by the Status API and the Search API. */
const StatusSchema = z
	.object({
		ReferenceID: z.string(),
		StatusCode: z
			.string()
			.nullish()
			.describe(
				'SUBMITTED, MATCH, FINISH, FINISHPART, NOMATCH, QUEUEDLIM, QUEUEDSYS, CANCELED or ERROR',
			),
		StatusName: z.string().nullish(),
		CreatedDate: z.string().nullish(),
		Correspondence: z.array(CorrespondenceSchema).nullish(),
	})
	.loose();

const StatusEnvelopeSchema = EnvelopeSchema.extend({
	ReferenceID: z.string().nullish(),
	EventType: z.string().nullish(),
	CreatedDate: z.string().nullish(),
	StatusCode: z.string().nullish(),
	StatusName: z.string().nullish(),
	Correspondence: z.array(CorrespondenceSchema).nullish(),
	Data: DocumentDataSchema.nullish(),
}).loose();

// ---------------------------------------------------------------------------
// correspondence
// ---------------------------------------------------------------------------

const SendInputSchema = z.object({
	event_type: z
		.string()
		.min(1)
		.describe('Event Type name; Spondyr resolves the Transaction Type from it'),
	data: DocumentDataSchema.describe(
		'The document data, in the shape of the Transaction Type JSON sample',
	),
	is_generate_only: z
		.boolean()
		.optional()
		.describe(
			'When true the correspondence is generated but not delivered until `correspondence.deliver` is called',
		),
});
export type SendInput = z.input<typeof SendInputSchema>;

const SendOutputSchema = ReferenceEnvelopeSchema;
export type SendOutput = z.output<typeof SendOutputSchema>;

const NewRecipientSchema = z
	.object({
		Template: z
			.string()
			.optional()
			.describe('Template names, comma separated, or "All"'),
		RemoteID: z.string().optional(),
		FirstName: z.string().optional(),
		LastName: z.string().optional(),
		Address1: z.string().optional(),
		Address2: z.string().optional(),
		City: z.string().optional(),
		State: z.string().optional(),
		Zip: z.string().optional(),
		Fax: z.string().optional(),
		Email: z.string().optional(),
		MobilePhone: z.string().optional(),
		TargetedDeliveryMethod: z
			.enum(['Email', 'Fax', 'Mail', 'Text'])
			.optional()
			.describe(
				'Forces one channel; leave it out to let the delivery rules choose',
			),
	})
	.superRefine((value, ctx) => {
		// A targeted channel the recipient has no address for is marked
		// undeliverable, so the address is required up front.
		if (value.TargetedDeliveryMethod === 'Email' && !value.Email) {
			ctx.addIssue({
				code: 'custom',
				message: '`Email` is required when `TargetedDeliveryMethod` is Email',
				path: ['Email'],
			});
		}
		if (value.TargetedDeliveryMethod === 'Text' && !value.MobilePhone) {
			ctx.addIssue({
				code: 'custom',
				message:
					'`MobilePhone` is required when `TargetedDeliveryMethod` is Text',
				path: ['MobilePhone'],
			});
		}
		if (value.TargetedDeliveryMethod === 'Fax' && !value.Fax) {
			ctx.addIssue({
				code: 'custom',
				message: '`Fax` is required when `TargetedDeliveryMethod` is Fax',
				path: ['Fax'],
			});
		}
	});
export type NewRecipientInput = z.input<typeof NewRecipientSchema>;

const DeliverInputSchema = z.object({
	reference_id: z
		.string()
		.min(1)
		.describe('The ReferenceID returned by `correspondence.send`'),
	template: z
		.string()
		.optional()
		.describe('Template names to deliver, comma separated; default "All"'),
	original_recipients: z
		.string()
		.optional()
		.describe('"All", "None", or Recipient names; default "All"'),
	new_recipients: z
		.array(NewRecipientSchema)
		.optional()
		.describe('Extra recipients beyond the ones the correspondence resolved'),
});
export type DeliverInput = z.input<typeof DeliverInputSchema>;

const DeliverOutputSchema = ReferenceEnvelopeSchema;
export type DeliverOutput = z.output<typeof DeliverOutputSchema>;

const StatusInputSchema = z.object({
	reference_id: z.string().min(1),
	include_data: z
		.boolean()
		.optional()
		.describe('Also return the Data sent with the original request'),
});
export type StatusInput = z.input<typeof StatusInputSchema>;

const StatusOutputSchema = StatusEnvelopeSchema;
export type StatusOutput = z.output<typeof StatusOutputSchema>;

const RetryInputSchema = z.object({
	reference_id: z
		.string()
		.min(1)
		.describe('ReferenceID of the request that errored'),
	template: z
		.string()
		.optional()
		.describe('Template names to retry, comma separated; default "All"'),
});
export type RetryInput = z.input<typeof RetryInputSchema>;

const RetryOutputSchema = ReferenceEnvelopeSchema;
export type RetryOutput = z.output<typeof RetryOutputSchema>;

const BatchSendInputSchema = z.object({
	event_type: z.string().min(1),
	data: z
		.array(DocumentDataSchema)
		.min(1)
		.describe('One entry per correspondence to generate'),
	shared_data: DocumentDataSchema.optional().describe(
		'Merged into every entry of `data` before processing',
	),
	is_generate_only: z.boolean().optional(),
});
export type BatchSendInput = z.input<typeof BatchSendInputSchema>;

const BatchSendOutputSchema = ReferenceEnvelopeSchema;
export type BatchSendOutput = z.output<typeof BatchSendOutputSchema>;

const BatchStatusInputSchema = z.object({
	reference_id: z
		.string()
		.min(1)
		.describe('The ReferenceID returned by `batch.send`'),
});
export type BatchStatusInput = z.input<typeof BatchStatusInputSchema>;

const BatchStatusOutputSchema = EnvelopeSchema.extend({
	ReferenceID: z.string().nullish(),
	EventType: z.string().nullish(),
	IsGenerateOnly: z.boolean().nullish(),
	StatusCode: z.string().nullish(),
	StatusName: z.string().nullish(),
	CreatedDate: z.string().nullish(),
	URI: z.string().nullish().describe('Valid for 20 minutes'),
	BatchSize: z.number().nullish(),
	TotalProcessed: z.number().nullish(),
	BatchErrors: z
		.array(
			z
				.object({
					ReferenceID: z.string().nullish(),
					Index: z.number().nullish(),
					Issue: z.string().nullish(),
				})
				.loose(),
		)
		.nullish(),
}).loose();
export type BatchStatusOutput = z.output<typeof BatchStatusOutputSchema>;

const SearchInputSchema = z.object({
	batch_reference_id: z
		.string()
		.optional()
		.describe('Only correspondence from this batch'),
	event_type: z
		.string()
		.optional()
		.describe('Only this Event Type; omitted searches every type'),
	search_name: z.string().optional().describe('Search Filter name'),
	search_value: z.string().optional().describe('Search Filter value to match'),
	page: z.number().int().min(1).optional().describe('Default 1'),
	page_size: z
		.number()
		.int()
		.min(1)
		.max(250)
		.optional()
		.describe('Default 10, maximum 250'),
	sort_column: z.string().optional().describe('Default "CreatedDate"'),
	sort_order: z.enum(['ASC', 'DESC']).optional(),
});
export type SearchInput = z.input<typeof SearchInputSchema>;

const SearchOutputSchema = EnvelopeSchema.extend({
	Data: z.array(StatusSchema),
	PageCount: z.number().nullish(),
	RecordCount: z.number().nullish(),
	Page: z.number().nullish(),
	PageSize: z.number().nullish(),
	SortColumn: z.string().nullish(),
	SortOrder: z.string().nullish(),
}).loose();
export type SearchOutput = z.output<typeof SearchOutputSchema>;

// ---------------------------------------------------------------------------
// transaction types
// ---------------------------------------------------------------------------

const ListTransactionTypesInputSchema = z.object({});
export type ListTransactionTypesInput = z.input<
	typeof ListTransactionTypesInputSchema
>;

const ListTransactionTypesOutputSchema = EnvelopeSchema.extend({
	Data: z.array(TransactionTypeSchema),
}).loose();
export type ListTransactionTypesOutput = z.output<
	typeof ListTransactionTypesOutputSchema
>;

const TransactionTypeInputSchema = z.object({
	transaction_type: z.string().min(1),
});
export type TransactionTypeInput = z.input<typeof TransactionTypeInputSchema>;

const TransactionTypeOutputSchema = EnvelopeSchema.extend({
	Name: z.string().nullish(),
	TemplateJSON: z.string().nullish(),
	TemplateCSV: z.string().nullish(),
}).loose();
export type TransactionTypeOutput = z.output<
	typeof TransactionTypeOutputSchema
>;

const CreateTransactionTypeInputSchema = z.object({
	name: z.string().min(1),
	template_json: z
		.string()
		.min(1)
		.describe('JSON sample defining the fields available to templates'),
});
export type CreateTransactionTypeInput = z.input<
	typeof CreateTransactionTypeInputSchema
>;

const UpdateTransactionTypeInputSchema =
	CreateTransactionTypeInputSchema.extend({
		transaction_type: z
			.string()
			.min(1)
			.describe(
				'The Transaction Type to update; goes in the body, not the path',
			),
	});
export type UpdateTransactionTypeInput = z.input<
	typeof UpdateTransactionTypeInputSchema
>;

// ---------------------------------------------------------------------------
// event types
// ---------------------------------------------------------------------------

const ListEventTypesInputSchema = z.object({
	transaction_type: z
		.string()
		.min(1)
		.describe('Transaction Type whose Event Types to list'),
});
export type ListEventTypesInput = z.input<typeof ListEventTypesInputSchema>;

const ListEventTypesOutputSchema = EnvelopeSchema.extend({
	Data: z.array(EventTypeSchema),
}).loose();
export type ListEventTypesOutput = z.output<typeof ListEventTypesOutputSchema>;

const EventTypeInputSchema = z.object({
	event_type: z.string().min(1),
});
export type EventTypeInput = z.input<typeof EventTypeInputSchema>;

const EventTypeOutputSchema = EnvelopeSchema.extend({
	TransactionType: z.string().nullish(),
	Name: z.string().nullish(),
}).loose();
export type EventTypeOutput = z.output<typeof EventTypeOutputSchema>;

const CreateEventTypeInputSchema = z.object({
	transaction_type: z.string().min(1),
	name: z.string().min(1),
});
export type CreateEventTypeInput = z.input<typeof CreateEventTypeInputSchema>;

const UpdateEventTypeInputSchema = CreateEventTypeInputSchema.extend({
	event_type: z.string().min(1).describe('The Event Type to update'),
});
export type UpdateEventTypeInput = z.input<typeof UpdateEventTypeInputSchema>;

// ---------------------------------------------------------------------------
// recipients
// ---------------------------------------------------------------------------

const RecipientFields = {
	name: z.string().min(1),
	remote_id: z
		.string()
		.optional()
		.describe(
			'The identifier in your own system; `{FieldName}` merges transaction data',
		),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	address1: z.string().optional(),
	address2: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	zip: z.string().optional(),
	fax: z.string().optional(),
	email: z.string().optional(),
	mobile_phone: z.string().optional(),
};

const ListRecipientsInputSchema = z.object({
	transaction_type: z.string().min(1),
});
export type ListRecipientsInput = z.input<typeof ListRecipientsInputSchema>;

const ListRecipientsOutputSchema = EnvelopeSchema.extend({
	Data: z.array(RecipientSchema),
}).loose();
export type ListRecipientsOutput = z.output<typeof ListRecipientsOutputSchema>;

const RecipientInputSchema = z.object({
	transaction_type: z.string().min(1),
	recipient: z.string().min(1),
});
export type RecipientInput = z.input<typeof RecipientInputSchema>;

const RecipientOutputSchema = EnvelopeSchema.extend({
	TransactionType: z.string().nullish(),
	Name: z.string().nullish(),
	RemoteID: z.string().nullish(),
	FirstName: z.string().nullish(),
	LastName: z.string().nullish(),
	Address1: z.string().nullish(),
	Address2: z.string().nullish(),
	City: z.string().nullish(),
	State: z.string().nullish(),
	Zip: z.string().nullish(),
	Fax: z.string().nullish(),
	Email: z.string().nullish(),
	MobilePhone: z.string().nullish(),
}).loose();
export type RecipientOutput = z.output<typeof RecipientOutputSchema>;

const CreateRecipientInputSchema = z.object({
	transaction_type: z.string().min(1),
	...RecipientFields,
});
export type CreateRecipientInput = z.input<typeof CreateRecipientInputSchema>;

const UpdateRecipientInputSchema = CreateRecipientInputSchema.extend({
	recipient: z.string().min(1).describe('The Recipient to update'),
});
export type UpdateRecipientInput = z.input<typeof UpdateRecipientInputSchema>;

// ---------------------------------------------------------------------------
// conditions
// ---------------------------------------------------------------------------

const ListConditionsInputSchema = z.object({
	transaction_type: z.string().min(1),
});
export type ListConditionsInput = z.input<typeof ListConditionsInputSchema>;

const ListConditionsOutputSchema = EnvelopeSchema.extend({
	Data: z.array(ConditionSchema),
}).loose();
export type ListConditionsOutput = z.output<typeof ListConditionsOutputSchema>;

const ConditionInputSchema = z.object({
	transaction_type: z.string().min(1),
	condition: z.string().min(1),
});
export type ConditionInput = z.input<typeof ConditionInputSchema>;

const ConditionOutputSchema = EnvelopeSchema.extend({
	TransactionType: z.string().nullish(),
	Name: z.string().nullish(),
	FieldName: z.string().nullish(),
	PossibleValues: z.string().nullish(),
}).loose();
export type ConditionOutput = z.output<typeof ConditionOutputSchema>;

const CreateConditionInputSchema = z.object({
	transaction_type: z.string().min(1),
	name: z.string().min(1),
	field_name: z
		.string()
		.min(1)
		.describe('The Transaction Type field this condition inspects'),
	possible_values: z
		.string()
		.optional()
		.describe('Values to match, each on its own line'),
});
export type CreateConditionInput = z.input<typeof CreateConditionInputSchema>;

const UpdateConditionInputSchema = CreateConditionInputSchema.extend({
	condition: z.string().min(1).describe('The Condition to update'),
});
export type UpdateConditionInput = z.input<typeof UpdateConditionInputSchema>;

// ---------------------------------------------------------------------------
// search filters
// ---------------------------------------------------------------------------

const ListSearchFiltersInputSchema = z.object({
	transaction_type: z.string().min(1),
});
export type ListSearchFiltersInput = z.input<
	typeof ListSearchFiltersInputSchema
>;

const ListSearchFiltersOutputSchema = EnvelopeSchema.extend({
	Data: z.array(SearchFilterSchema),
}).loose();
export type ListSearchFiltersOutput = z.output<
	typeof ListSearchFiltersOutputSchema
>;

const SearchFilterInputSchema = z.object({
	search: z.string().min(1),
});
export type SearchFilterInput = z.input<typeof SearchFilterInputSchema>;

const SearchFilterOutputSchema = EnvelopeSchema.extend({
	TransactionType: z.string().nullish(),
	Name: z.string().nullish(),
	Tag: z.string().nullish(),
}).loose();
export type SearchFilterOutput = z.output<typeof SearchFilterOutputSchema>;

const CreateSearchFilterInputSchema = z.object({
	transaction_type: z.string().min(1),
	name: z.string().min(1),
	tag: z
		.string()
		.optional()
		.describe(
			'The value written onto matching correspondence; `{FieldName}` merges data',
		),
});
export type CreateSearchFilterInput = z.input<
	typeof CreateSearchFilterInputSchema
>;

const UpdateSearchFilterInputSchema = CreateSearchFilterInputSchema.extend({
	search: z.string().min(1).describe('The Search Filter to update'),
});
export type UpdateSearchFilterInput = z.input<
	typeof UpdateSearchFilterInputSchema
>;

// ---------------------------------------------------------------------------
// templates
// ---------------------------------------------------------------------------

const TemplateSignerSchema = z.object({
	name: z.string().min(1),
	email: z.email(),
	role: z
		.enum([
			'Signer',
			'Agent',
			'CC',
			'Certified Delivery',
			'Editor',
			'In Person Signer',
			'Intermediary',
		])
		.describe('DocuSign role'),
});

const TemplateRecipientInputSchema = z
	.object({
		name: z.string().min(1),
		delivery_method: z
			.string()
			.min(1)
			.describe('Email, Fax, Mail, Text, DocuSign, or a Destination name'),
		email_from_address: z
			.string()
			.optional()
			.describe('Must be configured as a Sending Domain'),
		email_subject: z.string().optional(),
		email_body: z.string().optional(),
		mail_from_name: z.string().optional(),
		mail_from_address1: z.string().optional(),
		mail_from_address2: z.string().optional(),
		mail_from_city: z.string().optional(),
		mail_from_state: z.string().optional(),
		mail_from_zip: z.string().optional(),
		text_body: z.string().optional(),
		destination_folder: z
			.string()
			.optional()
			.describe(
				'Only for Destination recipients such as Google Drive or Dropbox',
			),
		signers: z
			.array(TemplateSignerSchema)
			.optional()
			.describe('Only for DocuSign delivery'),
	})
	.superRefine((value, ctx) => {
		// DocuSign delivery without a signer produces a document nobody can sign.
		if (
			value.delivery_method === 'DocuSign' &&
			(value.signers === undefined || value.signers.length === 0)
		) {
			ctx.addIssue({
				code: 'custom',
				message: 'DocuSign delivery needs at least one signer',
				path: ['signers'],
			});
		}
	});

const TemplateConditionInputSchema = z.object({
	name: z.string().min(1),
	logical_operator: z.enum(['AND', 'OR']),
	compare_operator: z
		.enum(['=', '>', '>=', '<', '<='])
		.describe('Comparison applied to the condition field'),
	compare_value: z
		.string()
		.min(1)
		.describe('One value per line when several are acceptable'),
});

const ListTemplatesInputSchema = z.object({
	transaction_type: z.string().min(1),
});
export type ListTemplatesInput = z.input<typeof ListTemplatesInputSchema>;

const ListTemplatesOutputSchema = EnvelopeSchema.extend({
	Data: z.array(TemplateSchema),
}).loose();
export type ListTemplatesOutput = z.output<typeof ListTemplatesOutputSchema>;

const TemplateInputSchema = z.object({
	transaction_type: z.string().min(1),
	template: z.string().min(1),
});
export type TemplateInput = z.input<typeof TemplateInputSchema>;

const TemplateOutputSchema = EnvelopeSchema.extend({
	TransactionType: z.string().nullish(),
	Name: z.string().nullish(),
	EventType: z.string().nullish(),
	ContentType: z.string().nullish(),
	TemplateContentReferenceID: z.string().nullish(),
	TemplateContent: z.string().nullish(),
	Recipients: z.array(TemplateRecipientSchema).nullish(),
	Conditions: z.array(TemplateConditionSchema).nullish(),
	Searches: z.array(z.string()).nullish(),
}).loose();
export type TemplateOutput = z.output<typeof TemplateOutputSchema>;

const CreateTemplateInputSchema = z.object({
	transaction_type: z.string().min(1),
	name: z.string().min(1),
	event_type: z.string().min(1),
	content_type: z.enum(['PDF', 'DOC', 'HTML', 'TEXT']),
	template_content_reference_id: z
		.string()
		.min(1)
		.describe('The ReferenceID returned by `templates.uploadContent`'),
	recipients: z.array(TemplateRecipientInputSchema).min(1),
	conditions: z.array(TemplateConditionInputSchema).optional(),
	searches: z
		.array(z.string())
		.optional()
		.describe('Search Filter names to tag with'),
});
export type CreateTemplateInput = z.input<typeof CreateTemplateInputSchema>;

const UpdateTemplateInputSchema = CreateTemplateInputSchema.extend({
	template: z.string().min(1).describe('The Template to update'),
});
export type UpdateTemplateInput = z.input<typeof UpdateTemplateInputSchema>;

const TemplateContentInputSchema = z.object({
	content: z
		.string()
		.min(1)
		.describe('Base64-encoded bytes of the template file'),
});
export type TemplateContentInput = z.input<typeof TemplateContentInputSchema>;

const TemplateContentOutputSchema = ReferenceEnvelopeSchema;
export type TemplateContentOutput = z.output<
	typeof TemplateContentOutputSchema
>;

/** Deletes answer only the envelope, with any failure in `ErrorMessage`. */
const DeleteOutputSchema = EnvelopeSchema;
export type DeleteOutput = z.output<typeof DeleteOutputSchema>;

export type SpondyrEndpointInputs = {
	send: SendInput;
	deliver: DeliverInput;
	status: StatusInput;
	retry: RetryInput;
	batchSend: BatchSendInput;
	batchStatus: BatchStatusInput;
	search: SearchInput;
	listTransactionTypes: ListTransactionTypesInput;
	getTransactionType: TransactionTypeInput;
	createTransactionType: CreateTransactionTypeInput;
	updateTransactionType: UpdateTransactionTypeInput;
	deleteTransactionType: TransactionTypeInput;
	listEventTypes: ListEventTypesInput;
	getEventType: EventTypeInput;
	createEventType: CreateEventTypeInput;
	updateEventType: UpdateEventTypeInput;
	deleteEventType: EventTypeInput;
	listRecipients: ListRecipientsInput;
	getRecipient: RecipientInput;
	createRecipient: CreateRecipientInput;
	updateRecipient: UpdateRecipientInput;
	deleteRecipient: RecipientInput;
	listConditions: ListConditionsInput;
	getCondition: ConditionInput;
	createCondition: CreateConditionInput;
	updateCondition: UpdateConditionInput;
	deleteCondition: ConditionInput;
	listSearchFilters: ListSearchFiltersInput;
	getSearchFilter: SearchFilterInput;
	createSearchFilter: CreateSearchFilterInput;
	updateSearchFilter: UpdateSearchFilterInput;
	deleteSearchFilter: SearchFilterInput;
	listTemplates: ListTemplatesInput;
	getTemplate: TemplateInput;
	createTemplate: CreateTemplateInput;
	updateTemplate: UpdateTemplateInput;
	deleteTemplate: TemplateInput;
	uploadTemplateContent: TemplateContentInput;
};

export type SpondyrEndpointOutputs = {
	send: SendOutput;
	deliver: DeliverOutput;
	status: StatusOutput;
	retry: RetryOutput;
	batchSend: BatchSendOutput;
	batchStatus: BatchStatusOutput;
	search: SearchOutput;
	listTransactionTypes: ListTransactionTypesOutput;
	getTransactionType: TransactionTypeOutput;
	createTransactionType: ReferenceEnvelope;
	updateTransactionType: ReferenceEnvelope;
	deleteTransactionType: DeleteOutput;
	listEventTypes: ListEventTypesOutput;
	getEventType: EventTypeOutput;
	createEventType: ReferenceEnvelope;
	updateEventType: ReferenceEnvelope;
	deleteEventType: DeleteOutput;
	listRecipients: ListRecipientsOutput;
	getRecipient: RecipientOutput;
	createRecipient: ReferenceEnvelope;
	updateRecipient: ReferenceEnvelope;
	deleteRecipient: DeleteOutput;
	listConditions: ListConditionsOutput;
	getCondition: ConditionOutput;
	createCondition: ReferenceEnvelope;
	updateCondition: ReferenceEnvelope;
	deleteCondition: DeleteOutput;
	listSearchFilters: ListSearchFiltersOutput;
	getSearchFilter: SearchFilterOutput;
	createSearchFilter: ReferenceEnvelope;
	updateSearchFilter: ReferenceEnvelope;
	deleteSearchFilter: DeleteOutput;
	listTemplates: ListTemplatesOutput;
	getTemplate: TemplateOutput;
	createTemplate: ReferenceEnvelope;
	updateTemplate: ReferenceEnvelope;
	deleteTemplate: DeleteOutput;
	uploadTemplateContent: TemplateContentOutput;
};

export const SpondyrEndpointInputSchemas = {
	send: SendInputSchema,
	deliver: DeliverInputSchema,
	status: StatusInputSchema,
	retry: RetryInputSchema,
	batchSend: BatchSendInputSchema,
	batchStatus: BatchStatusInputSchema,
	search: SearchInputSchema,
	listTransactionTypes: ListTransactionTypesInputSchema,
	getTransactionType: TransactionTypeInputSchema,
	createTransactionType: CreateTransactionTypeInputSchema,
	updateTransactionType: UpdateTransactionTypeInputSchema,
	deleteTransactionType: TransactionTypeInputSchema,
	listEventTypes: ListEventTypesInputSchema,
	getEventType: EventTypeInputSchema,
	createEventType: CreateEventTypeInputSchema,
	updateEventType: UpdateEventTypeInputSchema,
	deleteEventType: EventTypeInputSchema,
	listRecipients: ListRecipientsInputSchema,
	getRecipient: RecipientInputSchema,
	createRecipient: CreateRecipientInputSchema,
	updateRecipient: UpdateRecipientInputSchema,
	deleteRecipient: RecipientInputSchema,
	listConditions: ListConditionsInputSchema,
	getCondition: ConditionInputSchema,
	createCondition: CreateConditionInputSchema,
	updateCondition: UpdateConditionInputSchema,
	deleteCondition: ConditionInputSchema,
	listSearchFilters: ListSearchFiltersInputSchema,
	getSearchFilter: SearchFilterInputSchema,
	createSearchFilter: CreateSearchFilterInputSchema,
	updateSearchFilter: UpdateSearchFilterInputSchema,
	deleteSearchFilter: SearchFilterInputSchema,
	listTemplates: ListTemplatesInputSchema,
	getTemplate: TemplateInputSchema,
	createTemplate: CreateTemplateInputSchema,
	updateTemplate: UpdateTemplateInputSchema,
	deleteTemplate: TemplateInputSchema,
	uploadTemplateContent: TemplateContentInputSchema,
} as const;

export const SpondyrEndpointOutputSchemas = {
	send: SendOutputSchema,
	deliver: DeliverOutputSchema,
	status: StatusEnvelopeSchema,
	retry: RetryOutputSchema,
	batchSend: BatchSendOutputSchema,
	batchStatus: BatchStatusOutputSchema,
	search: SearchOutputSchema,
	listTransactionTypes: ListTransactionTypesOutputSchema,
	getTransactionType: TransactionTypeOutputSchema,
	createTransactionType: ReferenceEnvelopeSchema,
	updateTransactionType: ReferenceEnvelopeSchema,
	deleteTransactionType: EnvelopeSchema,
	listEventTypes: ListEventTypesOutputSchema,
	getEventType: EventTypeOutputSchema,
	createEventType: ReferenceEnvelopeSchema,
	updateEventType: ReferenceEnvelopeSchema,
	deleteEventType: EnvelopeSchema,
	listRecipients: ListRecipientsOutputSchema,
	getRecipient: RecipientOutputSchema,
	createRecipient: ReferenceEnvelopeSchema,
	updateRecipient: ReferenceEnvelopeSchema,
	deleteRecipient: EnvelopeSchema,
	listConditions: ListConditionsOutputSchema,
	getCondition: ConditionOutputSchema,
	createCondition: ReferenceEnvelopeSchema,
	updateCondition: ReferenceEnvelopeSchema,
	deleteCondition: EnvelopeSchema,
	listSearchFilters: ListSearchFiltersOutputSchema,
	getSearchFilter: SearchFilterOutputSchema,
	createSearchFilter: ReferenceEnvelopeSchema,
	updateSearchFilter: ReferenceEnvelopeSchema,
	deleteSearchFilter: EnvelopeSchema,
	listTemplates: ListTemplatesOutputSchema,
	getTemplate: TemplateOutputSchema,
	createTemplate: ReferenceEnvelopeSchema,
	updateTemplate: ReferenceEnvelopeSchema,
	deleteTemplate: EnvelopeSchema,
	uploadTemplateContent: TemplateContentOutputSchema,
} as const;
