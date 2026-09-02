import { logEventFromContext } from 'corsair/core';
import type { BoldsignEndpoints } from '..';
import { makeBoldsignRequest } from '../client';
import { BoldsignEndpointOutputSchemas } from './types';

function withListQuery<T extends Record<string, unknown>>(input: T): T {
	return input;
}

function toUploadFile(base64Content: string, mimeType: string): string {
	return base64Content.startsWith('data:')
		? base64Content
		: `data:${mimeType};base64,${base64Content}`;
}

function authTypeFromContext(ctx: {
	options?: { authType?: 'api_key' | 'oauth_2' };
}): 'api_key' | 'oauth_2' {
	return ctx.options?.authType ?? 'api_key';
}

export const CustomFields = {
	create: (async (ctx, input) => {
		const response = await makeBoldsignRequest(
			'/v1/customField/create',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{ method: 'POST', body: input },
		);
		const parsed =
			BoldsignEndpointOutputSchemas.createCustomField.parse(response);
		await logEventFromContext(
			ctx,
			'boldsign.customFields.create',
			{ ...input },
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['createCustomField'],

	edit: (async (ctx, input) => {
		const { customFieldId, ...body } = input;
		const response = await makeBoldsignRequest(
			'/v1/customField/edit',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{
				method: 'POST',
				query: { customFieldId },
				body,
			},
		);
		const parsed =
			BoldsignEndpointOutputSchemas.editCustomField.parse(response);
		await logEventFromContext(
			ctx,
			'boldsign.customFields.edit',
			{ ...input },
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['editCustomField'],
};

export const Brands = {
	get: (async (ctx, input) => {
		const response = await makeBoldsignRequest(
			'/v1/brand/get',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{ method: 'GET', query: { brandId: input.brandId } },
		);
		const parsed =
			BoldsignEndpointOutputSchemas.getBrandDetails.parse(response);
		await logEventFromContext(
			ctx,
			'boldsign.brands.get',
			{ ...input },
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['getBrandDetails'],

	list: (async (ctx, input) => {
		const response = await makeBoldsignRequest(
			'/v1/brand/list',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{ method: 'GET' },
		);
		const parsed = BoldsignEndpointOutputSchemas.listBrands.parse(response);
		await logEventFromContext(
			ctx,
			'boldsign.brands.list',
			{ ...input },
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['listBrands'],
};

export const Documents = {
	createEmbeddedRequestLink: (async (ctx, input) => {
		const response = await makeBoldsignRequest(
			'/v1/document/createEmbeddedRequestUrl',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{ method: 'POST', body: input },
		);
		const parsed =
			BoldsignEndpointOutputSchemas.createEmbeddedRequestLink.parse(response);
		await logEventFromContext(
			ctx,
			'boldsign.documents.createEmbeddedRequestLink',
			{ ...input },
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['createEmbeddedRequestLink'],

	send: (async (ctx, input) => {
		const response = await makeBoldsignRequest(
			'/v1/document/send',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{ method: 'POST', body: input },
		);
		const parsed = BoldsignEndpointOutputSchemas.sendDocument.parse(response);
		await logEventFromContext(
			ctx,
			'boldsign.documents.send',
			{ ...input },
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['sendDocument'],

	editBeta: (async (ctx, input) => {
		const { documentId, ...body } = input;
		const response = await makeBoldsignRequest(
			'/v1/document/edit',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{ method: 'PUT', query: { documentId }, body },
		);
		const parsed =
			BoldsignEndpointOutputSchemas.editDocumentBeta.parse(response);
		await logEventFromContext(
			ctx,
			'boldsign.documents.editBeta',
			{ ...input },
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['editDocumentBeta'],

	extendExpiry: (async (ctx, input) => {
		const { documentId, ...body } = input;
		await makeBoldsignRequest(
			'/v1/document/extendExpiry',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{ method: 'PATCH', query: { documentId }, body },
		);
		const parsed = BoldsignEndpointOutputSchemas.extendDocumentExpiry.parse({
			success: true,
		});
		await logEventFromContext(
			ctx,
			'boldsign.documents.extendExpiry',
			{ ...input },
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['extendDocumentExpiry'],

	removeAuthentication: (async (ctx, input) => {
		const { documentId, ...body } = input;
		await makeBoldsignRequest(
			'/v1/document/RemoveAuthentication',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{ method: 'PATCH', query: { DocumentId: documentId }, body },
		);
		const parsed =
			BoldsignEndpointOutputSchemas.removeDocumentAuthentication.parse({
				success: true,
			});
		await logEventFromContext(
			ctx,
			'boldsign.documents.removeAuthentication',
			{ ...input },
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['removeDocumentAuthentication'],

	list: (async (ctx, input) => {
		const response = await makeBoldsignRequest(
			'/v1/document/list',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{ method: 'GET', query: withListQuery(input) },
		);
		const parsed = BoldsignEndpointOutputSchemas.listDocuments.parse(response);
		await logEventFromContext(
			ctx,
			'boldsign.documents.list',
			{ ...input },
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['listDocuments'],

	listBehalf: (async (ctx, input) => {
		const response = await makeBoldsignRequest(
			'/v1/document/behalfList',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{ method: 'GET', query: withListQuery(input) },
		);
		const parsed =
			BoldsignEndpointOutputSchemas.listBehalfDocuments.parse(response);
		await logEventFromContext(
			ctx,
			'boldsign.documents.listBehalf',
			{ ...input },
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['listBehalfDocuments'],

	listTeam: (async (ctx, input) => {
		const response = await makeBoldsignRequest(
			'/v1/document/teamlist',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{ method: 'GET', query: withListQuery(input) },
		);
		const parsed =
			BoldsignEndpointOutputSchemas.listTeamDocuments.parse(response);
		await logEventFromContext(
			ctx,
			'boldsign.documents.listTeam',
			{ ...input },
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['listTeamDocuments'],
};

export const Plan = {
	getApiCreditsCount: (async (ctx, input) => {
		const response = await makeBoldsignRequest(
			'/v1/plan/apiCreditsCount',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{ method: 'GET' },
		);
		const parsed =
			BoldsignEndpointOutputSchemas.getApiCreditsCount.parse(response);
		await logEventFromContext(
			ctx,
			'boldsign.plan.getApiCreditsCount',
			{ ...input },
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['getApiCreditsCount'],
};

export const Helpers = {
	uploadFile: (async (ctx, input) => {
		const file = {
			base64: toUploadFile(input.base64Content, input.mimeType),
			fileName: input.fileName,
		};
		const parsed = BoldsignEndpointOutputSchemas.uploadFileHelper.parse({
			file,
		});
		await logEventFromContext(
			ctx,
			'boldsign.helpers.uploadFile',
			{ fileName: input.fileName, mimeType: input.mimeType },
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['uploadFileHelper'],
};

export * from './types';
