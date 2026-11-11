import type { UnisenderEndpoints } from '..';
import { bracketForm, call, csv } from './call';
import {
	UnisenderEndpointInputSchemas as Inputs,
	UnisenderEndpointOutputSchemas as Outputs,
} from './types';

// ── lists ─────────────────────────────────────────────────────────────────

export const list: UnisenderEndpoints['listsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'lists.list',
			apiMethod: 'getLists',
			input: Inputs.listsList,
			output: Outputs.listsList,
			replayable: true,
		},
		input,
		() => ({}),
		{
			log: (_, result) => ({ lists: result.result.length }),
		},
	);

/**
 * Creates a list.
 *
 * A list is a topic, not a campaign: the docs warn against making one per send.
 * The title must be unique in the account, and a duplicate is an error rather than
 * a second list.
 */
export const create: UnisenderEndpoints['listsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'lists.create',
			apiMethod: 'createList',
			input: Inputs.listsCreate,
			output: Outputs.listsCreate,
			// Creating the same title twice fails, so a replay cannot make a second
			// list; it is safe to retry.
			replayable: true,
		},
		input,
		({ title, before_subscribe_url, after_subscribe_url }) => ({
			title,
			before_subscribe_url,
			after_subscribe_url,
		}),
		{
			log: (parsed, result) => ({
				title: parsed.title,
				listId: result.result.id ?? undefined,
			}),
		},
	);

export const remove: UnisenderEndpoints['listsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'lists.delete',
			apiMethod: 'deleteList',
			input: Inputs.listsDelete,
			output: Outputs.listsDelete,
			// A second delete finds nothing; the list is already gone.
			replayable: false,
		},
		input,
		({ list_id }) => ({ list_id }),
		{
			log: (parsed) => ({ listId: parsed.list_id }),
		},
	);

// ── contacts ──────────────────────────────────────────────────────────────

export const get: UnisenderEndpoints['contactsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.get',
			apiMethod: 'getContact',
			input: Inputs.contactsGet,
			output: Outputs.contactsGet,
			replayable: true,
		},
		input,
		({ email, list_id, include_lists, include_fields, include_details }) => ({
			email,
			list_id,
			include_lists:
				include_lists === undefined ? undefined : include_lists ? 1 : 0,
			include_fields:
				include_fields === undefined ? undefined : include_fields ? 1 : 0,
			include_details:
				include_details === undefined ? undefined : include_details ? 1 : 0,
		}),
		{
			log: (_, result) => ({
				status: result.result.email?.status ?? undefined,
				lists: result.result.lists?.length ?? 0,
			}),
		},
	);

/**
 * Adds or updates a contact in one or more lists.
 *
 * `double_optin` decides what happens: 0 adds without a confirmation email, 1 sends
 * one, and 3 adds without any email at all. The contact's resulting `status` says
 * which happened — `active` means it can be mailed, `invited` means it cannot yet.
 */
export const subscribe: UnisenderEndpoints['contactsSubscribe'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contacts.subscribe',
			apiMethod: 'subscribe',
			input: Inputs.contactsSubscribe,
			output: Outputs.contactsSubscribe,
			// Subscribing the same address with the same fields leaves the same contact,
			// so a retry cannot duplicate it.
			replayable: true,
		},
		input,
		({ list_ids, email, fields, double_optin, overwrite, tags }) => ({
			list_ids: csv(list_ids),
			...bracketForm('fields', { ...fields, email }),
			double_optin,
			overwrite,
			tags: tags && tags.length > 0 ? csv(tags) : undefined,
		}),
		{
			// The response carries only person_id; the contact's confirmation status is
			// not in it, so it is not logged as though it were.
			log: (parsed, result) => ({
				lists: parsed.list_ids.length,
				personId:
					result.result.person_id === null ||
					result.result.person_id === undefined
						? undefined
						: String(result.result.person_id),
			}),
		},
	);

/**
 * Unsubscribes a contact from lists, marking them unsubscribed.
 *
 * This is the contact's own choice and only they can reverse it, through the
 * activation link in a confirmation email; `contacts.exclude` is the sender's
 * alternative and does not mark the contact unsubscribed.
 */
export const unsubscribe: UnisenderEndpoints['contactsUnsubscribe'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contacts.unsubscribe',
			apiMethod: 'unsubscribe',
			input: Inputs.contactsUnsubscribe,
			output: Outputs.contactsUnsubscribe,
			// Unsubscribing twice leaves the contact unsubscribed.
			replayable: true,
		},
		input,
		({ email, contact_type, list_ids }) => ({
			contact: email,
			contact_type: contact_type ?? 'email',
			list_ids: list_ids ? csv(list_ids) : undefined,
		}),
		{
			log: (parsed) => ({
				lists: parsed.list_ids?.length ?? 'all',
			}),
		},
	);

/** Removes a contact from lists without marking them unsubscribed, so they can be re-added. */
export const exclude: UnisenderEndpoints['contactsExclude'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.exclude',
			apiMethod: 'exclude',
			input: Inputs.contactsExclude,
			output: Outputs.contactsExclude,
			// Excluding a contact who is already out of the lists leaves the same state.
			replayable: true,
		},
		input,
		({ email, contact_type, list_ids }) => ({
			contact: email,
			contact_type: contact_type ?? 'email',
			list_ids: list_ids ? csv(list_ids) : undefined,
		}),
		{
			log: (parsed) => ({ lists: parsed.list_ids?.length ?? 'all' }),
		},
	);

/**
 * Imports up to 500 contacts in one call.
 *
 * `field_names` is the column order and `data` must match it row by row. Unisender
 * deliberately skips role addresses such as `sales@` and `no-reply@`, so a skipped
 * count is normal rather than a fault.
 */
export const importContacts: UnisenderEndpoints['contactsImport'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contacts.import',
			apiMethod: 'importContacts',
			input: Inputs.contactsImport,
			output: Outputs.contactsImport,
			// An import creates contacts, so a replay would re-run the whole batch.
			replayable: false,
		},
		input,
		({ field_names, data, overwrite_tags, overwrite_lists }) => ({
			...bracketForm('field_names', field_names),
			...bracketForm('data', data),
			overwrite_tags,
			overwrite_lists,
		}),
		{
			log: (parsed, result) => ({
				rows: parsed.data.length,
				inserted: result.result.inserted ?? 0,
				invalid: result.result.invalid ?? 0,
			}),
		},
	);

/** How many contacts a list holds, optionally narrowed by tag, kind or a substring. */
export const count: UnisenderEndpoints['contactsCount'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.count',
			apiMethod: 'getContactCount',
			input: Inputs.contactsCount,
			output: Outputs.contactsCount,
			replayable: true,
		},
		input,
		({ list_id, tag_id, type, search }) => ({
			list_id,
			...bracketForm('params', {
				tagId: tag_id,
				type,
				search,
			}),
		}),
		{
			log: (_, result) => ({ count: result.result.count ?? 0 }),
		},
	);

/**
 * Requests an export of the contact data.
 *
 * The method is asynchronous: it acknowledges the request, and the file is posted to
 * `notify_url` when it is ready.
 */
export const exportContacts: UnisenderEndpoints['contactsExport'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contacts.export',
			apiMethod: 'async/exportContacts',
			input: Inputs.contactsExport,
			output: Outputs.contactsExport,
			// Each call queues another export, so it is not resent.
			replayable: false,
		},
		input,
		({ list_id, notify_url, field_names }) => ({
			list_id,
			notify_url,
			...bracketForm('field_names', field_names ?? []),
		}),
		{
			log: (parsed) => ({ listId: parsed.list_id ?? 'all' }),
		},
	);

// ── fields and tags ───────────────────────────────────────────────────────

export const fields: UnisenderEndpoints['fieldsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'fields.list',
			apiMethod: 'getFields',
			input: Inputs.fieldsList,
			output: Outputs.fieldsList,
			replayable: true,
		},
		input,
		() => ({}),
		{
			log: (_, result) => ({ fields: result.result.length }),
		},
	);

export const createField: UnisenderEndpoints['fieldsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'fields.create',
			apiMethod: 'createField',
			input: Inputs.fieldsCreate,
			output: Outputs.fieldsCreate,
			// A duplicate name is refused, so a replay cannot create a second field.
			replayable: true,
		},
		input,
		({ name, type, is_visible, view_pos }) => ({
			name,
			type,
			is_visible,
			view_pos,
		}),
		{
			log: (parsed, result) => ({
				name: parsed.name,
				fieldId: result.result.id ?? undefined,
			}),
		},
	);

export const deleteField: UnisenderEndpoints['fieldsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'fields.delete',
			apiMethod: 'deleteField',
			input: Inputs.fieldsDelete,
			output: Outputs.fieldsDelete,
			// A second delete finds nothing; the field is already gone.
			replayable: false,
		},
		input,
		({ id }) => ({ id }),
		{
			log: (parsed) => ({ fieldId: parsed.id }),
		},
	);

export const tags: UnisenderEndpoints['tagsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.list',
			apiMethod: 'getTags',
			input: Inputs.tagsList,
			output: Outputs.tagsList,
			replayable: true,
		},
		input,
		() => ({}),
		{
			log: (_, result) => ({ tags: result.result.length }),
		},
	);

// ── messages ──────────────────────────────────────────────────────────────

/**
 * Sends one transactional email.
 *
 * This is for individual notifications, not campaigns: there is no field
 * substitution beyond `{{UnsubscribeUrl}}`, and it is capped at 1,000 a day and 60
 * calls a minute for a new account. The `email_id` it returns is what
 * `messages.status` takes.
 */
export const sendEmail: UnisenderEndpoints['messagesSendEmail'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'messages.sendEmail',
			apiMethod: 'sendEmail',
			input: Inputs.messagesSendEmail,
			output: Outputs.messagesSendEmail,
			// Sending again delivers a second email; there is no idempotency key.
			replayable: false,
		},
		input,
		({
			email,
			sender_name,
			sender_email,
			subject,
			body,
			list_id,
			track_read,
			track_links,
			cc,
			metadata,
		}) => ({
			email,
			sender_name,
			sender_email,
			subject,
			body,
			list_id,
			track_read,
			track_links,
			cc,
			...bracketForm('metadata', metadata ?? {}),
		}),
		{
			// The answer is an object for the default call and an array when
			// `error_checking` is set, so both are read.
			log: (_, result) => {
				const answer = result.result;
				const rows = Array.isArray(answer) ? answer : [answer];
				const first = rows[0]?.email_id;
				return {
					sent: rows.length,
					emailId:
						first === null || first === undefined ? undefined : String(first),
				};
			},
		},
	);

/**
 * Delivery status for up to 500 `email_id` values.
 *
 * A status beginning `err_` is a failure, `ok_` a success or still in progress, and
 * `not_sent` is the documented exception. Unisender keeps these for one month only.
 */
export const status: UnisenderEndpoints['messagesStatus'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'messages.status',
			apiMethod: 'checkEmail',
			input: Inputs.messagesStatus,
			output: Outputs.messagesStatus,
			replayable: true,
		},
		input,
		({ email_id }) => ({ email_id: csv(email_id) }),
		{
			log: (_, result) => ({
				checked: result.result.statuses?.length ?? 0,
				failed:
					result.result.statuses?.filter((row) =>
						row.status?.startsWith('err_'),
					).length ?? 0,
			}),
		},
	);

/** Creates a campaign message without sending it; `campaigns.create` sends it. */
export const createEmail: UnisenderEndpoints['messagesCreateEmail'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'messages.createEmail',
			apiMethod: 'createEmailMessage',
			input: Inputs.messagesCreateEmail,
			output: Outputs.messagesCreateEmail,
			// Two creates make two messages.
			replayable: false,
		},
		input,
		({ sender_name, sender_email, subject, body, list_id, tag, lang }) => ({
			sender_name,
			sender_email,
			subject,
			body,
			list_id,
			tag,
			lang,
		}),
		{
			log: (_, result) => ({
				messageId: result.result.message_id ?? undefined,
			}),
		},
	);

/**
 * Starts or schedules a campaign from an existing message.
 *
 * Omitting `start_time` starts it immediately, which is what makes this a send
 * rather than a draft.
 */
export const campaign: UnisenderEndpoints['campaignsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.create',
			apiMethod: 'createCampaign',
			input: Inputs.campaignsCreate,
			output: Outputs.campaignsCreate,
			// A replay sends the campaign to everyone again.
			replayable: false,
		},
		input,
		({
			message_id,
			start_time,
			timezone,
			track_read,
			track_links,
			contacts,
			track_ga,
		}) => ({
			message_id,
			start_time,
			timezone,
			track_read,
			track_links,
			contacts,
			track_ga,
		}),
		{
			log: (parsed, result) => ({
				messageId: parsed.message_id,
				campaignId: result.result.campaign_id ?? undefined,
				status: result.result.status ?? undefined,
			}),
		},
	);

/** Campaigns whose start time falls in a window, at most 10,000 a page. */
export const campaigns: UnisenderEndpoints['campaignsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.list',
			apiMethod: 'getCampaigns',
			input: Inputs.campaignsList,
			output: Outputs.campaignsList,
			replayable: true,
		},
		input,
		({ from, to, limit, offset }) => ({ from, to, limit, offset }),
		{
			log: (_, result) => ({ campaigns: result.result.length }),
		},
	);
