import type { PingdomEndpoints } from '..';
import { call } from './call';
import {
	PingdomEndpointInputSchemas as Inputs,
	PingdomEndpointOutputSchemas as Outputs,
} from './types';

const V31 = '/api/3.1';

/** Common create/update fields mapped to the Pingdom body keys. */
function checkCommonBody(common: {
	paused?: boolean;
	resolution?: number;
	userIds?: number[];
	teamIds?: number[];
	integrationIds?: number[];
	sendNotificationWhenDown?: number;
	notifyAgainEvery?: number;
	notifyWhenBackup?: boolean;
	tags?: string;
	probeFilters?: Record<string, unknown>[];
	ipv6?: boolean;
	responseTimeThreshold?: number;
	customMessage?: string;
}): Record<string, unknown> {
	return {
		paused: common.paused,
		resolution: common.resolution,
		userids: common.userIds,
		teamids: common.teamIds,
		integrationids: common.integrationIds,
		sendnotificationwhendown: common.sendNotificationWhenDown,
		notifyagainevery: common.notifyAgainEvery,
		notifywhenbackup: common.notifyWhenBackup,
		tags: common.tags,
		probe_filters: common.probeFilters,
		ipv6: common.ipv6,
		responsetime_threshold: common.responseTimeThreshold,
		custom_message: common.customMessage,
	};
}

export const list: PingdomEndpoints['checksList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'checks.list',
			input: Inputs.checksList,
			output: Outputs.checksList,
		},
		input,
		({
			limit,
			offset,
			showEncryption,
			includeTags,
			includeSeverity,
			tags,
		}) => ({
			method: 'GET',
			path: `${V31}/checks`,
			query: {
				limit,
				offset,
				showencryption: showEncryption,
				include_tags: includeTags,
				include_severity: includeSeverity,
				tags,
			},
		}),
		{ log: (_, page) => ({ count: page.checks.length }) },
	);

export const create: PingdomEndpoints['checksCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'checks.create',
			input: Inputs.checksCreate,
			output: Outputs.checksCreate,
		},
		input,
		({ name, host, type, typeSettings, ...common }) => ({
			method: 'POST',
			path: `${V31}/checks`,
			body: {
				name,
				host,
				type,
				...checkCommonBody(common),
				...typeSettings,
			},
		}),
		{ log: (_, created) => ({ checkId: created.check.id ?? undefined }) },
	);

export const get: PingdomEndpoints['checksGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'checks.get',
			input: Inputs.checksGet,
			output: Outputs.checksGet,
		},
		input,
		({ checkId }) => ({
			method: 'GET',
			path: `${V31}/checks/${checkId}`,
		}),
		{ log: (_, detail) => ({ checkId: detail.check.id ?? undefined }) },
	);

export const update: PingdomEndpoints['checksUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'checks.update',
			input: Inputs.checksUpdate,
			output: Outputs.checksUpdate,
		},
		input,
		({ checkId, name, host, type, typeSettings, ...common }) => ({
			method: 'PUT',
			path: `${V31}/checks/${checkId}`,
			body: {
				name,
				host,
				type,
				...checkCommonBody(common),
				...typeSettings,
			},
		}),
		{ log: ({ checkId }) => ({ checkId }) },
	);

export const deleteCheck: PingdomEndpoints['checksDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'checks.delete',
			input: Inputs.checksDelete,
			output: Outputs.checksDelete,
		},
		input,
		({ checkId }) => ({
			method: 'DELETE',
			path: `${V31}/checks/${checkId}`,
		}),
		{ log: ({ checkId }) => ({ checkId }) },
	);

export const updateMulti: PingdomEndpoints['checksUpdateMulti'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'checks.updateMulti',
			input: Inputs.checksUpdateMulti,
			output: Outputs.checksUpdateMulti,
		},
		input,
		({ checkIds, paused, resolution }) => ({
			method: 'PUT',
			path: `${V31}/checks`,
			body: { checkids: checkIds.join(','), paused, resolution },
		}),
		{
			log: ({ checkIds, paused, resolution }) => ({
				count: checkIds.length,
				paused,
				resolution,
			}),
		},
	);

export const deleteMulti: PingdomEndpoints['checksDeleteMulti'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'checks.deleteMulti',
			input: Inputs.checksDeleteMulti,
			output: Outputs.checksDeleteMulti,
		},
		input,
		({ checkIds }) => ({
			method: 'DELETE',
			path: `${V31}/checks`,
			query: { delcheckids: checkIds.join(',') },
		}),
		{ log: ({ checkIds }) => ({ count: checkIds.length }) },
	);
