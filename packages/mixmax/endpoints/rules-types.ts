import { z } from 'zod';
import { mixmaxBooleanFlag } from './flags';

// Rules and rule actions (developer.mixmax.com/reference, Rules and webhooks
// section). Field names, types, and limits mirror the official Rule /
// RuleTrigger / RuleAction / RuleEvent schemas for /v1/rules, /v1/rules/{id}
// and /v1/rules/events.

// One `event` trigger: runs the rule each time `eventName` happens for the
// caller. `objectType` and `relationshipField` only apply to
// `salesforce:customobject` events.
export const RuleTriggerEventSchema = z
	.object({
		type: z.literal('event'),
		eventName: z.string(),
		objectType: z.string().optional(),
		relationshipField: z.string().optional(),
	})
	.passthrough();

export type RuleTriggerEvent = z.infer<typeof RuleTriggerEventSchema>;

// One `recurring` trigger: runs the rule on an RFC 5545 schedule. `interval`
// is only used with subtype `interval`, and the provider declares it without
// fixed properties.
export const RuleTriggerRecurringSchema = z
	.object({
		type: z.literal('recurring'),
		rrule: z.string(),
		// `interval` for rules the app builds to run around a calendar event;
		// absent or `null` otherwise.
		subtype: z.string().nullable().optional(),
		entity: z.string().optional(),
		interval: z.object({}).passthrough().optional(),
	})
	.passthrough();

export type RuleTriggerRecurring = z.infer<typeof RuleTriggerRecurringSchema>;

// One `webhook` trigger: runs the rule each time something posts JSON to the
// rule's incoming webhook URL. `transforms` maps the posted body into the
// event the rule sees, as [key, path] pairs.
export const RuleTriggerWebhookSchema = z
	.object({
		type: z.literal('webhook'),
		webhookId: z.string(),
		transforms: z.array(z.tuple([z.string(), z.string()])).optional(),
		options: z
			.object({
				preserveDots: z.boolean().optional(),
			})
			.optional(),
		transformConfig: z.string().optional(),
		webhookSecret: z.string().optional(),
	})
	.passthrough();

export type RuleTriggerWebhook = z.infer<typeof RuleTriggerWebhookSchema>;

// One `salesforceDateInterval` trigger: runs the rule some days before or
// after a date field on Salesforce records.
export const RuleTriggerSalesforceDateIntervalSchema = z
	.object({
		type: z.literal('salesforceDateInterval'),
		// The Salesforce object, such as `Lead`.
		objectType: z.string(),
		relationshipField: z.string().optional(),
		interval: z.object({
			// How many days.
			value: z.number(),
			// `true` for before the date, `false` for after.
			before: z.boolean(),
			// The date field, such as `CloseDate`.
			field: z.string(),
		}),
	})
	.passthrough();

export type RuleTriggerSalesforceDateInterval = z.infer<
	typeof RuleTriggerSalesforceDateIntervalSchema
>;

// What runs a rule. The official schema is a oneOf over the four trigger
// kinds above, each keyed by its `type` discriminator.
export const RuleTriggerSchema = z.union([
	RuleTriggerEventSchema,
	RuleTriggerRecurringSchema,
	RuleTriggerWebhookSchema,
	RuleTriggerSalesforceDateIntervalSchema,
]);

export type RuleTrigger = z.infer<typeof RuleTriggerSchema>;

// An action of a rule. Fields beyond those listed depend on `type`, and the
// provider declares the object additionalProperties: true, so the shape stays
// extensible.
export const RuleActionSchema = z
	.object({
		_id: z.string().optional(),
		ruleId: z.string().optional(),
		// For example `postToWebhook`.
		type: z.string().optional(),
		// `true` when the action does not run.
		isPaused: z.boolean().optional(),
		// For `postToWebhook`, where Mixmax sends the event.
		webhookUrl: z.string().optional(),
		// For `postToWebhook`, extra headers as [name, value] pairs.
		httpHeaders: z.array(z.tuple([z.string(), z.string()])).optional(),
		// Only in the create and rotate responses; listings carry
		// `signingSecretLastFour` instead.
		signingSecret: z.string().optional(),
		signingSecretLastFour: z.string().optional(),
		// ISO 8601 date-time string.
		signingSecretCreatedAt: z.string().optional(),
		// ISO 8601 date-time strings.
		createdAt: z.string().optional(),
		modifiedAt: z.string().optional(),
	})
	.passthrough();

export type RuleAction = z.infer<typeof RuleActionSchema>;

export const RuleActionPageSchema = z.object({
	results: z.array(RuleActionSchema),
	next: z.string().optional(),
	hasNext: z.boolean().optional(),
	previous: z.string().optional(),
	hasPrevious: z.boolean().optional(),
});

export type RuleActionPage = z.infer<typeof RuleActionPageSchema>;

// A rule as returned by the rules endpoints. `filter` is a JSON-encoded
// string, not an object, and `actions` only appears with `expand=actions`.
// Documented fields stay optional and the object stays passthrough: the
// provider may omit fields and add detail it does not pin down.
export const RuleSchema = z
	.object({
		_id: z.string().optional(),
		// The rule's owner.
		userId: z.string().optional(),
		// Set on rules that belong to a workspace rather than a person.
		orgId: z.string().optional(),
		name: z.string().optional(),
		// What runs the rule; `null` on rules saved in the app before a
		// trigger was picked.
		trigger: z.union([RuleTriggerSchema, z.null()]).optional(),
		// A JSON-encoded condition, in MongoDB query syntax, that events must
		// match. Absent means every event.
		filter: z.string().optional(),
		// `true` when the rule does not run.
		isPaused: z.boolean().optional(),
		// ISO 8601 date-time strings.
		createdAt: z.string().optional(),
		modifiedAt: z.string().optional(),
		// Only with `expand=actions`.
		actions: z.array(RuleActionSchema).optional(),
	})
	.passthrough();

export type Rule = z.infer<typeof RuleSchema>;

export const RulePageSchema = z.object({
	results: z.array(RuleSchema),
	next: z.string().optional(),
	hasNext: z.boolean().optional(),
	previous: z.string().optional(),
	hasPrevious: z.boolean().optional(),
});

export type RulePage = z.infer<typeof RulePageSchema>;

// One run of a rule, as recorded in the 15-day history. `payload` depends on
// the rule's trigger (for a message event it is the message, for example) and
// fields beyond those listed can appear, so the object stays passthrough.
export const RuleEventSchema = z
	.object({
		_id: z.string().optional(),
		// When the rule ran; pass it as `date` to GET /v1/rules/events/{id}.
		date: z.string().optional(),
		type: z.enum(['rules']).optional(),
		// The `_id` of the rule's owner.
		userId: z.string().optional(),
		// Only in GET /v1/rules/events responses.
		email: z.string().optional(),
		status: z.enum(['success', 'filtered', 'pending', 'error']).optional(),
		// What happened, for example why the event did not match the filter.
		message: z.string().optional(),
		// The event the rule ran on; its shape depends on the trigger.
		payload: z.object({}).passthrough().optional(),
		metadata: z
			.object({
				// Left out when the rule has since been deleted.
				ruleId: z.string().optional(),
				// Left out when the rule has since been deleted.
				ruleName: z.string().optional(),
				// `true` when the rule is hidden in the Mixmax app.
				hidden: z.boolean().optional(),
				// The type of the action that ran, such as `postToWebhook`.
				actionType: z.string().optional(),
				recipientEmail: z.string().optional(),
				recipientName: z.string().optional(),
				// Set on events of rules that belong to a workspace.
				orgId: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

export type RuleEvent = z.infer<typeof RuleEventSchema>;

// GET /v1/rules/events answers a page keyed by `records` and paged with
// numeric offsets, not cursors: `next` is the offset of the next page, or
// `null` when `hasNext` is `false`. `statuses` only appears with
// `aggregate=true`.
export const RuleEventPageSchema = z.object({
	records: z.array(RuleEventSchema),
	// `true` whenever the page is full, so the next page can still be empty.
	hasNext: z.boolean().optional(),
	next: z.number().nullable().optional(),
	// The oldest date the history covers, 15 days ago.
	since: z.string().optional(),
	// Counts of the matching events by status, plus `total`.
	statuses: z.record(z.string(), z.number()).optional(),
});

export type RuleEventPage = z.infer<typeof RuleEventPageSchema>;

// The writable fields of a rule, shared by create and update. `filter` must
// be a JSON-encoded string — the provider fails with `400` when an object is
// sent — and `trigger` is required on create: the official RuleCreate is
// RuleWrite with `trigger` added to `required`.
export const RuleWriteSchema = z.object({
	name: z.string().optional(),
	trigger: RuleTriggerSchema.optional(),
	filter: z.string().optional(),
	isPaused: z.boolean().optional(),
});

export type RuleWrite = z.infer<typeof RuleWriteSchema>;

export const RulesListInputSchema = z.object({
	// Pass `actions` to include each rule's actions in an `actions` array.
	expand: z.enum(['actions']).optional(),
	// The `_id` of a teammate whose rules to list; only workspace admins can
	// pass another user's id. Defaults to the caller.
	owner: z.string().optional(),
	// Pass `false` to leave out rules hidden in the Mixmax app. They are
	// included by default.
	hidden: mixmaxBooleanFlag.optional(),
	// The maximum, and the default, is 50.
	limit: z.coerce.number().int().max(50).optional(),
	// The `next` cursor from the previous page.
	next: z.string().optional(),
	// The `previous` cursor from the next page.
	previous: z.string().optional(),
});

export type RulesListInput = z.infer<typeof RulesListInputSchema>;

export const RulesListOutputSchema = RulePageSchema;

export type RulesListOutput = z.infer<typeof RulesListOutputSchema>;

export const RulesCreateInputSchema = RuleWriteSchema.extend({
	trigger: RuleTriggerSchema,
});

export type RulesCreateInput = z.infer<typeof RulesCreateInputSchema>;

// POST /v1/rules answers 200 with the new rule; a new rule has no actions.
export const RulesCreateOutputSchema = RuleSchema;

export type RulesCreateOutput = z.infer<typeof RulesCreateOutputSchema>;

export const RulesGetInputSchema = z.object({
	id: z.string().min(1),
	// Pass `actions` to include the rule's actions in an `actions` array.
	expand: z.enum(['actions']).optional(),
});

export type RulesGetInput = z.infer<typeof RulesGetInputSchema>;

export const RulesGetOutputSchema = RuleSchema;

export type RulesGetOutput = z.infer<typeof RulesGetOutputSchema>;

export const RulesUpdateInputSchema = RuleWriteSchema.extend({
	id: z.string().min(1),
});

export type RulesUpdateInput = z.infer<typeof RulesUpdateInputSchema>;

// PATCH /v1/rules/{id} answers 200 with `{_id, modifiedAt}` plus additional
// properties, not the full updated rule.
export const RulesUpdateOutputSchema = z
	.object({
		_id: z.string().optional(),
		modifiedAt: z.string().optional(),
	})
	.passthrough();

export type RulesUpdateOutput = z.infer<typeof RulesUpdateOutputSchema>;

export const RulesDeleteInputSchema = z.object({
	id: z.string().min(1),
});

export type RulesDeleteInput = z.infer<typeof RulesDeleteInputSchema>;

// DELETE /v1/rules/{id} answers 204 with no body.
export const RulesDeleteOutputSchema = z.undefined();

export type RulesDeleteOutput = z.infer<typeof RulesDeleteOutputSchema>;

// DELETE /v1/rules takes the rule ids in a JSON body; `ids` in the query
// string is ignored and fails with `400`. Ids the caller cannot access are
// skipped without an error, so the answer is 204 even when nothing was
// deleted.
export const RulesDeleteBulkInputSchema = z.object({
	// The `_id`s of the rules to delete. Must be an array, even for one rule.
	ids: z.array(z.string()),
});

export type RulesDeleteBulkInput = z.infer<typeof RulesDeleteBulkInputSchema>;

// DELETE /v1/rules answers 204 with no body.
export const RulesDeleteBulkOutputSchema = z.undefined();

export type RulesDeleteBulkOutput = z.infer<typeof RulesDeleteBulkOutputSchema>;

export const RulesListActionsInputSchema = z.object({
	id: z.string().min(1),
	// How many actions to return per page; the provider defaults it to 50,
	// at most 300.
	limit: z.coerce.number().int().max(300).optional(),
	// The `next` cursor from the previous page.
	next: z.string().optional(),
	// The `previous` cursor from the next page.
	previous: z.string().optional(),
});

export type RulesListActionsInput = z.infer<typeof RulesListActionsInputSchema>;

export const RulesListActionsOutputSchema = RuleActionPageSchema;

export type RulesListActionsOutput = z.infer<
	typeof RulesListActionsOutputSchema
>;

// POST /v1/rules/{id}/actions body. `type` is required; the other fields
// configure the action and depend on it, and the provider declares the body
// additionalProperties: true, so it stays extensible.
export const RulesCreateActionInputSchema = z
	.object({
		id: z.string().min(1),
		// For example `postToWebhook`.
		type: z.string().min(1),
		isPaused: z.boolean().optional(),
		// For `postToWebhook`, the HTTPS endpoint that receives the events.
		webhookUrl: z.string().optional(),
		// For `postToWebhook`, extra headers as [name, value] pairs.
		httpHeaders: z.array(z.tuple([z.string(), z.string()])).optional(),
		// Optional, on create only: `whsec_` followed by 32 random bytes in
		// base64; anything else is silently replaced with a generated secret.
		signingSecret: z.string().optional(),
	})
	.passthrough();

export type RulesCreateActionInput = z.infer<
	typeof RulesCreateActionInputSchema
>;

// POST /v1/rules/{id}/actions answers 200 with the new action; this response
// is the only time a generated `signingSecret` is visible.
export const RulesCreateActionOutputSchema = RuleActionSchema;

export type RulesCreateActionOutput = z.infer<
	typeof RulesCreateActionOutputSchema
>;

// PATCH /v1/rules/{id}/actions/{actionId} body. Only the fields sent change,
// and the provider declares the body additionalProperties: true, so it stays
// extensible.
export const RulesUpdateActionInputSchema = z
	.object({
		id: z.string().min(1),
		actionId: z.string().min(1),
		type: z.string().optional(),
		isPaused: z.boolean().optional(),
		webhookUrl: z.string().optional(),
		httpHeaders: z.array(z.tuple([z.string(), z.string()])).optional(),
		// `true` to replace a webhook action's signing secret; the response is
		// the only time the new secret is visible.
		rotateSigningSecret: z.boolean().optional(),
	})
	.passthrough();

export type RulesUpdateActionInput = z.infer<
	typeof RulesUpdateActionInputSchema
>;

// PATCH /v1/rules/{id}/actions/{actionId} answers 200 with the updated
// action.
export const RulesUpdateActionOutputSchema = RuleActionSchema;

export type RulesUpdateActionOutput = z.infer<
	typeof RulesUpdateActionOutputSchema
>;

export const RulesDeleteActionInputSchema = z.object({
	id: z.string().min(1),
	actionId: z.string().min(1),
});

export type RulesDeleteActionInput = z.infer<
	typeof RulesDeleteActionInputSchema
>;

// DELETE /v1/rules/{id}/actions/{actionId} answers 204 with no body;
// deleting an action that was already deleted answers 204 again.
export const RulesDeleteActionOutputSchema = z.undefined();

export type RulesDeleteActionOutput = z.infer<
	typeof RulesDeleteActionOutputSchema
>;

export const RulesListEventsInputSchema = z.object({
	// The `_id` of a teammate whose history to list; only an admin of that
	// user's workspace can pass another user's id. Defaults to the caller.
	userId: z.string().optional(),
	// Pass `true` to list the history of the workspace's shared rules instead
	// of the caller's own; only workspace admins can use it.
	getWorkspaceEvents: mixmaxBooleanFlag.optional(),
	// Only events of this rule.
	ruleId: z.string().optional(),
	// Only events with this status.
	status: z.enum(['success', 'filtered', 'pending', 'error']).optional(),
	// Only events whose recipient email or name starts with this text.
	text: z.string().optional(),
	// Pass `true` to add `statuses`, a count of the matching events by
	// status, across all pages.
	aggregate: mixmaxBooleanFlag.optional(),
	// A comma-separated list of the fields to return on each event, such as
	// `status,date,metadata.ruleId`. `_id` is always returned.
	fields: z.string().optional(),
	// How many events to skip; the provider defaults it to 0. Pages use this
	// offset, not cursors.
	offset: z.coerce.number().int().optional(),
	// How many events to return per page; the provider defaults it to 50.
	limit: z.coerce.number().int().optional(),
});

export type RulesListEventsInput = z.infer<typeof RulesListEventsInputSchema>;

export const RulesListEventsOutputSchema = RuleEventPageSchema;

export type RulesListEventsOutput = z.infer<typeof RulesListEventsOutputSchema>;

export const RulesGetEventInputSchema = z.object({
	id: z.string().min(1),
	// The event's `date`, as GET /v1/rules/events returned it. Events are
	// stored in blocks of three days and found by the block their `date`
	// falls in; without it only events from the current block are found.
	date: z.string().optional(),
});

export type RulesGetEventInput = z.infer<typeof RulesGetEventInputSchema>;

// GET /v1/rules/events/{id} answers 200 with one rule event; an event that
// cannot be found answers 404 with `{error}` and surfaces as a transport
// error.
export const RulesGetEventOutputSchema = RuleEventSchema;

export type RulesGetEventOutput = z.infer<typeof RulesGetEventOutputSchema>;
