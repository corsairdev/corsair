import { logEventFromContext } from 'corsair/core';
import { gongRequest } from '../client';
import type { GongCrmInputs, GongCrmOutputs } from './crm-types';
import type { GongFamilyContext } from './family-context';

async function run<K extends keyof GongCrmInputs>(
	ctx: GongFamilyContext,
	action: K,
	method: 'GET' | 'PUT' | 'POST' | 'DELETE',
	path: string,
	input: GongCrmInputs[K],
	query?: Record<string, unknown>,
	body?: unknown,
	formData?: Record<string, Blob | string>,
): Promise<GongCrmOutputs[K]> {
	const options = ctx.options;
	if (!options.baseUrl) throw new Error('Gong baseUrl is required');
	const credentials =
		options.authType === 'oauth_2'
			? { type: 'bearer' as const, accessToken: ctx.key }
			: options.accessKey && options.accessKeySecret
				? {
						type: 'basic' as const,
						accessKey: options.accessKey,
						accessKeySecret: options.accessKeySecret,
					}
				: (() => {
						throw new Error(
							'Gong Basic authentication requires accessKey and accessKeySecret',
						);
					})();
	const response = await gongRequest<GongCrmOutputs[K]>({
		baseUrl: options.baseUrl,
		credentials,
		method,
		path,
		query,
		body,
		formData,
	});
	await logEventFromContext(
		ctx,
		`gong.crm.${action}`,
		method === 'POST' && formData
			? {
					integrationId: (input as GongCrmInputs['uploadObjects'])
						.integrationId,
				}
			: input,
		'completed',
	);
	return response;
}

export const listCrmIntegrations = (
	ctx: GongFamilyContext,
	input: GongCrmInputs['listIntegrations'],
) => run(ctx, 'listIntegrations', 'GET', '/v2/crm/integrations', input);
export const registerCrmIntegration = (
	ctx: GongFamilyContext,
	input: GongCrmInputs['registerIntegration'],
) =>
	run(
		ctx,
		'registerIntegration',
		'PUT',
		'/v2/crm/integrations',
		input,
		undefined,
		input,
	);
export const deleteCrmIntegration = (
	ctx: GongFamilyContext,
	input: GongCrmInputs['deleteIntegration'],
) =>
	run(ctx, 'deleteIntegration', 'DELETE', '/v2/crm/integrations', input, input);
export const listCrmSchemaFields = (
	ctx: GongFamilyContext,
	input: GongCrmInputs['listSchemaFields'],
) => run(ctx, 'listSchemaFields', 'GET', '/v2/crm/entity-schema', input, input);
export const uploadCrmSchemaFields = (
	ctx: GongFamilyContext,
	input: GongCrmInputs['uploadSchemaFields'],
) => {
	const { fields, ...query } = input;
	return run(
		ctx,
		'uploadSchemaFields',
		'POST',
		'/v2/crm/entity-schema',
		input,
		query,
		fields,
	);
};
export const getCrmObjects = (
	ctx: GongFamilyContext,
	input: GongCrmInputs['getObjects'],
) => {
	const { objectsCrmIds, ...query } = input;
	return run(
		ctx,
		'getObjects',
		'GET',
		'/v2/crm/entities',
		input,
		query,
		objectsCrmIds,
	);
};
export const uploadCrmObjects = (
	ctx: GongFamilyContext,
	input: GongCrmInputs['uploadObjects'],
) => {
	const { dataFile, ...query } = input;
	return run(
		ctx,
		'uploadObjects',
		'POST',
		'/v2/crm/entities',
		input,
		query,
		undefined,
		{ dataFile },
	);
};
export const getCrmRequestStatus = (
	ctx: GongFamilyContext,
	input: GongCrmInputs['getRequestStatus'],
) =>
	run(ctx, 'getRequestStatus', 'GET', '/v2/crm/request-status', input, input);
