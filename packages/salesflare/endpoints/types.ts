import { z } from 'zod';

const SalesflareRecordSchema = z.object({}).passthrough();
const SalesflareListOutputSchema = z.array(SalesflareRecordSchema);
const SalesflareResourceOutputSchema = SalesflareRecordSchema;
// unknown: delete acknowledgements arrive as an empty 204 body, an empty
// object, or occasionally a provider-side echo; any of these is a success.
const SalesflareEmptyOutputSchema = z.union([
	z.object({}).passthrough(),
	z.undefined(),
]);

const ListAccountsInputSchema = z.object({
	id: z.array(z.number()).optional(),
	details: z.boolean().optional(),
	search: z.string().optional(),
	name: z.string().optional(),
	creation_after: z.string().optional(),
	creation_before: z.string().optional(),
	min_size: z.number().optional(),
	max_size: z.number().optional(),
	domain: z.array(z.string()).optional(),
	tag: z.array(z.number()).optional(),
	'tag.name': z.array(z.string()).optional(),
	'address.country': z.array(z.string()).optional(),
	'address.city': z.array(z.string()).optional(),
	'address.state_region': z.array(z.string()).optional(),
	hotness: z.number().optional(),
	offset: z.number().optional(),
	custom: z.string().optional(),
	order_by: z.array(z.string()).optional(),
	q: z.string().optional(),
	limit: z.number().optional(),
	export: z.string().optional(),
});

const CreateAccountInputSchema = z
	.object({
		update_if_exists: z.boolean().optional(),
		owner: z.number().optional(),
		name: z.string().optional(),
		domain: z.string().optional(),
		picture: z.string().optional(),
		size: z.number().optional(),
		website: z.string().optional(),
		description: z.string().optional(),
		address: z.record(z.string(), z.unknown()).optional(),
		addresses: z
			.array(
				z.object({
					city: z.string().optional(),
					country: z.string().optional(),
					region: z.string().optional(),
					state_region: z.string().optional(),
					street: z.string().optional(),
					zip: z.string().optional(),
					_dirty: z.boolean().optional(),
				}),
			)
			.optional(),
		email: z.string().optional(),
		email_addresses: z
			.array(
				z.object({
					email: z.string(),
					_dirty: z.boolean().optional(),
				}),
			)
			.optional(),
		phone_number: z.string().optional(),
		phone_numbers: z
			.array(
				z.object({
					number: z.string(),
					type: z.string().optional(),
					_dirty: z.boolean().optional(),
				}),
			)
			.optional(),
		social_profiles: z.array(z.string()).optional(),
		tags: z.array(z.string()).optional(),
		links: z.string().optional(),
		customers: z
			.array(
				z.object({
					id: z.number(),
					email: z.string().optional(),
					name: z.string().optional(),
				}),
			)
			.optional(),
		_dirty: z.boolean().optional(),
		parent_account: z.number().optional(),
		custom: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();

const ListContactsInputSchema = z.object({
	id: z.array(z.number()).optional(),
	name: z.string().optional(),
	email: z.string().optional(),
	phone_number: z.string().optional(),
	domain: z.string().optional(),
	modification_after: z.string().optional(),
	modification_before: z.string().optional(),
	creation_after: z.string().optional(),
	creation_before: z.string().optional(),
	account: z.array(z.number()).optional(),
	tag: z.array(z.number()).optional(),
	'tag.name': z.array(z.string()).optional(),
	'position.role': z.array(z.string()).optional(),
	'address.country': z.array(z.string()).optional(),
	'address.state_region': z.array(z.string()).optional(),
	'address.city': z.array(z.string()).optional(),
	includeArchived: z.boolean().optional(),
	search: z.string().optional(),
	type: z.enum(['customer', 'mycontacts']).optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
	custom: z.string().optional(),
	order_by: z.array(z.string()).optional(),
	export: z.string().optional(),
	q: z.string().optional(),
});

const CreateContactInputSchema = z
	.object({
		force: z.boolean().optional(),
	})
	.passthrough();

const RetrieveAccountInputSchema = z.object({
	accountId: z.string().min(1),
});

const UpdateAccountInputSchema = z
	.object({
		accountId: z.string().min(1),
		name: z.string().optional(),
		domain: z.string().optional(),
		picture: z.string().optional(),
		size: z.number().optional(),
		website: z.string().optional(),
		description: z.string().optional(),
		address: z
			.object({
				id: z.number().optional(),
				city: z.string().optional(),
				country: z.string().optional(),
				region: z.string().optional(),
				state_region: z.string().optional(),
				street: z.string().optional(),
				zip: z.string().optional(),
				archived: z.boolean().optional(),
				_dirty: z.boolean().optional(),
			})
			.optional(),
		addresses: z
			.array(
				z.object({
					id: z.number().optional(),
					city: z.string().optional(),
					country: z.string().optional(),
					region: z.string().optional(),
					state_region: z.string().optional(),
					street: z.string().optional(),
					zip: z.string().optional(),
					archived: z.boolean().optional(),
					_dirty: z.boolean().optional(),
				}),
			)
			.optional(),
		email: z.string().optional(),
		email_addresses: z
			.array(
				z.object({
					id: z.number().optional(),
					email: z.string().optional(),
					archived: z.boolean().optional(),
					_dirty: z.boolean().optional(),
				}),
			)
			.optional(),
		phone_number: z.string().optional(),
		phone_numbers: z
			.array(
				z.object({
					id: z.number().optional(),
					number: z.string().optional(),
					type: z.string().optional(),
					archived: z.boolean().optional(),
					_dirty: z.boolean().optional(),
				}),
			)
			.optional(),
		social_profiles: z.array(z.string()).optional(),
		tags: z.array(z.string()).optional(),
		links: z.string().optional(),
		_dirty: z.boolean().optional(),
		parent_account: z.number().optional(),
		custom: z.record(z.string(), z.unknown()).optional(),
		q: z
			.object({
				condition: z.enum(['AND', 'OR']),
				rules: z.array(z.record(z.string(), z.unknown())),
				order_by: z.string().optional(),
				not: z.boolean().optional(),
				valid: z.boolean().optional(),
				search: z.string().optional(),
			})
			.optional(),
	})
	.passthrough();

const DeleteAccountInputSchema = z.object({
	accountId: z.string().min(1),
});

const RetrieveContactInputSchema = z.object({
	contactId: z.string().min(1),
});

const UpdateContactInputSchema = z
	.object({
		contactId: z.string().min(1),
		force: z.boolean().optional(),
		prefix: z.string().optional(),
		firstname: z.string().optional(),
		middle: z.string().optional(),
		lastname: z.string().optional(),
		suffix: z.string().optional(),
		email: z.string().optional(),
		role: z.string().optional(),
		name: z.string().optional(),
		owner: z.number().optional(),
		picture: z.string().optional(),
		account: z.number().optional(),
		birth_date: z.string().optional(),
		'opt-out': z.boolean().optional(),
		'opt-out_date': z.string().optional(),
		'opt-out_campaign': z.string().optional(),
		bounced: z.boolean().optional(),
		bounced_date: z.string().optional(),
		files: z.array(z.record(z.string(), z.unknown())).optional(),
		tags: z.array(z.string()).optional(),
		address: z
			.object({
				id: z.number().optional(),
				city: z.string().optional(),
				country: z.string().optional(),
				region: z.string().optional(),
				state_region: z.string().optional(),
				street: z.string().optional(),
				type: z.string().optional(),
				zip: z.string().optional(),
				archived: z.boolean().optional(),
				_dirty: z.boolean().optional(),
			})
			.optional(),
		addresses: z
			.array(
				z.object({
					id: z.number().optional(),
					city: z.string().optional(),
					country: z.string().optional(),
					region: z.string().optional(),
					state_region: z.string().optional(),
					street: z.string().optional(),
					type: z.string().optional(),
					zip: z.string().optional(),
					archived: z.boolean().optional(),
					_dirty: z.boolean().optional(),
				}),
			)
			.optional(),
		phone_number: z.string().optional(),
		mobile_phone_number: z.string().optional(),
		home_phone_number: z.string().optional(),
		fax_number: z.string().optional(),
		phone_numbers: z
			.array(
				z.object({
					id: z.number().optional(),
					number: z.string().optional(),
					type: z.string().optional(),
					archived: z.boolean().optional(),
					_dirty: z.boolean().optional(),
				}),
			)
			.optional(),
		position: z
			.object({
				id: z.number().optional(),
				organisation: z.string().optional(),
				role: z.string().optional(),
				archived: z.boolean().optional(),
				_dirty: z.boolean().optional(),
			})
			.optional(),
		positions: z
			.array(
				z.object({
					id: z.number().optional(),
					organisation: z.string().optional(),
					role: z.string().optional(),
					archived: z.boolean().optional(),
					_dirty: z.boolean().optional(),
				}),
			)
			.optional(),
		social_profiles: z.array(z.string()).optional(),
		custom: z.record(z.string(), z.unknown()).optional(),
		_dirty: z.boolean().optional(),
		archived: z.boolean().optional(),
	})
	.passthrough();

const DeleteContactInputSchema = z.object({
	contactId: z.string().min(1),
});

const ListCustomFieldTypesInputSchema = z.object({});

const ListCustomFieldsInputSchema = z.object({
	itemClass: z.string().min(1),
	includeDisabled: z.boolean().optional(),
	pipeline: z.number().optional(),
	name: z.string().optional(),
});

const CreateCustomFieldSubInputSchema = z
	.object({
		itemClass: z.string().min(1),
		type: z.number().optional(),
		name: z.string().optional(),
		enabled: z.boolean().optional(),
		archived: z.boolean().optional(),
		required: z.boolean().optional(),
		pipeline: z.number().optional(),
		predefined_customfield: z.number().optional(),
		users_can_add_options: z.boolean().optional(),
		options: z
			.array(
				z.object({
					id: z.number().optional(),
					order: z.number().optional(),
					archived: z.boolean().optional(),
					name: z.string(),
				}),
			)
			.optional(),
		order_alphabetically: z.boolean().optional(),
		min_number: z.number().optional(),
		max_number: z.number().optional(),
		min_date: z.string().optional(),
		max_date: z.string().optional(),
		default_boolean_value: z.boolean().optional(),
	})
	.passthrough();

const ListAccountMessagesInputSchema = z.object({
	accountId: z.string().min(1),
	before: z.string().optional(),
	after: z.string().optional(),
	limit: z.number().optional(),
});

const ListAccountFeedInputSchema = z.object({
	accountId: z.string().min(1),
	before: z.string().optional(),
	after: z.string().optional(),
	limit: z.number().optional(),
	types: z
		.array(
			z.enum([
				'email',
				'message',
				'meeting-live',
				'meeting-phone',
				'forward',
				'webpage',
				'user_added',
				'user_removed',
				'account_created',
			]),
		)
		.optional(),
	contacts: z.array(z.number()).optional(),
});

const RetrieveCustomFieldInputSchema = z.object({
	itemClass: z.string().min(1),
	id: z.string().min(1),
});

const UpdateCustomFieldInputSchema = z
	.object({
		itemClass: z.string().min(1),
		id: z.string().min(1),
		type: z.number().optional(),
		name: z.string().optional(),
		enabled: z.boolean().optional(),
		archived: z.boolean().optional(),
		required: z.boolean().optional(),
		pipeline: z.number().optional(),
		pipelineName: z.string().optional(),
		order: z.number().optional(),
		predefined_customfield: z.number().optional(),
		users_can_add_options: z.boolean().optional(),
		options: z
			.array(
				z.object({
					id: z.number().optional(),
					order: z.number().optional(),
					archived: z.boolean().optional(),
					name: z.string(),
				}),
			)
			.optional(),
		order_alphabetically: z.boolean().optional(),
		min_number: z.number().optional(),
		max_number: z.number().optional(),
		min_date: z.string().optional(),
		max_date: z.string().optional(),
	})
	.passthrough();

const DeleteCustomFieldInputSchema = z.object({
	itemClass: z.string().min(1),
	id: z.string().min(1),
});

const ListCustomFieldOptionsInputSchema = z.object({
	itemClass: z.string().min(1),
	customFieldApiField: z.string().min(1),
	searchString: z.string().optional(),
});

const AddAccountUsersInputSchema = z
	.object({
		accountId: z.string().min(1),
	})
	.passthrough();

const UpdateAccountUsersInputSchema = z
	.object({
		accountId: z.string().min(1),
	})
	.passthrough();

const AddAccountContactsInputSchema = z
	.object({
		accountId: z.string().min(1),
	})
	.passthrough();

const UpdateAccountContactsInputSchema = z
	.object({
		accountId: z.string().min(1),
	})
	.passthrough();

export const SalesflareEndpointInputSchemas = {
	listAccounts: ListAccountsInputSchema,
	createAccount: CreateAccountInputSchema,
	listContacts: ListContactsInputSchema,
	createContact: CreateContactInputSchema,
	retrieveAccount: RetrieveAccountInputSchema,
	updateAccount: UpdateAccountInputSchema,
	deleteAccount: DeleteAccountInputSchema,
	retrieveContact: RetrieveContactInputSchema,
	updateContact: UpdateContactInputSchema,
	deleteContact: DeleteContactInputSchema,
	listCustomFieldTypes: ListCustomFieldTypesInputSchema,
	listCustomFields: ListCustomFieldsInputSchema,
	createCustomFieldSub: CreateCustomFieldSubInputSchema,
	listAccountMessages: ListAccountMessagesInputSchema,
	listAccountFeed: ListAccountFeedInputSchema,
	retrieveCustomField: RetrieveCustomFieldInputSchema,
	updateCustomField: UpdateCustomFieldInputSchema,
	deleteCustomField: DeleteCustomFieldInputSchema,
	listCustomFieldOptions: ListCustomFieldOptionsInputSchema,
	addAccountUsers: AddAccountUsersInputSchema,
	updateAccountUsers: UpdateAccountUsersInputSchema,
	addAccountContacts: AddAccountContactsInputSchema,
	updateAccountContacts: UpdateAccountContactsInputSchema,
} as const;

export const SalesflareEndpointOutputSchemas = {
	listAccounts: SalesflareListOutputSchema,
	createAccount: SalesflareResourceOutputSchema,
	listContacts: SalesflareListOutputSchema,
	createContact: SalesflareResourceOutputSchema,
	retrieveAccount: SalesflareResourceOutputSchema,
	updateAccount: SalesflareResourceOutputSchema,
	deleteAccount: SalesflareEmptyOutputSchema,
	retrieveContact: SalesflareResourceOutputSchema,
	updateContact: SalesflareResourceOutputSchema,
	deleteContact: SalesflareEmptyOutputSchema,
	listCustomFieldTypes: SalesflareListOutputSchema,
	listCustomFields: SalesflareResourceOutputSchema,
	createCustomFieldSub: SalesflareResourceOutputSchema,
	listAccountMessages: SalesflareResourceOutputSchema,
	listAccountFeed: SalesflareResourceOutputSchema,
	retrieveCustomField: SalesflareResourceOutputSchema,
	updateCustomField: SalesflareResourceOutputSchema,
	deleteCustomField: SalesflareEmptyOutputSchema,
	listCustomFieldOptions: SalesflareResourceOutputSchema,
	addAccountUsers: SalesflareResourceOutputSchema,
	updateAccountUsers: SalesflareResourceOutputSchema,
	addAccountContacts: SalesflareResourceOutputSchema,
	updateAccountContacts: SalesflareResourceOutputSchema,
} as const;

export type SalesflareEndpointInputs = {
	[K in keyof typeof SalesflareEndpointInputSchemas]: z.infer<
		(typeof SalesflareEndpointInputSchemas)[K]
	>;
};

export type SalesflareEndpointOutputs = {
	[K in keyof typeof SalesflareEndpointOutputSchemas]: z.infer<
		(typeof SalesflareEndpointOutputSchemas)[K]
	>;
};
