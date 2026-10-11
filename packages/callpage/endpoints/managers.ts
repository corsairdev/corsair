import { logEventFromContext } from 'corsair/core';
import { makeCallPageRequest } from '../client';
import type { CallPageEndpoints } from '../index';
import type { CallPageEndpointOutputs } from './types';
import { CallPageEndpointOutputSchemas } from './types';

export const list: CallPageEndpoints['managersList'] = async (ctx, input) => {
	const result = await makeCallPageRequest<
		CallPageEndpointOutputs['managersList']
	>('/api/v1/external/managers/all', ctx.key, {
		query: input,
		schema: CallPageEndpointOutputSchemas.managersList,
	});
	await logEventFromContext(ctx, 'callpage.managers.list', input, 'completed');
	return result;
};

export const get: CallPageEndpoints['managersGet'] = async (ctx, input) => {
	const result = await makeCallPageRequest<
		CallPageEndpointOutputs['managersGet']
	>('/api/v1/external/managers/get', ctx.key, {
		query: input,
		schema: CallPageEndpointOutputSchemas.managersGet,
	});
	await logEventFromContext(ctx, 'callpage.managers.get', input, 'completed');
	return result;
};

export const create: CallPageEndpoints['managersCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeCallPageRequest<
		CallPageEndpointOutputs['managersCreate']
	>('/api/v1/external/managers/create', ctx.key, {
		method: 'POST',
		body: input,
		schema: CallPageEndpointOutputSchemas.managersCreate,
	});
	await logEventFromContext(
		ctx,
		'callpage.managers.create',
		input,
		'completed',
	);
	return result;
};

export const update: CallPageEndpoints['managersUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeCallPageRequest<
		CallPageEndpointOutputs['managersUpdate']
	>('/api/v1/external/managers/update', ctx.key, {
		method: 'POST',
		body: input,
		schema: CallPageEndpointOutputSchemas.managersUpdate,
	});
	await logEventFromContext(
		ctx,
		'callpage.managers.update',
		input,
		'completed',
	);
	return result;
};

export const remove: CallPageEndpoints['managersDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeCallPageRequest<
		CallPageEndpointOutputs['managersDelete']
	>('/api/v1/external/managers/delete', ctx.key, {
		method: 'POST',
		query: input,
		schema: CallPageEndpointOutputSchemas.managersDelete,
	});
	await logEventFromContext(
		ctx,
		'callpage.managers.delete',
		input,
		'completed',
	);
	return result;
};

// CallPage has no statistics route, so counts are derived by paging through
// every manager of the widget.
const MANAGERS_PAGE_SIZE = 100;

export const statusStatistics: CallPageEndpoints['managersStatusStatistics'] =
	async (ctx, input) => {
		let total = 0;
		let enabled = 0;
		for (let offset = 0; ; offset += MANAGERS_PAGE_SIZE) {
			const page = await makeCallPageRequest<
				CallPageEndpointOutputs['managersList']
			>('/api/v1/external/managers/all', ctx.key, {
				query: {
					widget_id: input.widget_id,
					offset,
					limit: MANAGERS_PAGE_SIZE,
				},
				schema: CallPageEndpointOutputSchemas.managersList,
			});
			total += page.length;
			enabled += page.filter((m) => m.enabled === true).length;
			if (page.length < MANAGERS_PAGE_SIZE) break;
		}
		await logEventFromContext(
			ctx,
			'callpage.managers.statusStatistics',
			input,
			'completed',
		);
		return { total, enabled, disabled: total - enabled };
	};
