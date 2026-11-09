import type { OnedeskEndpoints } from '..';
import { call } from './call';
import { updateCode, withNextOffset } from './shape';
import {
	OnedeskEndpointInputSchemas as Inputs,
	OnedeskEndpointOutputSchemas as Outputs,
} from './types';

// ── customers ─────────────────────────────────────────────────────────────

export const customersFilter: OnedeskEndpoints['customersFilter'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'customers.filter',
			input: Inputs.customersFilter,
			output: Outputs.customersFilter,
		},
		input,
		(parsed) => ({ method: 'POST', path: '/customers/filter', body: parsed }),
		{
			shape: (raw, parsed) => withNextOffset(raw, parsed.offset),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const customersFilterDetails: OnedeskEndpoints['customersFilterDetails'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'customers.filterDetails',
				input: Inputs.customersFilterDetails,
				output: Outputs.customersFilterDetails,
			},
			input,
			(parsed) => ({
				method: 'POST',
				path: '/customers/filter/details',
				body: parsed,
			}),
			{
				shape: (raw, parsed) => withNextOffset(raw, parsed.offset),
				log: (_, result) => ({ count: result.data.length }),
			},
		);

export const customersGet: OnedeskEndpoints['customersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customers.get',
			input: Inputs.customersGet,
			output: Outputs.customersGet,
		},
		input,
		(parsed) =>
			parsed.externalId
				? {
						method: 'GET',
						path: `/customers/externalId/${encodeURIComponent(parsed.externalId)}`,
					}
				: { method: 'GET', path: `/customers/id/${parsed.id}` },
	);

export const customersCreate: OnedeskEndpoints['customersCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'customers.create',
			input: Inputs.customersCreate,
			output: Outputs.customersCreate,
		},
		input,
		(parsed) => ({ method: 'POST', path: '/customers/', body: parsed }),
		{
			log: (_, result) => ({
				externalId: result.data ?? undefined,
			}),
		},
	);

export const customersUpdate: OnedeskEndpoints['customersUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'customers.update',
			input: Inputs.customersUpdate,
			output: Outputs.customersUpdate,
		},
		input,
		({ externalId, id, ...body }) => ({
			method: 'POST',
			path: externalId
				? `/customers/externalId/${encodeURIComponent(externalId)}`
				: `/customers/id/${id}`,
			body,
		}),
		{
			shape: updateCode,
			log: (parsed) => ({
				externalId: parsed.externalId,
				id: parsed.id,
			}),
		},
	);

// ── customer organizations ────────────────────────────────────────────────

export const organizationsFilter: OnedeskEndpoints['organizationsFilter'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'organizations.filter',
			input: Inputs.organizationsFilter,
			output: Outputs.organizationsFilter,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/customer-organizations/filter',
			body: parsed,
		}),
		{
			shape: (raw, parsed) => withNextOffset(raw, parsed.offset),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const organizationsFilterDetails: OnedeskEndpoints['organizationsFilterDetails'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'organizations.filterDetails',
				input: Inputs.organizationsFilterDetails,
				output: Outputs.organizationsFilterDetails,
			},
			input,
			(parsed) => ({
				method: 'POST',
				path: '/customer-organizations/filter/details',
				body: parsed,
			}),
			{
				shape: (raw, parsed) => withNextOffset(raw, parsed.offset),
				log: (_, result) => ({ count: result.data.length }),
			},
		);

export const organizationsGet: OnedeskEndpoints['organizationsGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'organizations.get',
			input: Inputs.organizationsGet,
			output: Outputs.organizationsGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/customer-organizations/externalId/${encodeURIComponent(parsed.externalId)}`,
		}),
	);

export const organizationsCreate: OnedeskEndpoints['organizationsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'organizations.create',
			input: Inputs.organizationsCreate,
			output: Outputs.organizationsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/customer-organizations/',
			body: parsed,
		}),
		{
			log: (parsed, result) => ({
				name: parsed.name,
				externalId: result.data ?? undefined,
			}),
		},
	);

export const organizationsUpdate: OnedeskEndpoints['organizationsUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'organizations.update',
			input: Inputs.organizationsUpdate,
			output: Outputs.organizationsUpdate,
		},
		input,
		({ externalId, ...body }) => ({
			method: 'POST',
			path: `/customer-organizations/externalId/${encodeURIComponent(externalId)}`,
			body,
		}),
		{
			shape: updateCode,
			log: (parsed) => ({ externalId: parsed.externalId }),
		},
	);

// ── timesheets ────────────────────────────────────────────────────────────

export const timesheetsFilter: OnedeskEndpoints['timesheetsFilter'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'timesheets.filter',
			input: Inputs.timesheetsFilter,
			output: Outputs.timesheetsFilter,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/timesheets/filter',
			body: parsed,
		}),
		{
			shape: (raw, parsed) => withNextOffset(raw, parsed.offset),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const timesheetsFilterDetails: OnedeskEndpoints['timesheetsFilterDetails'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'timesheets.filterDetails',
				input: Inputs.timesheetsFilterDetails,
				output: Outputs.timesheetsFilterDetails,
			},
			input,
			(parsed) => ({
				method: 'POST',
				path: '/timesheets/filter/details',
				body: parsed,
			}),
			{
				shape: (raw, parsed) => withNextOffset(raw, parsed.offset),
				log: (_, result) => ({ count: result.data.length }),
			},
		);

export const timesheetsGet: OnedeskEndpoints['timesheetsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'timesheets.get',
			input: Inputs.timesheetsGet,
			output: Outputs.timesheetsGet,
		},
		input,
		(parsed) =>
			parsed.externalId
				? {
						method: 'GET',
						path: `/timesheets/externalId/${encodeURIComponent(parsed.externalId)}`,
					}
				: { method: 'GET', path: `/timesheets/id/${parsed.id}` },
	);

export const timesheetsCreate: OnedeskEndpoints['timesheetsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'timesheets.create',
			input: Inputs.timesheetsCreate,
			output: Outputs.timesheetsCreate,
		},
		input,
		(parsed) => ({ method: 'POST', path: '/timesheets/', body: parsed }),
		{
			log: (parsed, result) => ({
				taskExternalId: parsed.taskExternalId,
				externalId: result.data ?? undefined,
			}),
		},
	);

export const timesheetsUpdate: OnedeskEndpoints['timesheetsUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'timesheets.update',
			input: Inputs.timesheetsUpdate,
			output: Outputs.timesheetsUpdate,
		},
		input,
		({ externalId, id, ...body }) => ({
			method: 'POST',
			path: externalId
				? `/timesheets/externalId/${encodeURIComponent(externalId)}`
				: `/timesheets/id/${id}`,
			body,
		}),
		{
			shape: updateCode,
			log: (parsed) => ({
				externalId: parsed.externalId,
				id: parsed.id,
			}),
		},
	);

// ── timers ────────────────────────────────────────────────────────────────

export const timersFilter: OnedeskEndpoints['timersFilter'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'timers.filter',
			input: Inputs.timersFilter,
			output: Outputs.timersFilter,
		},
		input,
		(parsed) => ({ method: 'POST', path: '/timers/filter', body: parsed }),
		{
			shape: (raw, parsed) => withNextOffset(raw, parsed.offset),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const timersFilterDetails: OnedeskEndpoints['timersFilterDetails'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'timers.filterDetails',
			input: Inputs.timersFilterDetails,
			output: Outputs.timersFilterDetails,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/timers/filter/details',
			body: parsed,
		}),
		{
			shape: (raw, parsed) => withNextOffset(raw, parsed.offset),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const timersGet: OnedeskEndpoints['timersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'timers.get',
			input: Inputs.timersGet,
			output: Outputs.timersGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/timers/externalId/${encodeURIComponent(parsed.externalId)}`,
		}),
	);

/**
 * Timers are changed over GET, which the API defines that way. Only `start`
 * takes an item; pause, resume and cancel act on the timer alone.
 */
export const timersStart: OnedeskEndpoints['timersStart'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'timers.start',
			input: Inputs.timersStart,
			output: Outputs.timersStart,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/timers/start/${encodeURIComponent(parsed.timerExternalId)}/${encodeURIComponent(parsed.itemExternalId)}`,
		}),
		{
			log: (parsed, result) => ({
				timerExternalId: parsed.timerExternalId,
				code: result.code ?? undefined,
			}),
		},
	);

export const timersPause: OnedeskEndpoints['timersPause'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'timers.pause',
			input: Inputs.timersPause,
			output: Outputs.timersPause,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/timers/pause/${encodeURIComponent(parsed.timerExternalId)}`,
		}),
		{
			log: (parsed, result) => ({
				timerExternalId: parsed.timerExternalId,
				code: result.code ?? undefined,
			}),
		},
	);

export const timersResume: OnedeskEndpoints['timersResume'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'timers.resume',
			input: Inputs.timersResume,
			output: Outputs.timersResume,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/timers/resume/${encodeURIComponent(parsed.timerExternalId)}`,
		}),
		{
			log: (parsed, result) => ({
				timerExternalId: parsed.timerExternalId,
				code: result.code ?? undefined,
			}),
		},
	);

export const timersCancel: OnedeskEndpoints['timersCancel'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'timers.cancel',
			input: Inputs.timersCancel,
			output: Outputs.timersCancel,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/timers/cancel/${encodeURIComponent(parsed.timerExternalId)}`,
		}),
		{
			log: (parsed, result) => ({
				timerExternalId: parsed.timerExternalId,
				code: result.code ?? undefined,
			}),
		},
	);

// ── conversations ─────────────────────────────────────────────────────────

export const conversationsFilter: OnedeskEndpoints['conversationsFilter'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'conversations.filter',
			input: Inputs.conversationsFilter,
			output: Outputs.conversationsFilter,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/conversations/filter',
			body: parsed,
		}),
		{
			shape: (raw, parsed) => withNextOffset(raw, parsed.offset),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const conversationsFilterDetails: OnedeskEndpoints['conversationsFilterDetails'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'conversations.filterDetails',
				input: Inputs.conversationsFilterDetails,
				output: Outputs.conversationsFilterDetails,
			},
			input,
			(parsed) => ({
				method: 'POST',
				path: '/conversations/filter/details',
				body: parsed,
			}),
			{
				shape: (raw, parsed) => withNextOffset(raw, parsed.offset),
				log: (_, result) => ({ count: result.data.length }),
			},
		);

export const conversationsGet: OnedeskEndpoints['conversationsGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'conversations.get',
			input: Inputs.conversationsGet,
			output: Outputs.conversationsGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/conversations/externalId/${encodeURIComponent(parsed.externalId)}`,
		}),
	);

export const conversationsCreate: OnedeskEndpoints['conversationsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'conversations.create',
			input: Inputs.conversationsCreate,
			output: Outputs.conversationsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/conversations/',
			body: parsed,
		}),
		{
			log: (parsed, result) => ({
				itemExternalId: parsed.itemExternalId,
				externalId: result.data ?? undefined,
			}),
		},
	);

export const conversationsUpdate: OnedeskEndpoints['conversationsUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'conversations.update',
			input: Inputs.conversationsUpdate,
			output: Outputs.conversationsUpdate,
		},
		input,
		({ externalId, ...body }) => ({
			method: 'POST',
			path: `/conversations/externalId/${encodeURIComponent(externalId)}`,
			body,
		}),
		{
			shape: updateCode,
			log: (parsed) => ({ externalId: parsed.externalId }),
		},
	);

// ── conversation messages ─────────────────────────────────────────────────

export const messagesFilter: OnedeskEndpoints['messagesFilter'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'messages.filter',
			input: Inputs.messagesFilter,
			output: Outputs.messagesFilter,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/conversation-messages/filter',
			body: parsed,
		}),
		{
			shape: (raw, parsed) => withNextOffset(raw, parsed.offset),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const messagesFilterDetails: OnedeskEndpoints['messagesFilterDetails'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'messages.filterDetails',
				input: Inputs.messagesFilterDetails,
				output: Outputs.messagesFilterDetails,
			},
			input,
			(parsed) => ({
				method: 'POST',
				path: '/conversation-messages/filter/details',
				body: parsed,
			}),
			{
				shape: (raw, parsed) => withNextOffset(raw, parsed.offset),
				log: (_, result) => ({ count: result.data.length }),
			},
		);

export const messagesGet: OnedeskEndpoints['messagesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'messages.get',
			input: Inputs.messagesGet,
			output: Outputs.messagesGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/conversation-messages/externalId/${encodeURIComponent(parsed.externalId)}`,
		}),
	);

export const messagesCreate: OnedeskEndpoints['messagesCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'messages.create',
			input: Inputs.messagesCreate,
			output: Outputs.messagesCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/conversation-messages/',
			body: parsed,
		}),
		{
			log: (parsed, result) => ({
				conversationExternalId: parsed.conversationExternalId,
				externalId: result.data ?? undefined,
			}),
		},
	);

export const messagesUpdate: OnedeskEndpoints['messagesUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'messages.update',
			input: Inputs.messagesUpdate,
			output: Outputs.messagesUpdate,
		},
		input,
		({ externalId, ...body }) => ({
			method: 'POST',
			path: `/conversation-messages/externalId/${encodeURIComponent(externalId)}`,
			body,
		}),
		{
			shape: updateCode,
			log: (parsed) => ({ externalId: parsed.externalId }),
		},
	);

// ── activities ────────────────────────────────────────────────────────────

export const activitiesFilterDetails: OnedeskEndpoints['activitiesFilterDetails'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'activities.filterDetails',
				input: Inputs.activitiesFilterDetails,
				output: Outputs.activitiesFilterDetails,
			},
			input,
			(parsed) => ({
				method: 'POST',
				path: '/activities/filter/details',
				body: parsed,
			}),
			{
				shape: (raw, parsed) => withNextOffset(raw, parsed.offset),
				log: (_, result) => ({ count: result.data.length }),
			},
		);

// ── organization settings ─────────────────────────────────────────────────

/** These reads supply the names the write operations require. */
export const organizationItemTypes: OnedeskEndpoints['organizationItemTypes'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'organization.itemTypes',
				input: Inputs.organizationItemTypes,
				output: Outputs.organizationItemTypes,
			},
			input,
			() => ({ method: 'GET', path: '/organization/itemTypes' }),
		);

export const organizationContainerTypes: OnedeskEndpoints['organizationContainerTypes'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'organization.containerTypes',
				input: Inputs.organizationContainerTypes,
				output: Outputs.organizationContainerTypes,
			},
			input,
			() => ({ method: 'GET', path: '/organization/containerTypes' }),
		);

export const organizationUserTypes: OnedeskEndpoints['organizationUserTypes'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'organization.userTypes',
				input: Inputs.organizationUserTypes,
				output: Outputs.organizationUserTypes,
			},
			input,
			() => ({ method: 'GET', path: '/organization/userTypes' }),
		);

export const organizationLifecycleStatus: OnedeskEndpoints['organizationLifecycleStatus'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'organization.lifecycleStatus',
				input: Inputs.organizationLifecycleStatus,
				output: Outputs.organizationLifecycleStatus,
			},
			input,
			() => ({ method: 'GET', path: '/organization/lifecycleStatus' }),
		);

export const organizationProfile: OnedeskEndpoints['organizationProfile'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'organization.profile',
			input: Inputs.organizationProfile,
			output: Outputs.organizationProfile,
		},
		input,
		() => ({ method: 'GET', path: '/organization/profileAndPolicy' }),
	);
