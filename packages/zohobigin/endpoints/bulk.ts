import { makeZohoBiginRequest } from '../client';
import type {
	ZohoBiginEndpointInputs,
	ZohoBiginEndpointOutputs,
	ZohoBiginEndpoints,
} from '../index';

export const createBulkReadJob: ZohoBiginEndpoints['createBulkReadJob'] =
	async (ctx, input: ZohoBiginEndpointInputs['createBulkReadJob']) => {
		return await makeZohoBiginRequest<
			ZohoBiginEndpointOutputs['createBulkReadJob']
		>('read', ctx.key, {
			method: 'POST',
			body: input,
			baseUrl: 'https://www.zohoapis.com/bigin/bulk/v2',
		});
	};

export const getBulkReadJobStatus: ZohoBiginEndpoints['getBulkReadJobStatus'] =
	async (ctx, input: ZohoBiginEndpointInputs['getBulkReadJobStatus']) => {
		const { job_id } = input;
		return await makeZohoBiginRequest<
			ZohoBiginEndpointOutputs['getBulkReadJobStatus']
		>(`read/${job_id}`, ctx.key, {
			method: 'GET',
			baseUrl: 'https://www.zohoapis.com/bigin/bulk/v2',
		});
	};

export const downloadBulkReadResult: ZohoBiginEndpoints['downloadBulkReadResult'] =
	async (ctx, input: ZohoBiginEndpointInputs['downloadBulkReadResult']) => {
		const { job_id } = input;
		return await makeZohoBiginRequest<
			ZohoBiginEndpointOutputs['downloadBulkReadResult']
		>(`read/${job_id}/result`, ctx.key, {
			method: 'GET',
			baseUrl: 'https://www.zohoapis.com/bigin/bulk/v2',
		});
	};
