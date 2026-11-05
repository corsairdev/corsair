import { logEventFromContext } from 'corsair/core';
import { makeCallPageRequest } from '../client';
import type { CallPageEndpoints } from '../index';
import { deleteManager, patchManager, saveManagers } from './persist';
import type { CallPageEndpointOutputs } from './types';
import {
	CallPageEndpointInputSchemas,
	CallPageEndpointOutputSchemas,
} from './types';

export const list: CallPageEndpoints['managersList'] = async (
	ctx,
	rawInput,
) => {
	const input = CallPageEndpointInputSchemas.managersList.parse(rawInput);
	const result = await makeCallPageRequest<
		CallPageEndpointOutputs['managersList']
	>('/api/v1/external/managers/all', ctx.key, {
		query: input,
		schema: CallPageEndpointOutputSchemas.managersList,
	});
	await saveManagers(ctx, input.widget_id, result);
	await logEventFromContext(ctx, 'callpage.managers.list', input, 'completed');
	return result;
};

export const get: CallPageEndpoints['managersGet'] = async (ctx, rawInput) => {
	const input = CallPageEndpointInputSchemas.managersGet.parse(rawInput);
	const result = await makeCallPageRequest<
		CallPageEndpointOutputs['managersGet']
	>('/api/v1/external/managers/get', ctx.key, {
		query: input,
		schema: CallPageEndpointOutputSchemas.managersGet,
	});
	await saveManagers(ctx, input.widget_id, [result]);
	await logEventFromContext(ctx, 'callpage.managers.get', input, 'completed');
	return result;
};

export const create: CallPageEndpoints['managersCreate'] = async (
	ctx,
	rawInput,
) => {
	const input = CallPageEndpointInputSchemas.managersCreate.parse(rawInput);
	const result = await makeCallPageRequest<
		CallPageEndpointOutputs['managersCreate']
	>('/api/v1/external/managers/create', ctx.key, {
		method: 'POST',
		body: input,
		schema: CallPageEndpointOutputSchemas.managersCreate,
	});
	await patchManager(ctx, {
		id: result.id,
		widget_id: input.widget_id,
		user_id: input.user_id,
		enabled: input.enabled,
		business_times: input.business_times,
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
	rawInput,
) => {
	const input = CallPageEndpointInputSchemas.managersUpdate.parse(rawInput);
	const result = await makeCallPageRequest<
		CallPageEndpointOutputs['managersUpdate']
	>('/api/v1/external/managers/update', ctx.key, {
		method: 'POST',
		body: input,
		schema: CallPageEndpointOutputSchemas.managersUpdate,
	});
	await patchManager(ctx, {
		widget_id: input.widget_id,
		user_id: input.user_id,
		enabled: input.enabled,
		business_times: input.business_times,
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
	rawInput,
) => {
	const input = CallPageEndpointInputSchemas.managersDelete.parse(rawInput);
	const result = await makeCallPageRequest<
		CallPageEndpointOutputs['managersDelete']
	>('/api/v1/external/managers/delete', ctx.key, {
		method: 'POST',
		body: input,
		schema: CallPageEndpointOutputSchemas.managersDelete,
	});
	await deleteManager(ctx, input.widget_id, input.user_id);
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
	async (ctx, rawInput) => {
		const input =
			CallPageEndpointInputSchemas.managersStatusStatistics.parse(rawInput);
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
