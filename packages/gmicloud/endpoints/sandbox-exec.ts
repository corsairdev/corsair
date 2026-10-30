import { logEventFromContext } from 'corsair/core';
import type { GmicloudEndpoints } from '..';
import { makeGmicloudRequest } from '../client';
import {
	GmicloudEndpointInputSchemas,
	GmicloudEndpointOutputSchemas,
} from './types';

export const run: GmicloudEndpoints['sandboxExecRun'] = async (ctx, input) => {
	const {
		sandbox_key,
		domain,
		access_token,
		wait,
		wait_timeout_seconds,
		request_id,
		...body
	} = GmicloudEndpointInputSchemas.sandboxExecRun.parse(input);
	const result = GmicloudEndpointOutputSchemas.sandboxExecRun.parse(
		await makeGmicloudRequest(ctx, {
			api: 'sandbox',
			method: 'POST',
			url: 'executions',
			sandbox: { sandbox_key, domain, access_token },
			query: { wait, wait_timeout_seconds },
			headers: { 'X-Request-ID': request_id },
			body,
		}),
	);
	await logEventFromContext(ctx, 'gmicloud.sandboxExec.run', {}, 'completed');
	return result;
};

export const get: GmicloudEndpoints['sandboxExecGet'] = async (ctx, input) => {
	const { sandbox_key, domain, access_token, execution_id, request_id } =
		GmicloudEndpointInputSchemas.sandboxExecGet.parse(input);
	const result = GmicloudEndpointOutputSchemas.sandboxExecGet.parse(
		await makeGmicloudRequest(ctx, {
			api: 'sandbox',
			method: 'GET',
			url: 'executions/{execution_id}',
			sandbox: { sandbox_key, domain, access_token },
			path: { execution_id },
			headers: { 'X-Request-ID': request_id },
		}),
	);
	await logEventFromContext(
		ctx,
		'gmicloud.sandboxExec.get',
		{ execution_id },
		'completed',
	);
	return result;
};

export const cancel: GmicloudEndpoints['sandboxExecCancel'] = async (
	ctx,
	input,
) => {
	const { sandbox_key, domain, access_token, execution_id, request_id } =
		GmicloudEndpointInputSchemas.sandboxExecCancel.parse(input);
	const result = GmicloudEndpointOutputSchemas.sandboxExecCancel.parse(
		await makeGmicloudRequest(ctx, {
			api: 'sandbox',
			method: 'POST',
			url: 'executions/{execution_id}/cancel',
			sandbox: { sandbox_key, domain, access_token },
			path: { execution_id },
			headers: { 'X-Request-ID': request_id },
		}),
	);
	await logEventFromContext(
		ctx,
		'gmicloud.sandboxExec.cancel',
		{ execution_id },
		'completed',
	);
	return result;
};
