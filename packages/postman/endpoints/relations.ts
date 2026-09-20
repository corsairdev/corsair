import { logEventFromContext } from 'corsair/core';
import type { PostmanEndpoints } from '..';
import { makePostmanRequest } from '../client';
import type { PostmanEndpointOutputs } from './types';

type Versioned = { apiId: string; versionId: string };

async function getVersioned(
	ctx: Parameters<PostmanEndpoints['apisListReleases']>[0],
	input: Versioned,
	url: string,
	event: string,
): Promise<Record<string, unknown>> {
	const response = await makePostmanRequest<Record<string, unknown>>(
		url,
		ctx.key,
		{
			method: 'GET',
			path: {
				apiId: input.apiId,
				versionId: input.versionId,
			},
		},
	);
	await logEventFromContext(ctx, event, { ...input }, 'completed');
	return response;
}

export const create: PostmanEndpoints['apisCreateRelations'] = async (
	ctx,
	input,
) => {
	const { apiId, versionId, ...body } = input;
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['apisCreateRelations']
	>('/apis/{apiId}/versions/{versionId}/relations', ctx.key, {
		method: 'POST',
		path: { apiId, versionId },
		body,
	});
	await logEventFromContext(
		ctx,
		'postman.apis.createRelations',
		{ apiId, versionId },
		'completed',
	);
	return response;
};

export const listReleases: PostmanEndpoints['apisListReleases'] = (
	ctx,
	input,
) =>
	getVersioned(
		ctx,
		input,
		'/apis/{apiId}/versions/{versionId}/releases',
		'postman.apis.listReleases',
	);

export const listLinked: PostmanEndpoints['apisGetLinkedRelations'] = (
	ctx,
	input,
) =>
	getVersioned(
		ctx,
		input,
		'/apis/{apiId}/versions/{versionId}/relations',
		'postman.apis.getLinkedRelations',
	);

export const listTest: PostmanEndpoints['apisGetTestRelations'] = (ctx, input) =>
	getVersioned(
		ctx,
		input,
		'/apis/{apiId}/versions/{versionId}/relations/test',
		'postman.apis.getTestRelations',
	);

export const listContractTest: PostmanEndpoints['apisGetContractTestRelations'] =
	(ctx, input) =>
		getVersioned(
			ctx,
			input,
			'/apis/{apiId}/versions/{versionId}/relations/contracttest',
			'postman.apis.getContractTestRelations',
		);

export const listEnvironment: PostmanEndpoints['apisGetEnvironmentRelations'] =
	(ctx, input) =>
		getVersioned(
			ctx,
			input,
			'/apis/{apiId}/versions/{versionId}/relations/environment',
			'postman.apis.getEnvironmentRelations',
		);

export const listIntegrationTest: PostmanEndpoints['apisGetIntegrationTestRelations'] =
	(ctx, input) =>
		getVersioned(
			ctx,
			input,
			'/apis/{apiId}/versions/{versionId}/relations/integrationtest',
			'postman.apis.getIntegrationTestRelations',
		);

export const listTestSuite: PostmanEndpoints['apisGetTestSuiteRelations'] = (
	ctx,
	input,
) =>
	getVersioned(
		ctx,
		input,
		'/apis/{apiId}/versions/{versionId}/relations/testsuite',
		'postman.apis.getTestSuiteRelations',
	);

export const listUnclassified: PostmanEndpoints['apisGetUnclassifiedRelations'] =
	(ctx, input) =>
		getVersioned(
			ctx,
			input,
			'/apis/{apiId}/versions/{versionId}/relations/unclassified',
			'postman.apis.getUnclassifiedRelations',
		);

export const listDocumentation: PostmanEndpoints['apisGetDocumentationRelations'] =
	(ctx, input) =>
		getVersioned(
			ctx,
			input,
			'/apis/{apiId}/versions/{versionId}/relations/documentation',
			'postman.apis.getDocumentationRelations',
		);
