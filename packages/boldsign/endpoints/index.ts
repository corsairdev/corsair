import { logEventFromContext } from 'corsair/core';
import type { BoldsignEndpoints } from '..';
import { makeBoldsignRequest } from '../client';
import {
	BoldsignEndpointInputSchemas,
	BoldsignEndpointOutputSchemas,
} from './types';

function toUploadFile(base64Content: string, mimeType: string): string {
	return base64Content.startsWith('data:')
		? base64Content
		: `data:${mimeType};base64,${base64Content}`;
}

function authTypeFromContext(ctx: {
	options?: { authType?: 'api_key' | 'oauth_2' };
}): 'api_key' | 'oauth_2' {
	// Default matches the plugin's defaultAuthType (oauth_2 in index.ts).
	return ctx.options?.authType ?? 'oauth_2';
}

export const CustomFields = {
	create: (async (ctx, input) => {
		const validInput =
			BoldsignEndpointInputSchemas.createCustomField.parse(input);
		const response = await makeBoldsignRequest(
			'/v1/customField/create',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{ method: 'POST', body: validInput },
		);
		const parsed =
			BoldsignEndpointOutputSchemas.createCustomField.parse(response);
		await logEventFromContext(
			ctx,
			'boldsign.customFields.create',
			{ ...validInput },
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['createCustomField'],

	edit: (async (ctx, input) => {
		const { customFieldId, ...body } =
			BoldsignEndpointInputSchemas.editCustomField.parse(input);
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
			{ customFieldId, ...body },
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['editCustomField'],
};

export const Brands = {
	get: (async (ctx, input) => {
		const validInput =
			BoldsignEndpointInputSchemas.getBrandDetails.parse(input);
		const response = await makeBoldsignRequest(
			'/v1/brand/get',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{ method: 'GET', query: { brandId: validInput.brandId } },
		);
		const parsed =
			BoldsignEndpointOutputSchemas.getBrandDetails.parse(response);
		await logEventFromContext(
			ctx,
			'boldsign.brands.get',
			{ ...validInput },
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['getBrandDetails'],

	list: (async (ctx, input) => {
		const validInput = BoldsignEndpointInputSchemas.listBrands.parse(input);
		const response = await makeBoldsignRequest(
			'/v1/brand/list',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{ method: 'GET' },
		);
		const parsed = BoldsignEndpointOutputSchemas.listBrands.parse(response);
		await logEventFromContext(
			ctx,
			'boldsign.brands.list',
			{ ...validInput },
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['listBrands'],
};

export const Documents = {
	createEmbeddedRequestLink: (async (ctx, input) => {
		const validInput =
			BoldsignEndpointInputSchemas.createEmbeddedRequestLink.parse(input);
		const response = await makeBoldsignRequest(
			'/v1/document/createEmbeddedRequestUrl',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{ method: 'POST', body: validInput },
		);
		const parsed =
			BoldsignEndpointOutputSchemas.createEmbeddedRequestLink.parse(response);
		await logEventFromContext(
			ctx,
			'boldsign.documents.createEmbeddedRequestLink',
			{ ...validInput },
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['createEmbeddedRequestLink'],

	send: (async (ctx, input) => {
		const validInput = BoldsignEndpointInputSchemas.sendDocument.parse(input);
		const response = await makeBoldsignRequest(
			'/v1/document/send',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{ method: 'POST', body: validInput },
		);
		const parsed = BoldsignEndpointOutputSchemas.sendDocument.parse(response);
		await logEventFromContext(
			ctx,
			'boldsign.documents.send',
			{ ...validInput },
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['sendDocument'],

	editBeta: (async (ctx, input) => {
		const { documentId, ...body } =
			BoldsignEndpointInputSchemas.editDocumentBeta.parse(input);
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
			{ documentId, ...body },
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['editDocumentBeta'],

	extendExpiry: (async (ctx, input) => {
		const { documentId, newExpiryValue, warnPrior, onBehalfOf } =
			BoldsignEndpointInputSchemas.extendDocumentExpiry.parse(input);
		// Body keys use the PascalCase names from
		// https://developers.boldsign.com/documents/extend-document-expiry
		await makeBoldsignRequest(
			'/v1/document/extendExpiry',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{
				method: 'PATCH',
				query: { documentId },
				body: {
					NewExpiryValue: newExpiryValue,
					WarnPrior: warnPrior,
					OnBehalfOf: onBehalfOf,
				},
			},
		);
		const parsed = BoldsignEndpointOutputSchemas.extendDocumentExpiry.parse({
			success: true,
		});
		await logEventFromContext(
			ctx,
			'boldsign.documents.extendExpiry',
			{ documentId, newExpiryValue, warnPrior, onBehalfOf },
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['extendDocumentExpiry'],

	removeAuthentication: (async (ctx, input) => {
		const { documentId, emailId, zOrder, onBehalfOf } =
			BoldsignEndpointInputSchemas.removeDocumentAuthentication.parse(input);
		// Query param is lowercase `documentId` and body keys use the
		// PascalCase names from
		// https://developers.boldsign.com/documents/remove-authentication-from-the-document
		await makeBoldsignRequest(
			'/v1/document/RemoveAuthentication',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{
				method: 'PATCH',
				query: { documentId },
				body: { EmailId: emailId, zOrder, OnBehalfOf: onBehalfOf },
			},
		);
		const parsed =
			BoldsignEndpointOutputSchemas.removeDocumentAuthentication.parse({
				success: true,
			});
		await logEventFromContext(
			ctx,
			'boldsign.documents.removeAuthentication',
			{ documentId, emailId, zOrder, onBehalfOf },
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['removeDocumentAuthentication'],

	list: (async (ctx, input) => {
		const validInput = BoldsignEndpointInputSchemas.listDocuments.parse(input);
		const response = await makeBoldsignRequest(
			'/v1/document/list',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{ method: 'GET', query: validInput },
		);
		const parsed = BoldsignEndpointOutputSchemas.listDocuments.parse(response);
		await logEventFromContext(
			ctx,
			'boldsign.documents.list',
			{ ...validInput },
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['listDocuments'],

	listBehalf: (async (ctx, input) => {
		const validInput =
			BoldsignEndpointInputSchemas.listBehalfDocuments.parse(input);
		const response = await makeBoldsignRequest(
			'/v1/document/behalfList',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{ method: 'GET', query: validInput },
		);
		const parsed =
			BoldsignEndpointOutputSchemas.listBehalfDocuments.parse(response);
		await logEventFromContext(
			ctx,
			'boldsign.documents.listBehalf',
			{ ...validInput },
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['listBehalfDocuments'],

	listTeam: (async (ctx, input) => {
		const validInput =
			BoldsignEndpointInputSchemas.listTeamDocuments.parse(input);
		const response = await makeBoldsignRequest(
			'/v1/document/teamlist',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{ method: 'GET', query: validInput },
		);
		const parsed =
			BoldsignEndpointOutputSchemas.listTeamDocuments.parse(response);
		await logEventFromContext(
			ctx,
			'boldsign.documents.listTeam',
			{ ...validInput },
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['listTeamDocuments'],
};

export const Plan = {
	getApiCreditsCount: (async (ctx, input) => {
		const validInput =
			BoldsignEndpointInputSchemas.getApiCreditsCount.parse(input);
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
			{ ...validInput },
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['getApiCreditsCount'],
};

export const Helpers = {
	uploadFile: (async (ctx, input) => {
		const validInput =
			BoldsignEndpointInputSchemas.uploadFileHelper.parse(input);
		const file = {
			base64: toUploadFile(validInput.base64Content, validInput.mimeType),
			fileName: validInput.fileName,
		};
		const parsed = BoldsignEndpointOutputSchemas.uploadFileHelper.parse({
			file,
		});
		await logEventFromContext(
			ctx,
			'boldsign.helpers.uploadFile',
			{ fileName: validInput.fileName, mimeType: validInput.mimeType },
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['uploadFileHelper'],
};

export * from './types';
