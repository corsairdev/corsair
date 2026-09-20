import { logEventFromContext } from 'corsair/core';
import { makeActiveCampaignRequest } from '../client';
import type { ActiveCampaignEndpoints } from '../index';
import {
	ActiveCampaignAutomation,
	ActiveCampaignCampaign,
	ActiveCampaignForm,
	ActiveCampaignMessage,
	ActiveCampaignPersonalization,
	ActiveCampaignSavedResponse,
	ActiveCampaignSegment,
	ActiveCampaignTemplate,
} from '../schema/database';
import { auditPayload, listAuditPayload } from './logging';
import { makeResource } from './resource';
import {
	AC_PAGE_SIZE_MAX,
	buildPaginationQuery,
	compactQuery,
	resolveAccount,
} from './shared';
import type { ActiveCampaignEndpointOutputs } from './types';

/**
 * Campaigns, messaging, forms, personalization variables, automations and
 * segments.
 *
 * Message bodies and personalization content are author-written text, so no
 * operation here logs a body - only identifiers, counts and status flags.
 */

const campaigns = makeResource({
	path: 'campaigns',
	one: 'campaign',
	many: 'campaigns',
	event: 'activecampaign.campaigns',
	entity: ActiveCampaignCampaign,
	store: 'campaigns',
	label: 'campaign',
	logKeys: ['id', 'limit', 'offset', 'type', 'status'],
	queryMap: { type: 'filters[type]', status: 'filters[status]' },
	bodyKeys: ['type', 'name', 'status', 'sdate', 'segmentid', 'p', 'm'],
});

const messages = makeResource({
	path: 'messages',
	one: 'message',
	many: 'messages',
	event: 'activecampaign.messages',
	entity: ActiveCampaignMessage,
	store: 'messages',
	label: 'message',
	// subject, html and text are author content and are never logged by value.
	logKeys: ['id', 'limit', 'offset', 'format', 'user'],
	bodyKeys: [
		'subject',
		'fromname',
		'fromemail',
		'reply2',
		'html',
		'text',
		'name',
		'format',
		'user',
		'preheader_text',
	],
});

const savedResponses = makeResource({
	path: 'savedResponses',
	one: 'savedResponse',
	many: 'savedResponses',
	event: 'activecampaign.savedResponses',
	entity: ActiveCampaignSavedResponse,
	store: 'savedResponses',
	label: 'savedResponse',
	logKeys: ['id', 'limit', 'offset'],
	bodyKeys: ['title', 'subject', 'body', 'userid'],
});

const forms = makeResource({
	path: 'forms',
	one: 'form',
	many: 'forms',
	event: 'activecampaign.forms',
	entity: ActiveCampaignForm,
	store: 'forms',
	label: 'form',
	bodyKeys: ['name', 'action', 'layout', 'style'],
});

const personalizations = makeResource({
	path: 'personalizations',
	one: 'personalization',
	many: 'personalizations',
	event: 'activecampaign.personalizations',
	entity: ActiveCampaignPersonalization,
	store: 'personalizations',
	label: 'personalization',
	// `content` is author-written text.
	logKeys: ['id', 'limit', 'offset', 'tag', 'format'],
	bodyKeys: ['name', 'tag', 'content', 'format', 'lists'],
});

const templates = makeResource({
	path: 'templates',
	one: 'template',
	many: 'templates',
	event: 'activecampaign.templates',
	entity: ActiveCampaignTemplate,
	store: 'templates',
	label: 'template',
});

const automations = makeResource({
	path: 'automations',
	one: 'automation',
	many: 'automations',
	event: 'activecampaign.automations',
	entity: ActiveCampaignAutomation,
	store: 'automations',
	label: 'automation',
});

const segments = makeResource({
	path: 'segments',
	one: 'segment',
	many: 'segments',
	event: 'activecampaign.segments',
	entity: ActiveCampaignSegment,
	store: 'segments',
	label: 'segment',
	bodyKeys: ['name', 'logic'],
});

// --- campaigns -------------------------------------------------------------
export const listCampaigns =
	campaigns.list as ActiveCampaignEndpoints['campaignsList'];
export const getCampaign =
	campaigns.get as ActiveCampaignEndpoints['campaignsGet'];
export const createCampaign =
	campaigns.create as ActiveCampaignEndpoints['campaignsCreate'];
export const updateCampaign =
	campaigns.update as ActiveCampaignEndpoints['campaignsUpdate'];

// --- messages --------------------------------------------------------------
export const listMessages =
	messages.list as ActiveCampaignEndpoints['messagesList'];
export const getMessage =
	messages.get as ActiveCampaignEndpoints['messagesGet'];
export const createMessage =
	messages.create as ActiveCampaignEndpoints['messagesCreate'];
export const updateMessage =
	messages.update as ActiveCampaignEndpoints['messagesUpdate'];
export const removeMessage =
	messages.remove as ActiveCampaignEndpoints['messagesDelete'];

// --- saved responses -------------------------------------------------------
export const listSavedResponses =
	savedResponses.list as ActiveCampaignEndpoints['savedResponsesList'];
export const getSavedResponse =
	savedResponses.get as ActiveCampaignEndpoints['savedResponsesGet'];
export const createSavedResponse =
	savedResponses.create as ActiveCampaignEndpoints['savedResponsesCreate'];
export const updateSavedResponse =
	savedResponses.update as ActiveCampaignEndpoints['savedResponsesUpdate'];
export const removeSavedResponse =
	savedResponses.remove as ActiveCampaignEndpoints['savedResponsesDelete'];

// --- forms -----------------------------------------------------------------
export const listForms = forms.list as ActiveCampaignEndpoints['formsList'];
export const getForm = forms.get as ActiveCampaignEndpoints['formsGet'];
export const removeForm =
	forms.remove as ActiveCampaignEndpoints['formsDelete'];

// --- personalization variables ---------------------------------------------
export const listVariables =
	personalizations.list as ActiveCampaignEndpoints['personalizationsList'];
export const getVariable =
	personalizations.get as ActiveCampaignEndpoints['personalizationsGet'];
export const updateVariable =
	personalizations.update as ActiveCampaignEndpoints['personalizationsUpdate'];
export const removeVariable =
	personalizations.remove as ActiveCampaignEndpoints['personalizationsDelete'];

// --- templates -------------------------------------------------------------
export const getTemplate =
	templates.get as ActiveCampaignEndpoints['templatesGet'];

// --- automations -----------------------------------------------------------
export const listAutomations =
	automations.list as ActiveCampaignEndpoints['automationsList'];

// --- segments --------------------------------------------------------------
export const listSegments =
	segments.list as ActiveCampaignEndpoints['segmentsList'];
export const getSegment =
	segments.get as ActiveCampaignEndpoints['segmentsGet'];
export const createSegment =
	segments.create as ActiveCampaignEndpoints['segmentsCreate'];
export const updateSegment =
	segments.update as ActiveCampaignEndpoints['segmentsUpdate'];
export const removeSegment =
	segments.remove as ActiveCampaignEndpoints['segmentsDelete'];

// ---------------------------------------------------------------------------
// Campaign sub-resources
//
// Each returns rows belonging to a resource this plugin does not model, so
// they are returned to the caller but never mirrored.
// ---------------------------------------------------------------------------

function campaignSub<
	K extends
		| 'campaignsGetLinks'
		| 'campaignsGetMessages'
		| 'campaignsGetAutomations'
		| 'campaignsGetAutomationLists'
		| 'campaignsGetUser',
>(path: string, event: string): ActiveCampaignEndpoints[K] {
	return (async (
		ctx: Parameters<ActiveCampaignEndpoints[K]>[0],
		input: { id: string; limit?: number; offset?: number },
	) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs[K]
		>(`campaigns/${input.id}/${path}`, ctx.key, account, {
			method: 'GET',
			query: buildPaginationQuery(input),
		});

		await logEventFromContext(
			ctx,
			event,
			auditPayload(input, ['id', 'limit', 'offset']),
			'completed',
		);
		return response;
	}) as ActiveCampaignEndpoints[K];
}

export const getCampaignLinks = campaignSub<'campaignsGetLinks'>(
	'links',
	'activecampaign.campaigns.getLinks',
);
export const getCampaignMessages = campaignSub<'campaignsGetMessages'>(
	'campaignMessages',
	'activecampaign.campaigns.getMessages',
);
export const getCampaignAutomations = campaignSub<'campaignsGetAutomations'>(
	'automations',
	'activecampaign.campaigns.getAutomations',
);
export const getCampaignAutomationLists =
	campaignSub<'campaignsGetAutomationLists'>(
		'campaignLists',
		'activecampaign.campaigns.getAutomationLists',
	);
export const getCampaignUser = campaignSub<'campaignsGetUser'>(
	'user',
	'activecampaign.campaigns.getUser',
);

/**
 * Duplicates an existing campaign, content and configuration included.
 */
export const duplicateCampaign: ActiveCampaignEndpoints['campaignsDuplicate'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['campaignsDuplicate']
		>(`campaigns/${input.id}/duplicate`, ctx.key, account, { method: 'POST' });

		await logEventFromContext(
			ctx,
			'activecampaign.campaigns.duplicate',
			auditPayload(input, ['id']),
			'completed',
		);
		return response;
	};

/**
 * Creates a shareable link for a campaign template.
 */
export const createTemplateShareLink: ActiveCampaignEndpoints['templatesCreateShareLink'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['templatesCreateShareLink']
		>(`templates/${input.id}/generateShareLink`, ctx.key, account, {
			method: 'POST',
		});

		await logEventFromContext(
			ctx,
			'activecampaign.templates.createShareLink',
			auditPayload(input, ['id']),
			'completed',
		);
		return response;
	};

/**
 * Submits a form opt-in on a contact's behalf.
 *
 * This is a consent action: it records that the contact opted in through the
 * given form, and can trigger the form's automations. The email is the
 * subject's own data, so only the form id and the result are logged.
 */
export const createFormOptin: ActiveCampaignEndpoints['formsCreateOptin'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['formsCreateOptin']
		>('forms/optin', ctx.key, account, {
			method: 'POST',
			body: {
				optin: {
					formid: input.formid,
					email: input.email,
					...(input.firstName !== undefined && { firstName: input.firstName }),
					...(input.lastName !== undefined && { lastName: input.lastName }),
				},
			},
		});

		await logEventFromContext(
			ctx,
			'activecampaign.forms.createOptin',
			{ formid: input.formid, fields: ['email', 'firstName', 'lastName'] },
			'completed',
		);
		return response;
	};

/**
 * Creates a personalization variable.
 *
 * Uses the singular `personalization` path, unlike the plural collection the
 * other verbs use.
 */
export const createVariable: ActiveCampaignEndpoints['personalizationsCreate'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['personalizationsCreate']
		>('personalizations', ctx.key, account, {
			method: 'POST',
			body: {
				personalization: {
					name: input.name,
					tag: input.tag,
					content: input.content,
					...(input.format !== undefined && { format: input.format }),
					...(input.lists !== undefined && { lists: input.lists }),
				},
			},
		});

		await logEventFromContext(
			ctx,
			'activecampaign.personalizations.create',
			auditPayload(input, ['tag', 'format']),
			'completed',
		);
		return response;
	};

/**
 * Deletes many personalization variables at once. Ids that do not exist are
 * ignored by ActiveCampaign rather than raising.
 */
export const removeVariablesBulk: ActiveCampaignEndpoints['personalizationsDeleteBulk'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		await makeActiveCampaignRequest<unknown>(
			'personalizations/bulkDelete',
			ctx.key,
			account,
			{ method: 'POST', body: { ids: input.ids } },
		);

		const store = ctx.db.personalizations as
			| { deleteByEntityId?: (entityId: string) => Promise<unknown> }
			| undefined;
		for (const id of input.ids) {
			if (store?.deleteByEntityId) {
				try {
					await store.deleteByEntityId(String(id));
				} catch (error) {
					console.warn(
						`[ACTIVECAMPAIGN] Failed to evict personalization ${id} from the cache:`,
						error,
					);
				}
			}
		}

		await logEventFromContext(
			ctx,
			'activecampaign.personalizations.deleteBulk',
			{ variableCount: input.ids.length, fields: ['ids'] },
			'completed',
		);
		return { ids: input.ids };
	};

/**
 * Locks or unlocks a personalization variable. Locking prevents edits.
 */
function setVariableLock<
	K extends 'personalizationsLock' | 'personalizationsUnlock',
>(locked: boolean, event: string): ActiveCampaignEndpoints[K] {
	return (async (
		ctx: Parameters<ActiveCampaignEndpoints[K]>[0],
		input: { id: string },
	) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs[K]
		>(`personalizations/${input.id}`, ctx.key, account, {
			method: 'PUT',
			body: { personalization: { locked: locked ? 1 : 0 } },
		});

		await logEventFromContext(
			ctx,
			event,
			auditPayload(input, ['id']),
			'completed',
		);
		return response;
	}) as ActiveCampaignEndpoints[K];
}

export const lockVariable = setVariableLock<'personalizationsLock'>(
	true,
	'activecampaign.personalizations.lock',
);
export const unlockVariable = setVariableLock<'personalizationsUnlock'>(
	false,
	'activecampaign.personalizations.unlock',
);

// ---------------------------------------------------------------------------
// Automation enrolment
// ---------------------------------------------------------------------------

/**
 * Contact-to-automation enrolments. Transactional - a contact can enter the
 * same automation many times - so these are never mirrored.
 */
export const listContactAutomations: ActiveCampaignEndpoints['contactAutomationsList'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['contactAutomationsList']
		>('contactAutomations', ctx.key, account, {
			method: 'GET',
			query: buildPaginationQuery(input),
		});

		await logEventFromContext(
			ctx,
			'activecampaign.contactAutomations.list',
			listAuditPayload(
				input,
				['limit', 'offset'],
				response.contactAutomations?.length ?? 0,
			),
			'completed',
		);
		return response;
	};

export const getContactAutomation: ActiveCampaignEndpoints['contactAutomationsGet'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['contactAutomationsGet']
		>(`contactAutomations/${input.id}`, ctx.key, account, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'activecampaign.contactAutomations.get',
			auditPayload(input, ['id']),
			'completed',
		);
		return response;
	};

/**
 * How many times a contact has entered each automation.
 */
export const getAutomationEntryCounts: ActiveCampaignEndpoints['contactAutomationsEntryCounts'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['contactAutomationsEntryCounts']
		>(`contacts/${input.id}/automationEntryCounts`, ctx.key, account, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'activecampaign.contactAutomations.entryCounts',
			auditPayload(input, ['id']),
			'completed',
		);
		return response;
	};

/**
 * Enrols a contact in an automation, looked up by email.
 *
 * Automations cannot be created through the API - only through the UI - so the
 * automation must already exist. The contact is resolved to an id first,
 * because the enrolment endpoint takes ids rather than emails.
 */
export const addContactToAutomation: ActiveCampaignEndpoints['contactAutomationsAdd'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);

		const found = await makeActiveCampaignRequest<{
			contacts?: Array<{ id?: string }>;
		}>('contacts', ctx.key, account, {
			method: 'GET',
			query: { email: input.email },
		});

		const contactId = found.contacts?.[0]?.id;
		if (!contactId) {
			throw new Error(
				'No ActiveCampaign contact matches the supplied email address',
			);
		}

		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['contactAutomationsAdd']
		>('contactAutomations', ctx.key, account, {
			method: 'POST',
			body: {
				contactAutomation: {
					contact: contactId,
					automation: input.automation_id,
				},
			},
		});

		await logEventFromContext(
			ctx,
			'activecampaign.contactAutomations.add',
			{
				contact: contactId,
				automation: input.automation_id,
				fields: ['email'],
			},
			'completed',
		);
		return response;
	};

/**
 * Removes a contact from an automation.
 *
 * A contact can hold several enrolments in the same automation, so this
 * resolves the contact, lists their enrolments, and removes either every
 * matching run or only the most recent. Destructive and not reversible.
 */
export const removeContactFromAutomation: ActiveCampaignEndpoints['contactAutomationsRemove'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);

		const found = await makeActiveCampaignRequest<{
			contacts?: Array<{ id?: string }>;
		}>('contacts', ctx.key, account, {
			method: 'GET',
			query: { email: input.email },
		});

		const contactId = found.contacts?.[0]?.id;
		if (!contactId) {
			throw new Error(
				'No ActiveCampaign contact matches the supplied email address',
			);
		}

		type Enrolment = { id?: string; automation?: string; adddate?: string };
		const enrolments: Enrolment[] = [];
		for (let offset = 0; ; ) {
			const page = await makeActiveCampaignRequest<{
				contactAutomations?: Enrolment[];
				meta?: { total?: string | number };
			}>(`contacts/${contactId}/contactAutomations`, ctx.key, account, {
				method: 'GET',
				query: { limit: AC_PAGE_SIZE_MAX, offset },
			});
			const rows = page.contactAutomations ?? [];
			enrolments.push(...rows);
			offset += rows.length;
			const total = Number(page.meta?.total);
			if (rows.length === 0 || rows.length < AC_PAGE_SIZE_MAX) break;
			if (Number.isFinite(total) && offset >= total) break;
		}

		const matching = enrolments.filter(
			(e) => e.automation === input.automation_id && e.id,
		);
		matching.sort((a, b) =>
			String(a.adddate ?? '').localeCompare(String(b.adddate ?? '')),
		);
		const targets =
			input.run_remove_option === 'last' ? matching.slice(-1) : matching;

		let removed = 0;
		try {
			for (const target of targets) {
				await makeActiveCampaignRequest<unknown>(
					`contactAutomations/${target.id}`,
					ctx.key,
					account,
					{ method: 'DELETE' },
				);
				removed++;
			}
		} catch (error) {
			await logEventFromContext(
				ctx,
				'activecampaign.contactAutomations.remove',
				{
					contact: contactId,
					automation: input.automation_id,
					removed,
					fields: ['email'],
				},
				'failed',
			);
			throw error;
		}

		await logEventFromContext(
			ctx,
			'activecampaign.contactAutomations.remove',
			{
				contact: contactId,
				automation: input.automation_id,
				removed,
				fields: ['email'],
			},
			'completed',
		);
		return { removed };
	};

/**
 * Saved segments, exposed by ActiveCampaign as "audiences".
 */
export const listAudiences: ActiveCampaignEndpoints['segmentsListAudiences'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['segmentsListAudiences']
		>('segments', ctx.key, account, {
			method: 'GET',
			query: {
				...buildPaginationQuery(input),
				...compactQuery({ 'filters[name]': input.name }),
			},
		});

		await logEventFromContext(
			ctx,
			'activecampaign.segments.listAudiences',
			listAuditPayload(
				input,
				['limit', 'offset'],
				response.segments?.length ?? 0,
			),
			'completed',
		);
		return response;
	};
