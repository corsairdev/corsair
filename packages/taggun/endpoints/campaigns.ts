import type { TaggunEndpoints } from '..';
import { call, compact } from './call';
import {
	TaggunEndpointInputSchemas as Inputs,
	TaggunEndpointOutputSchemas as Outputs,
} from './types';

export const list: TaggunEndpoints['campaignsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.list',
			input: Inputs.campaignsList,
			output: Outputs.campaignsList,
		},
		input,
		() => ({
			method: 'GET',
			path: '/api/validation/v1/campaign/settings/list',
		}),
		{
			// The documented answer is a bare array. Wrapping a string, which is
			// what an account without the feature or an unauthenticated proxy can
			// return, must fail rather than read as one long campaign ID.
			log: (_parsed, result) => ({ count: result.length }),
		},
	);

export const get: TaggunEndpoints['campaignsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.get',
			input: Inputs.campaignsGet,
			output: Outputs.campaignsGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/api/validation/v1/campaign/settings/${encodeURIComponent(parsed.campaignId)}`,
		}),
		{
			log: (parsed, result) => ({
				campaignId: parsed.campaignId,
				sections: Object.keys(result).join(','),
			}),
		},
	);

export const create: TaggunEndpoints['campaignsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.create',
			input: Inputs.campaignsCreate,
			output: Outputs.campaignsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `/api/validation/v1/campaign/settings/create/${encodeURIComponent(parsed.campaignId)}`,
			body: compact({ ...parsed.settings }),
		}),
		{
			log: (parsed, result) => ({
				campaignId: parsed.campaignId,
				statusCode: result.statusCode,
			}),
		},
	);

export const update: TaggunEndpoints['campaignsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.update',
			input: Inputs.campaignsUpdate,
			output: Outputs.campaignsUpdate,
		},
		input,
		(parsed) => ({
			method: 'PUT',
			path: `/api/validation/v1/campaign/settings/update/${encodeURIComponent(parsed.campaignId)}`,
			body: compact({ ...parsed.settings }),
		}),
		{
			log: (parsed, result) => ({
				campaignId: parsed.campaignId,
				result: result.result,
			}),
		},
	);

export const remove: TaggunEndpoints['campaignsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.delete',
			input: Inputs.campaignsDelete,
			output: Outputs.campaignsDelete,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/api/validation/v1/campaign/settings/delete/${encodeURIComponent(parsed.campaignId)}`,
		}),
		{
			log: (parsed, result) => ({
				campaignId: parsed.campaignId,
				result: result.result,
			}),
		},
	);

export const validateFile: TaggunEndpoints['campaignsValidateFile'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'campaigns.validateFile',
			input: Inputs.campaignsValidateFile,
			output: Outputs.campaignsValidateFile,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/validation/v1/campaign/receipt-validation/file',
			formData: compact({
				file: parsed.file,
				campaignId: parsed.campaignId,
				language: parsed.language,
				near: parsed.near,
				ipAddress: parsed.ipAddress,
				incognito: parsed.incognito,
				userId: parsed.userId,
				subAccountId: parsed.subAccountId,
				referenceId: parsed.referenceId,
			}),
		}),
		{
			log: (parsed, result) => ({
				campaignId: parsed.campaignId,
				trackingId: result.trackingId,
				successful: result.successful,
			}),
		},
	);

export const validateUrl: TaggunEndpoints['campaignsValidateUrl'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'campaigns.validateUrl',
			input: Inputs.campaignsValidateUrl,
			output: Outputs.campaignsValidateUrl,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/validation/v1/campaign/receipt-validation/url',
			body: compact({
				campaignId: parsed.campaignId,
				url: parsed.url,
				headers: parsed.headers,
				language: parsed.language,
				near: parsed.near,
				ipAddress: parsed.ipAddress,
				incognito: parsed.incognito,
				userId: parsed.userId,
				subAccountId: parsed.subAccountId,
				referenceId: parsed.referenceId,
			}),
		}),
		{
			log: (parsed, result) => ({
				campaignId: parsed.campaignId,
				trackingId: result.trackingId,
				successful: result.successful,
			}),
		},
	);
