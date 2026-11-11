import { z } from 'zod';

// unknown: Salesflare returns open-ended records whose nested fields the
// provider does not fully document; endpoint-specific envelopes above are
// validated and passthrough keeps the undocumented remainder intact.
const SalesflareRecordSchema = z.object({}).passthrough();
const SalesflareListOutputSchema = z.array(SalesflareRecordSchema);
const SalesflareResourceOutputSchema = SalesflareRecordSchema;
// Array-bodied writes (contacts, calls, meetings, account users/contacts)
// also take a single object. Live, a single-object POST /contacts returns
// { id } although the spec documents [{ id }], so accept a record or a list
// of records and never report a successful write as a parse failure.
const SalesflareBatchWriteOutputSchema = z.union([
	SalesflareRecordSchema,
	z.array(SalesflareRecordSchema),
]);
// unknown: delete acknowledgements arrive as an empty 204 body, an empty
// object, or occasionally a provider-side echo; any of these is a success.
// Deletes reply 204, an empty object, or (per the spec) a string body.
const SalesflareEmptyOutputSchema = z.union([
	z.object({}).passthrough(),
	z.string(),
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
		// unknown: the provider leaves this field's shape undocumented; values pass through as-is
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
		// Salesflare takes the parent account as an id or as { id }.
		parent_account: z
			.union([z.number(), z.object({ id: z.number() })])
			.optional(),
		// unknown: the provider leaves this field's shape undocumented; values pass through as-is
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
		owner: z.number().optional(),
		domain: z.string().optional(),
		email: z.string().optional(),
		prefix: z.string().optional(),
		firstname: z.string().optional(),
		middle: z.string().optional(),
		lastname: z.string().optional(),
		suffix: z.string().optional(),
		name: z.string().optional(),
		picture: z.string().optional(),
		account: z.number().optional(),
		birth_date: z.string().optional(),
		'opt-out': z.boolean().optional(),
		'opt-out_date': z.string().optional(),
		'opt-out_campaign': z.string().optional(),
		bounced: z.boolean().optional(),
		bounced_date: z.string().optional(),
		// unknown: the provider leaves this field's shape undocumented; values pass through as-is
		files: z.array(z.record(z.string(), z.unknown())).optional(),
		tags: z.array(z.string()).optional(),
		address: z
			.object({
				city: z.string().optional(),
				country: z.string().optional(),
				region: z.string().optional(),
				state_region: z.string().optional(),
				street: z.string().optional(),
				type: z.string().optional(),
				zip: z.string().optional(),
			})
			.optional(),
		addresses: z
			.array(
				z.object({
					city: z.string().optional(),
					country: z.string().optional(),
					region: z.string().optional(),
					state_region: z.string().optional(),
					street: z.string().optional(),
					type: z.string().optional(),
					zip: z.string().optional(),
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
					number: z.string(),
					type: z.string().optional(),
				}),
			)
			.optional(),
		position: z
			.object({
				organisation: z.string().optional(),
				role: z.string().optional(),
			})
			.optional(),
		positions: z
			.array(
				z.object({
					end_date: z.string().optional(),
					start_date: z.string().optional(),
					current: z.boolean().optional(),
					primary: z.boolean().optional(),
					organisation: z.string().optional(),
					role: z.string().optional(),
				}),
			)
			.optional(),
		social_profiles: z.array(z.string()).optional(),
		// unknown: the provider leaves this field's shape undocumented; values pass through as-is
		custom: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();

const ListCurrenciesInputSchema = z.object({});

const ListGroupsInputSchema = z.object({});

const RetrieveCurrentUserInputSchema = z.object({});

const ListOpportunitiesInputSchema = z.object({
	search: z.string().optional(),
	// id, stage, stage.name and tag.name take one value or a list (repeated keys).
	id: z.union([z.number(), z.array(z.number())]).optional(),
	name: z.string().optional(),
	status: z.string().optional(),
	stage: z.union([z.number(), z.array(z.number())]).optional(),
	'stage.name': z.union([z.string(), z.array(z.string())]).optional(),
	owner: z.number().optional(),
	team_member: z.number().optional(),
	owner_group: z.number().optional(),
	assignee_group: z.number().optional(),
	team_member_group: z.number().optional(),
	account: z.number().optional(),
	assignee: z.number().optional(),
	min_value: z.number().optional(),
	max_value: z.number().optional(),
	close_after: z.string().optional(),
	close_before: z.string().optional(),
	creation_after: z.string().optional(),
	creation_before: z.string().optional(),
	closed: z.boolean().optional(),
	done: z.boolean().optional(),
	tag: z.array(z.number()).optional(),
	'tag.name': z.union([z.string(), z.array(z.string())]).optional(),
	hotness: z.number().optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
	order_by: z.array(z.string()).optional(),
	pipeline: z.number().optional(),
	custom: z.string().optional(),
	details: z.boolean().optional(),
	export: z.string().optional(),
	q: z.string().optional(),
});

const CreateOpportunityInputSchema = z
	.object({
		owner: z.number().optional(),
		account: z.number(),
		stage: z.number().optional(),
		lost_reason: z.number().optional(),
		// unknown: the provider leaves this field's shape undocumented; values pass through as-is
		files: z.array(z.record(z.string(), z.unknown())).optional(),
		lead_source: z.number().optional(),
		start_date: z.string().optional(),
		probability: z.number().optional(),
		assignee: z.number().optional(),
		creator: z.number().optional(),
		status: z.string().optional(),
		name: z.string().optional(),
		value: z.number().optional(),
		currency: z.number().optional(),
		status_date: z.string().optional(),
		close_date: z.string().optional(),
		closed: z.boolean().optional(),
		tags: z.array(z.string()).optional(),
		recurring_price_per_unit: z.number().optional(),
		frequency: z.enum(['annually', 'weekly', 'monthly', 'daily']).optional(),
		units: z.number().optional(),
		contract_start_date: z.string().optional(),
		contract_end_date: z.string().optional(),
		main_contact: z.number().optional(),
		// unknown: the provider leaves this field's shape undocumented; values pass through as-is
		custom: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();

const ListPersonsInputSchema = z.object({
	id: z.array(z.number()).optional(),
	name: z.string().optional(),
	email: z.string().optional(),
	search: z.string().optional(),
});

const ListPipelinesInputSchema = z.object({
	search: z.string().optional(),
	order_by: z.array(z.string()).optional(),
	q: z.string().optional(),
});

const ListStagesInputSchema = z.object({
	id: z.number().optional(),
	name: z.string().optional(),
	'pipeline.id': z.number().optional(),
	'pipeline.name': z.string().optional(),
	order_by: z.string().optional(),
});

const ListTagsInputSchema = z.object({
	id: z.array(z.number()).optional(),
	name: z.string().optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
	order_by: z.array(z.string()).optional(),
	q: z.string().optional(),
});

const CreateTagInputSchema = z
	.object({
		name: z.string(),
	})
	.passthrough();

const ListTasksInputSchema = z.object({
	id: z.array(z.number()).optional(),
	search: z.string().optional(),
	assignees: z.array(z.number()).optional(),
	type: z.array(z.number()).optional(),
	account: z.array(z.number()).optional(),
	order_by: z.array(z.string()).optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
	export: z.string().optional(),
	q: z.string().optional(),
});

const CreateTaskInputSchema = z
	.object({
		account: z.number().optional(),
		description: z.string(),
		reminder_date: z.string().optional(),
		assignees: z.array(z.number()).optional(),
	})
	.passthrough();

const ListUsersInputSchema = z.object({
	id: z.array(z.number()).optional(),
	name: z.string().optional(),
	email: z.string().optional(),
	search: z.string().optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
	order_by: z.array(z.string()).optional(),
	onlyEnabled: z.boolean().optional(),
});

const ListWorkflowsInputSchema = z.object({
	limit: z.number().optional(),
	offset: z.number().optional(),
	order_by: z.array(z.string()).optional(),
	search: z.string().optional(),
	q: z.string().optional(),
});

const CreateWorkflowInputSchema = z
	.object({
		name: z.string(),
		filter: z
			.object({
				ids: z.array(z.number()).optional(),
			})
			.optional(),
		// unknown: the provider leaves this field's shape undocumented; values pass through as-is
		individual_record_filter: z
			.object({
				condition: z.enum(['AND', 'OR']),
				// unknown: the provider leaves rules's shape undocumented; values pass through as-is
				rules: z.array(z.record(z.string(), z.unknown())),
				order_by: z.string().optional(),
				not: z.boolean().optional(),
				valid: z.boolean().optional(),
				search: z.string().optional(),
			})
			.optional(),
		status: z.enum(['live', 'paused', 'scheduled', 'draft']).optional(),
		status_message: z.string().optional(),
		record_type: z.enum(['contact']).optional(),
		goal: z.enum(['opened', 'clicked', 'replied']).optional(),
		continuous: z.boolean().optional(),
		exit_after_days: z.number().optional(),
		schedule_date: z.string().optional(),
		schedule_time_start: z.string().optional(),
		schedule_time_end: z.string().optional(),
		schedule_days: z.array(z.number()).optional(),
		// unknown: the provider leaves this field's shape undocumented; values pass through as-is
		steps: z
			.array(
				z.object({
					id: z.number().optional(),
					name: z.string().optional(),
					order: z.number(),
					// unknown: the provider leaves filter's shape undocumented; values pass through as-is
					filter: z.record(z.string(), z.unknown()).optional(),
					trigger_step: z.number().optional(),
					trigger_step_index: z.number().optional(),
					trigger_after_days: z.number().optional(),
					trigger: z
						.enum([
							'sent',
							'opened',
							'clicked',
							'replied',
							'not_opened',
							'not_replied',
							'not_clicked',
						])
						.optional(),
					action_type: z.enum(['send_email']).optional(),
					// unknown: the provider leaves action_config's shape undocumented; values pass through as-is
					action_config: z.record(z.string(), z.unknown()).optional(),
					action_status: z.string().optional(),
					action_source: z.number().optional(),
					action_source_email: z.string().optional(),
					// unknown: the provider leaves analytics's shape undocumented; values pass through as-is
					analytics: z.record(z.string(), z.unknown()).optional(),
					// unknown: the provider leaves metrics_data's shape undocumented; values pass through as-is
					metrics_data: z.record(z.string(), z.unknown()).optional(),
				}),
			)
			.optional(),
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
		// Salesflare takes the parent account as an id or as { id }.
		parent_account: z
			.union([z.number(), z.object({ id: z.number() })])
			.optional(),
		// unknown: the provider leaves this field's shape undocumented; values pass through as-is
		custom: z.record(z.string(), z.unknown()).optional(),
		// unknown: the provider leaves this field's shape undocumented; values pass through as-is
		q: z
			.object({
				condition: z.enum(['AND', 'OR']),
				// unknown: the provider leaves rules's shape undocumented; values pass through as-is
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

const ListCampaignMergeFieldsInputSchema = z.object({});

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
		// null removes the linked account.
		account: z.number().nullable().optional(),
		birth_date: z.string().optional(),
		'opt-out': z.boolean().optional(),
		'opt-out_date': z.string().optional(),
		'opt-out_campaign': z.string().optional(),
		bounced: z.boolean().optional(),
		bounced_date: z.string().optional(),
		// unknown: the provider leaves this field's shape undocumented; values pass through as-is
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
		// unknown: the provider leaves this field's shape undocumented; values pass through as-is
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

const ListEmailDataSourcesInputSchema = z.object({
	includeTeamDataSources: z.boolean().optional(),
});

const ListFilterFieldsInputSchema = z.object({
	entity: z.string().min(1),
	pipeline: z.number().optional(),
	includePipelineSpecificPredefinedFilterFields: z.boolean().optional(),
});

const RetrieveGroupInputSchema = z.object({
	id: z.string().min(1),
});

const ListMyContactsInputSchema = z.object({
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

const RetrieveMeetingInputSchema = z.object({
	meetingId: z.string().min(1),
});

// PUT /meetings/{id} and PUT /calls/{id} take one of two bodies (spec
// x-alternatives): a calendar-synced meeting, where only the notes can change
// ({ calendar_id, external_id, notes }), or a meeting logged in Salesflare or
// through the API ({ participants, ...details }). The live API rejects the
// calendar form for logged meetings, so both forms are accepted here and the
// refinement requires one of them.
const MeetingUpdateBodyFields = {
	meetingId: z.string().min(1),
	calendar_id: z.string().optional(),
	external_id: z.string().optional(),
	date: z.string().optional(),
	end_date: z.string().optional(),
	subject: z.string().max(200).optional(),
	description: z.string().optional(),
	minutes: z.string().optional(),
	notes: z.string().optional(),
	edited_by: z.number().optional(),
	type: z.enum(['meeting-live', 'meeting-phone']).optional(),
	phone_type: z.string().optional(),
	participants: z.array(z.number()).min(1).optional(),
};

const requireOneMeetingUpdateForm = (
	value: {
		calendar_id?: string;
		external_id?: string;
		notes?: string;
		participants?: number[];
	},
	ctx: z.RefinementCtx,
) => {
	const calendarForm =
		value.calendar_id !== undefined &&
		value.external_id !== undefined &&
		value.notes !== undefined;
	const loggedForm = value.participants !== undefined;
	if (!calendarForm && !loggedForm) {
		ctx.addIssue({
			code: 'custom',
			message:
				'Provide participants (meetings logged in Salesflare) or calendar_id, external_id and notes (calendar-synced meetings)',
		});
	}
};

const UpdateMeetingInputSchema = z
	.object({
		...MeetingUpdateBodyFields,
		type: MeetingUpdateBodyFields.type.describe(
			"Send 'meeting-live' when updating a logged live meeting; without it the API answers 422.",
		),
	})
	.passthrough()
	.superRefine(requireOneMeetingUpdateForm);

const DeleteMeetingInputSchema = z.object({
	meetingId: z.string().min(1),
});

const RetrieveOpportunityInputSchema = z.object({
	id: z.string().min(1),
});

const UpdateOpportunityInputSchema = z
	.object({
		id: z.string().min(1),
		owner: z.number().optional(),
		account: z.number().optional(),
		stage: z.number().optional(),
		lost_reason: z.number().optional(),
		// unknown: the provider leaves this field's shape undocumented; values pass through as-is
		files: z.array(z.record(z.string(), z.unknown())).optional(),
		lead_source: z.number().optional(),
		start_date: z.string().optional(),
		probability: z.number().optional(),
		assignee: z.number().optional(),
		creator: z.number().optional(),
		name: z.string().optional(),
		value: z.number().optional(),
		close_date: z.string().optional(),
		closed: z.boolean().optional(),
		done: z.boolean().optional(),
		tags: z.array(z.string()).optional(),
		recurring_price_per_unit: z.number().optional(),
		frequency: z.enum(['annually', 'weekly', 'monthly', 'daily']).optional(),
		units: z.number().optional(),
		contract_start_date: z.string().optional(),
		contract_end_date: z.string().optional(),
		main_contact: z.number().optional(),
		// unknown: the provider leaves this field's shape undocumented; values pass through as-is
		custom: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();

const DeleteOpportunityInputSchema = z.object({
	id: z.string().min(1),
});

const RetrieveAiSettingsInputSchema = z.object({});

const UpdateAiSettingsInputSchema = z
	.object({
		company: z
			.object({
				name: z.string().optional(),
				summary: z.string().optional(),
				generated: z.boolean().optional(),
			})
			.optional(),
		user: z
			.object({
				name: z.string().optional(),
				summary: z.string().optional(),
			})
			.optional(),
	})
	.passthrough();

const RetrieveStageInputSchema = z.object({
	stageId: z.string().min(1),
});

const RetrieveTagInputSchema = z.object({
	tagId: z.string().min(1),
});

const UpdateTagInputSchema = z
	.object({
		tagId: z.string().min(1),
		name: z.string(),
	})
	.passthrough();

const DeleteTagInputSchema = z.object({
	tagId: z.string().min(1),
});

const RetrieveUserInputSchema = z.object({
	id: z.string().min(1),
});

const RetrieveWorkflowInputSchema = z.object({
	id: z.string().min(1),
});

const UpdateWorkflowInputSchema = z
	.object({
		id: z.string().min(1),
		name: z.string(),
		filter: z
			.object({
				ids: z.array(z.number()).optional(),
			})
			.optional(),
		// unknown: the provider leaves this field's shape undocumented; values pass through as-is
		individual_record_filter: z
			.object({
				condition: z.enum(['AND', 'OR']),
				// unknown: the provider leaves rules's shape undocumented; values pass through as-is
				rules: z.array(z.record(z.string(), z.unknown())),
				order_by: z.string().optional(),
				not: z.boolean().optional(),
				valid: z.boolean().optional(),
				search: z.string().optional(),
			})
			.optional(),
		status: z.enum(['live', 'paused', 'scheduled', 'draft']).optional(),
		status_message: z.string().optional(),
		record_type: z.enum(['contact']).optional(),
		goal: z.enum(['opened', 'clicked', 'replied']).optional(),
		continuous: z.boolean().optional(),
		exit_after_days: z.number().optional(),
		schedule_date: z.string().optional(),
		schedule_time_start: z.string().optional(),
		schedule_time_end: z.string().optional(),
		schedule_days: z.array(z.number()).optional(),
		// unknown: the provider leaves this field's shape undocumented; values pass through as-is
		steps: z
			.array(
				z.object({
					id: z.number().optional(),
					name: z.string().optional(),
					order: z.number(),
					// unknown: the provider leaves filter's shape undocumented; values pass through as-is
					filter: z.record(z.string(), z.unknown()).optional(),
					trigger_step: z.number().optional(),
					trigger_step_index: z.number().optional(),
					trigger_after_days: z.number().optional(),
					trigger: z
						.enum([
							'sent',
							'opened',
							'clicked',
							'replied',
							'not_opened',
							'not_replied',
							'not_clicked',
						])
						.optional(),
					action_type: z.enum(['send_email']).optional(),
					// unknown: the provider leaves action_config's shape undocumented; values pass through as-is
					action_config: z.record(z.string(), z.unknown()).optional(),
					action_status: z.string().optional(),
					action_source: z.number().optional(),
					action_source_email: z.string().optional(),
					// unknown: the provider leaves analytics's shape undocumented; values pass through as-is
					analytics: z.record(z.string(), z.unknown()).optional(),
					// unknown: the provider leaves metrics_data's shape undocumented; values pass through as-is
					metrics_data: z.record(z.string(), z.unknown()).optional(),
				}),
			)
			.optional(),
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

const ListTagUsageInputSchema = z.object({
	tagId: z.string().min(1),
});

const ListCustomFieldOptionsInputSchema = z.object({
	itemClass: z.string().min(1),
	customFieldApiField: z.string().min(1),
	searchString: z.string().optional(),
});

const CreateCallInputSchema = z
	.object({
		date: z.string(),
		end_date: z.string().optional(),
		subject: z.string().optional(),
		description: z.string().optional(),
		minutes: z.string().optional(),
		notes: z.string().optional(),
		phone_type: z.string().optional(),
		phone_number_hash: z.string().optional(),
		participants: z.array(z.number()),
	})
	.passthrough();

const CreateMeetingInputSchema = z
	.object({
		date: z.string(),
		end_date: z.string().optional(),
		subject: z.string().optional(),
		description: z.string().optional(),
		minutes: z.string().optional(),
		notes: z.string().optional(),
		phone_type: z.string().optional(),
		phone_number_hash: z.string().optional(),
		participants: z.array(z.number()),
		type: z.enum(['meeting-live', 'meeting-phone']).optional(),
	})
	.passthrough();

const CreateMessageInputSchema = z
	.object({
		account: z.number(),
		body: z.string(),
		mentions: z.array(z.number()).optional(),
		date: z.string().optional(),
	})
	.passthrough();

const AddAccountUsersInputSchema = z
	.object({
		accountId: z.string().min(1),
		id: z.number().optional(),
		_dirty: z.boolean().optional(),
		_deleted: z.boolean().optional(),
	})
	.passthrough();

const UpdateAccountUsersInputSchema = z
	.object({
		accountId: z.string().min(1),
		id: z.number().optional(),
		_dirty: z.boolean().optional(),
		_deleted: z.boolean().optional(),
	})
	.passthrough();

const AddAccountContactsInputSchema = z
	.object({
		accountId: z.string().min(1),
		id: z.number().optional(),
		_dirty: z.boolean().optional(),
		_deleted: z.boolean().optional(),
	})
	.passthrough();

const UpdateAccountContactsInputSchema = z
	.object({
		accountId: z.string().min(1),
		id: z.number().optional(),
		_dirty: z.boolean().optional(),
		_deleted: z.boolean().optional(),
	})
	.passthrough();

const CreateMessageFeedbackInputSchema = z
	.object({
		messageId: z.string().min(1),
		feedback: z.string(),
	})
	.passthrough();

const UpdateCallInputSchema = z
	.object(MeetingUpdateBodyFields)
	.passthrough()
	.superRefine(requireOneMeetingUpdateForm);

const UpdateMessageInputSchema = z
	.object({
		messageId: z.string().min(1),
		account: z.number(),
		body: z.string(),
		mentions: z.array(z.number()).optional(),
		date: z.string().optional(),
	})
	.passthrough();

const DeleteMessageInputSchema = z.object({
	messageId: z.string().min(1),
});

const UpdateTaskInputSchema = z
	.object({
		id: z.string().min(1),
		account: z.number().optional(),
		description: z.string().optional(),
		reminder_date: z.string().optional(),
		assignees: z.array(z.number()).optional(),
		completed: z.boolean().optional(),
	})
	.passthrough();

const DeleteTaskInputSchema = z.object({
	id: z.string().min(1),
});

const UpdateEmailDataSourceInputSchema = z
	.object({
		id: z.string().min(1),
		email_signature: z.string().optional(),
		add_signature_to_campaign: z.boolean().optional(),
		add_signature_to_replies: z.boolean().optional(),
		max_emails_day: z.number().optional(),
		max_emails_hour: z.number().optional(),
	})
	.passthrough();

const UpdateWorkflowAudienceInputSchema = z
	.object({
		id: z.string().min(1),
		recordId: z.string().min(1),
		exited: z.boolean().optional(),
		met_goal: z.boolean().optional(),
	})
	.passthrough();

export const SalesflareEndpointInputSchemas = {
	listAccounts: ListAccountsInputSchema,
	createAccount: CreateAccountInputSchema,
	listContacts: ListContactsInputSchema,
	createContact: CreateContactInputSchema,
	listCurrencies: ListCurrenciesInputSchema,
	listGroups: ListGroupsInputSchema,
	retrieveCurrentUser: RetrieveCurrentUserInputSchema,
	listOpportunities: ListOpportunitiesInputSchema,
	createOpportunity: CreateOpportunityInputSchema,
	listPersons: ListPersonsInputSchema,
	listPipelines: ListPipelinesInputSchema,
	listStages: ListStagesInputSchema,
	listTags: ListTagsInputSchema,
	createTag: CreateTagInputSchema,
	listTasks: ListTasksInputSchema,
	createTask: CreateTaskInputSchema,
	listUsers: ListUsersInputSchema,
	listWorkflows: ListWorkflowsInputSchema,
	createWorkflow: CreateWorkflowInputSchema,
	retrieveAccount: RetrieveAccountInputSchema,
	updateAccount: UpdateAccountInputSchema,
	deleteAccount: DeleteAccountInputSchema,
	listCampaignMergeFields: ListCampaignMergeFieldsInputSchema,
	retrieveContact: RetrieveContactInputSchema,
	updateContact: UpdateContactInputSchema,
	deleteContact: DeleteContactInputSchema,
	listCustomFieldTypes: ListCustomFieldTypesInputSchema,
	listCustomFields: ListCustomFieldsInputSchema,
	createCustomFieldSub: CreateCustomFieldSubInputSchema,
	listEmailDataSources: ListEmailDataSourcesInputSchema,
	listFilterFields: ListFilterFieldsInputSchema,
	retrieveGroup: RetrieveGroupInputSchema,
	listMyContacts: ListMyContactsInputSchema,
	retrieveMeeting: RetrieveMeetingInputSchema,
	updateMeeting: UpdateMeetingInputSchema,
	deleteMeeting: DeleteMeetingInputSchema,
	retrieveOpportunity: RetrieveOpportunityInputSchema,
	updateOpportunity: UpdateOpportunityInputSchema,
	deleteOpportunity: DeleteOpportunityInputSchema,
	retrieveAiSettings: RetrieveAiSettingsInputSchema,
	updateAiSettings: UpdateAiSettingsInputSchema,
	retrieveStage: RetrieveStageInputSchema,
	retrieveTag: RetrieveTagInputSchema,
	updateTag: UpdateTagInputSchema,
	deleteTag: DeleteTagInputSchema,
	retrieveUser: RetrieveUserInputSchema,
	retrieveWorkflow: RetrieveWorkflowInputSchema,
	updateWorkflow: UpdateWorkflowInputSchema,
	listAccountMessages: ListAccountMessagesInputSchema,
	listAccountFeed: ListAccountFeedInputSchema,
	retrieveCustomField: RetrieveCustomFieldInputSchema,
	updateCustomField: UpdateCustomFieldInputSchema,
	deleteCustomField: DeleteCustomFieldInputSchema,
	listTagUsage: ListTagUsageInputSchema,
	listCustomFieldOptions: ListCustomFieldOptionsInputSchema,
	createCall: CreateCallInputSchema,
	createMeeting: CreateMeetingInputSchema,
	createMessage: CreateMessageInputSchema,
	addAccountUsers: AddAccountUsersInputSchema,
	updateAccountUsers: UpdateAccountUsersInputSchema,
	addAccountContacts: AddAccountContactsInputSchema,
	updateAccountContacts: UpdateAccountContactsInputSchema,
	createMessageFeedback: CreateMessageFeedbackInputSchema,
	updateCall: UpdateCallInputSchema,
	updateMessage: UpdateMessageInputSchema,
	deleteMessage: DeleteMessageInputSchema,
	updateTask: UpdateTaskInputSchema,
	deleteTask: DeleteTaskInputSchema,
	updateEmailDataSource: UpdateEmailDataSourceInputSchema,
	updateWorkflowAudience: UpdateWorkflowAudienceInputSchema,
} as const;

export const SalesflareEndpointOutputSchemas = {
	listAccounts: SalesflareListOutputSchema,
	createAccount: SalesflareResourceOutputSchema,
	listContacts: SalesflareListOutputSchema,
	createContact: SalesflareBatchWriteOutputSchema,
	listCurrencies: SalesflareListOutputSchema,
	listGroups: SalesflareListOutputSchema,
	retrieveCurrentUser: SalesflareResourceOutputSchema,
	listOpportunities: SalesflareListOutputSchema,
	createOpportunity: SalesflareResourceOutputSchema,
	listPersons: SalesflareListOutputSchema,
	listPipelines: SalesflareListOutputSchema,
	listStages: SalesflareListOutputSchema,
	listTags: SalesflareListOutputSchema,
	createTag: SalesflareResourceOutputSchema,
	listTasks: SalesflareListOutputSchema,
	createTask: SalesflareResourceOutputSchema,
	listUsers: SalesflareListOutputSchema,
	listWorkflows: SalesflareListOutputSchema,
	createWorkflow: SalesflareResourceOutputSchema,
	retrieveAccount: SalesflareResourceOutputSchema,
	updateAccount: SalesflareResourceOutputSchema,
	deleteAccount: SalesflareEmptyOutputSchema,
	listCampaignMergeFields: SalesflareListOutputSchema,
	retrieveContact: SalesflareResourceOutputSchema,
	updateContact: SalesflareResourceOutputSchema,
	deleteContact: SalesflareEmptyOutputSchema,
	listCustomFieldTypes: SalesflareListOutputSchema,
	listCustomFields: SalesflareListOutputSchema,
	createCustomFieldSub: SalesflareResourceOutputSchema,
	listEmailDataSources: SalesflareListOutputSchema,
	listFilterFields: SalesflareListOutputSchema,
	retrieveGroup: SalesflareResourceOutputSchema,
	listMyContacts: SalesflareListOutputSchema,
	retrieveMeeting: SalesflareResourceOutputSchema,
	updateMeeting: SalesflareResourceOutputSchema,
	deleteMeeting: SalesflareEmptyOutputSchema,
	retrieveOpportunity: SalesflareResourceOutputSchema,
	updateOpportunity: SalesflareResourceOutputSchema,
	deleteOpportunity: SalesflareEmptyOutputSchema,
	retrieveAiSettings: SalesflareResourceOutputSchema,
	updateAiSettings: SalesflareResourceOutputSchema,
	retrieveStage: SalesflareResourceOutputSchema,
	retrieveTag: SalesflareResourceOutputSchema,
	updateTag: SalesflareResourceOutputSchema,
	deleteTag: SalesflareEmptyOutputSchema,
	retrieveUser: SalesflareResourceOutputSchema,
	retrieveWorkflow: SalesflareResourceOutputSchema,
	updateWorkflow: SalesflareResourceOutputSchema,
	listAccountMessages: SalesflareListOutputSchema,
	listAccountFeed: SalesflareListOutputSchema,
	retrieveCustomField: SalesflareResourceOutputSchema,
	// Live: PUT /customfields/{itemClass}/{id} answers with the bare id (a number).
	updateCustomField: z.union([SalesflareRecordSchema, z.number()]),
	deleteCustomField: SalesflareEmptyOutputSchema,
	// Live: { workflows, savedFilters, reports }, one object, not a list.
	listTagUsage: SalesflareResourceOutputSchema,
	listCustomFieldOptions: SalesflareListOutputSchema,
	createCall: SalesflareBatchWriteOutputSchema,
	createMeeting: SalesflareBatchWriteOutputSchema,
	createMessage: SalesflareResourceOutputSchema,
	addAccountUsers: SalesflareBatchWriteOutputSchema,
	updateAccountUsers: SalesflareBatchWriteOutputSchema,
	addAccountContacts: SalesflareBatchWriteOutputSchema,
	updateAccountContacts: SalesflareBatchWriteOutputSchema,
	createMessageFeedback: SalesflareResourceOutputSchema,
	updateCall: SalesflareResourceOutputSchema,
	updateMessage: SalesflareResourceOutputSchema,
	deleteMessage: SalesflareEmptyOutputSchema,
	updateTask: SalesflareResourceOutputSchema,
	deleteTask: SalesflareEmptyOutputSchema,
	updateEmailDataSource: SalesflareResourceOutputSchema,
	updateWorkflowAudience: SalesflareResourceOutputSchema,
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
