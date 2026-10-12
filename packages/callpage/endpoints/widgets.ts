import { logEventFromContext } from 'corsair/core';
import { makeCallPageRequest } from '../client';
import type { CallPageEndpoints } from '../index';
import { deleteWidget, saveWidgets } from './persist';
import type { CallPageEndpointOutputs } from './types';
import { CallPageEndpointOutputSchemas } from './types';

export const list: CallPageEndpoints['widgetsList'] = async (ctx, input) => {
	const result = await makeCallPageRequest<
		CallPageEndpointOutputs['widgetsList']
	>('/api/v1/external/widgets/all', ctx.key, {
		query: input,
		schema: CallPageEndpointOutputSchemas.widgetsList,
	});
	await saveWidgets(ctx, result);
	await logEventFromContext(ctx, 'callpage.widgets.list', input, 'completed');
	return result;
};

export const addUsers: CallPageEndpoints['widgetsAddUsers'] = async (
	ctx,
	input,
) => {
	const result = await makeCallPageRequest<
		CallPageEndpointOutputs['widgetsAddUsers']
	>('/api/v1/external/widgets/add-users', ctx.key, {
		method: 'POST',
		body: input,
		schema: CallPageEndpointOutputSchemas.widgetsAddUsers,
	});
	await logEventFromContext(
		ctx,
		'callpage.widgets.addUsers',
		input,
		'completed',
	);
	return result;
};

export const get: CallPageEndpoints['widgetsGet'] = async (ctx, input) => {
	const result = await makeCallPageRequest<
		CallPageEndpointOutputs['widgetsGet']
	>('/api/v1/external/widgets/get', ctx.key, {
		query: input,
		schema: CallPageEndpointOutputSchemas.widgetsGet,
	});
	await saveWidgets(ctx, [result]);
	await logEventFromContext(ctx, 'callpage.widgets.get', input, 'completed');
	return result;
};

export const create: CallPageEndpoints['widgetsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeCallPageRequest<
		CallPageEndpointOutputs['widgetsCreate']
	>('/api/v1/external/widgets/create', ctx.key, {
		method: 'POST',
		body: input,
		schema: CallPageEndpointOutputSchemas.widgetsCreate,
	});
	await saveWidgets(ctx, [
		{
			id: result.id,
			url: input.url,
			description: input.description,
			locale_code: input.locale_code,
			enabled: input.enabled,
		},
	]);
	await logEventFromContext(ctx, 'callpage.widgets.create', input, 'completed');
	return result;
};

export const update: CallPageEndpoints['widgetsUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeCallPageRequest<
		CallPageEndpointOutputs['widgetsUpdate']
	>('/api/v1/external/widgets/update', ctx.key, {
		method: 'POST',
		body: input,
		schema: CallPageEndpointOutputSchemas.widgetsUpdate,
	});
	await saveWidgets(ctx, [
		{
			id: input.id,
			url: input.url,
			description: input.description,
			locale_code: input.locale_code,
			enabled: input.enabled,
		},
	]);
	await logEventFromContext(ctx, 'callpage.widgets.update', input, 'completed');
	return result;
};

export const remove: CallPageEndpoints['widgetsDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeCallPageRequest<
		CallPageEndpointOutputs['widgetsDelete']
	>('/api/v1/external/widgets/delete', ctx.key, {
		method: 'POST',
		body: input,
		schema: CallPageEndpointOutputSchemas.widgetsDelete,
	});
	await deleteWidget(ctx, input.id);
	await logEventFromContext(ctx, 'callpage.widgets.delete', input, 'completed');
	return result;
};

export const call: CallPageEndpoints['widgetsCall'] = async (ctx, input) => {
	const result = await makeCallPageRequest<
		CallPageEndpointOutputs['widgetsCall']
	>('/api/v1/external/widgets/call', ctx.key, {
		method: 'POST',
		body: input,
		schema: CallPageEndpointOutputSchemas.widgetsCall,
	});
	await logEventFromContext(
		ctx,
		'callpage.widgets.call',
		{ id: input.id, tel: input.tel },
		'completed',
	);
	return result;
};

export const callOrSchedule: CallPageEndpoints['widgetsCallOrSchedule'] =
	async (ctx, input) => {
		const result = await makeCallPageRequest<
			CallPageEndpointOutputs['widgetsCallOrSchedule']
		>('/api/v1/external/widgets/call-or-schedule', ctx.key, {
			method: 'POST',
			body: input,
			schema: CallPageEndpointOutputSchemas.widgetsCallOrSchedule,
		});
		await logEventFromContext(
			ctx,
			'callpage.widgets.callOrSchedule',
			{ id: input.id, tel: input.tel },
			'completed',
		);
		return result;
	};
